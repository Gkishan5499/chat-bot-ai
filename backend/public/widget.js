(function() {
    // Determine the configuration based on script tag attributes
    const currentScript = document.currentScript || (function() {
        const scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();
    
    // Fallbacks if attributes are missing
    const apiKey = currentScript.getAttribute('data-api-key');
    if (!apiKey) {
        console.error("BotFlow Widget Error: Missing 'data-api-key' attribute on script tag.");
        return;
    }

    const primaryColor = currentScript.getAttribute('data-color') || "#4F46E5";
    let botName = currentScript.getAttribute('data-name') || "AI Assistant";
    const customApiUrl = currentScript.getAttribute('data-api-url');

    // Use the same origin as the script by default so embeds work on any deployed domain.
    let apiUrl = customApiUrl;
    if (!apiUrl) {
        try {
            const scriptOrigin = new URL(currentScript.src).origin;
            apiUrl = `${scriptOrigin}/api`;
        } catch (err) {
            apiUrl = 'https://chat-bot-ai-oor0.onrender.com/api';
        }
    }
    
    // Generate an anonymous visitor session ID that lasts for the page view
    const visitorId = "visitor-" + Math.random().toString(36).substr(2, 9);
    const quickQuestions = [
        "What is BotFlow?",
        "Why should I choose BotFlow?",
        "How do I set up an AI Chatbot?",
        "I have a different question"
    ];

    const faqReplies = {
        "what is botflow?": "BotFlow is an AI chatbot platform for websites. It helps you chat with visitors, qualify leads, and turn more visitors into customers.",
        "why should i choose botflow?": "Choose BotFlow for fast setup, 24/7 lead capture, and a simple widget that works on any website.",
        "how do i set up an ai chatbot?": "Create your account, configure bot behavior, copy the widget script, and paste it on your website. You can launch in minutes.",
        "i have a different question": "Please type your question below and I will assist you with a live response."
    };

    let messages = [
        { role: 'model', content: `Hi! I am ${botName}. Ask me anything about your chatbot setup and plans.` }
    ];
    let isOpen = true;
    let isLoading = false;

    // Create container and Shadow DOM
    const container = document.createElement('div');
    container.id = "botflow-widget-container";
    document.body.appendChild(container);

    const shadow = container.attachShadow({ mode: 'open' });

    // Inner HTML Structure and Styling
    shadow.innerHTML = `
        <style>
            :host {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                font-size: 14px;
            }
            .widget-wrapper {
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 999999;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 16px;
            }
            /* The Chat Window */
            .chat-window {
                width: 350px;
                height: 500px;
                max-height: calc(100vh - 100px);
                background: #ffffff;
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid #e5e7eb;
                transform-origin: bottom right;
                transition: transform 0.2s ease, opacity 0.2s ease;
                opacity: 0;
                transform: scale(0.95);
                pointer-events: none;
            }
            .chat-window.open {
                opacity: 1;
                transform: scale(1);
                pointer-events: all;
            }
            
            /* Header */
            .header {
                background: ${primaryColor};
                padding: 16px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #ffffff;
            }
            .header-left {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .header-icon {
                width: 32px;
                height: 32px;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
            }
            .header-title {
                font-weight: 600;
                font-size: 15px;
            }
            .close-btn {
                background: transparent;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                opacity: 0.8;
                padding: 0;
                transition: opacity 0.2s;
            }
            .close-btn:hover {
                opacity: 1;
            }

            /* Log */
            .log {
                flex: 1;
                background: #f9fafb;
                padding: 20px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .bubble {
                padding: 10px 16px;
                max-width: 85%;
                font-size: 14px;
                line-height: 1.4;
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            }
            .bubble.user {
                background: ${primaryColor};
                color: #ffffff;
                align-self: flex-end;
                border-radius: 16px 16px 4px 16px;
            }
            .bubble.model {
                background: #ffffff;
                color: #1f2937;
                align-self: flex-start;
                border-radius: 16px 16px 16px 4px;
                border: 1px solid #f3f4f6;
            }
            
            .empty-state {
                text-align: center;
                color: #9ca3af;
                margin-top: 16px;
                font-size: 13px;
            }

            .quick-questions {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 8px;
                margin-top: 4px;
            }
            .quick-btn {
                border: 1px solid ${primaryColor};
                background: #ffffff;
                color: ${primaryColor};
                border-radius: 10px;
                padding: 8px 12px;
                font-size: 13px;
                cursor: pointer;
                transition: background 0.2s;
            }
            .quick-btn:hover {
                background: #f0fdf4;
            }

            .loader {
                align-self: flex-start;
                background: white;
                border: 1px solid #f3f4f6;
                padding: 10px 16px;
                border-radius: 16px 16px 16px 4px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                display: flex;
                gap: 4px;
                display: none;
            }
            .loader.active {
                display: flex;
            }
            .dot {
                width: 6px;
                height: 6px;
                background: #d1d5db;
                border-radius: 50%;
                animation: bounce 1.4s infinite ease-in-out both;
            }
            .dot:nth-child(1) { animation-delay: -0.32s; }
            .dot:nth-child(2) { animation-delay: -0.16s; }
            @keyframes bounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
            }

            /* Input Area */
            .input-area {
                padding: 12px 16px;
                background: #ffffff;
                border-top: 1px solid #f3f4f6;
                display: flex;
                gap: 8px;
            }
            .widget-footer {
                padding: 0 16px 10px;
                background: #ffffff;
                border-top: 1px solid #f8fafc;
                text-align: center;
                font-size: 11px;
                color: #9ca3af;
            }
            .text-input {
                flex: 1;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 9999px;
                padding: 10px 16px;
                font-family: inherit;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s, background 0.2s;
            }
            .text-input:focus {
                border-color: ${primaryColor};
                background: #ffffff;
            }
            .send-btn {
                background: ${primaryColor};
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.1s, opacity 0.2s;
            }
            .send-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .send-btn:active:not(:disabled) {
                transform: scale(0.95);
            }

            /* Launcher */
            .launcher {
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: ${primaryColor};
                color: white;
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                transition: transform 0.2s;
            }
            .launcher:hover {
                transform: scale(1.05);
            }
            .launcher:active {
                transform: scale(0.95);
            }
            .launcher.hidden {
                display: none;
            }
            
            @media (max-width: 480px) {
                .chat-window {
                    position: fixed;
                    bottom: 0;
                    right: 0;
                    width: 100vw;
                    height: 100vh;
                    max-height: 100vh;
                    border-radius: 0;
                }
            }
        </style>
        
        <div class="widget-wrapper">
            <!-- Chat Window -->
            <div class="chat-window" id="chatWindow">
                <div class="header">
                    <div class="header-left">
                        <div class="header-icon">🤖</div>
                        <div class="header-title">${botName}</div>
                    </div>
                    <button class="close-btn" id="closeBtn">✕</button>
                </div>
                
                <div class="log" id="chatLog">
                    <div class="empty-state" id="emptyState">Send a message to start chatting!</div>
                    <div class="quick-questions" id="quickQuestions">
                        ${quickQuestions.map((q) => `<button class="quick-btn" type="button" data-question="${q.replace(/"/g, '&quot;')}">${q}</button>`).join('')}
                    </div>
                    <div class="loader" id="loader">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>

                <form class="input-area" id="chatForm">
                    <input type="text" class="text-input" id="chatInput" placeholder="Type your message..." autocomplete="off" />
                    <button type="submit" class="send-btn" id="sendBtn">➤</button>
                </form>

                <div class="widget-footer">Powerd by Gbot-AI</div>
            </div>

            <!-- Launcher -->
            <button class="launcher" id="launcherBtn">💬</button>
        </div>
    `;

    // Elements
    const chatWindow = shadow.getElementById('chatWindow');
    const launcherBtn = shadow.getElementById('launcherBtn');
    const closeBtn = shadow.getElementById('closeBtn');
    const chatForm = shadow.getElementById('chatForm');
    const chatInput = shadow.getElementById('chatInput');
    const chatLog = shadow.getElementById('chatLog');
    const emptyState = shadow.getElementById('emptyState');
    const loader = shadow.getElementById('loader');
    const sendBtn = shadow.getElementById('sendBtn');
    const headerTitle = shadow.querySelector('.header-title');
    const quickQuestionsEl = shadow.getElementById('quickQuestions');

    const applyBotSettings = async () => {
        // If integrator already set data-name, keep it as an explicit override.
        if (currentScript.getAttribute('data-name')) return;

        try {
            const res = await fetch(`${apiUrl}/chat/bot-settings?apiKey=${encodeURIComponent(apiKey)}`);
            if (!res.ok) return;

            const data = await res.json();
            if (data?.botName && headerTitle) {
                botName = String(data.botName).trim() || botName;
                headerTitle.textContent = botName;
            }
        } catch (err) {
            // Keep local fallback name if bot settings request fails.
        }
    };

    applyBotSettings();

    // UI Toggles
    launcherBtn.addEventListener('click', () => {
        isOpen = true;
        chatWindow.classList.add('open');
        launcherBtn.classList.add('hidden');
        setTimeout(() => chatInput.focus(), 100);
    });

    closeBtn.addEventListener('click', () => {
        isOpen = false;
        chatWindow.classList.remove('open');
        launcherBtn.classList.remove('hidden');
    });

    if (isOpen) {
        chatWindow.classList.add('open');
        launcherBtn.classList.add('hidden');
    }

    // Rendering Messages
    const renderMessages = () => {
        // Remove existing bubbles
        shadow.querySelectorAll('.bubble').forEach(el => el.remove());
        
        if (messages.length > 0) {
            emptyState.style.display = 'none';
        } else {
            emptyState.style.display = 'block';
        }

        const userMessageCount = messages.filter((m) => m.role === 'user').length;
        quickQuestionsEl.style.display = userMessageCount === 0 && !isLoading ? 'flex' : 'none';

        messages.forEach(msg => {
            const el = document.createElement('div');
            el.className = 'bubble ' + msg.role;
            el.innerText = msg.content;
            chatLog.insertBefore(el, loader);
        });
        
        chatLog.scrollTop = chatLog.scrollHeight;
    };

    const toggleLoading = (state) => {
        isLoading = state;
        if (state) {
            loader.classList.add('active');
        } else {
            loader.classList.remove('active');
        }
        chatInput.disabled = state;
        sendBtn.disabled = state;
        chatLog.scrollTop = chatLog.scrollHeight;
    };

    const getFaqReply = (text) => {
        const key = String(text || '').trim().toLowerCase();
        return faqReplies[key] || null;
    };

    const sendMessage = async (text) => {
        const cleanText = String(text || '').trim();
        if (!cleanText || isLoading) return;

        messages.push({ role: 'user', content: cleanText });
        renderMessages();

        const localReply = getFaqReply(cleanText);
        if (localReply) {
            messages.push({ role: 'model', content: localReply });
            renderMessages();
            return;
        }

        toggleLoading(true);

        try {
            const res = await fetch(`${apiUrl}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: cleanText,
                    apiKey: apiKey,
                    visitorId: visitorId,
                    history: messages.slice(0, -1)
                })
            });

            const data = await res.json();
            
            if (!res.ok) {
                messages.push({ role: 'model', content: "Error: " + (data.error || "Server error") });
            } else {
                messages.push({ role: 'model', content: data.reply });
            }

        } catch (err) {
            messages.push({ role: 'model', content: "Network error. Make sure you are connected." });
        } finally {
            toggleLoading(false);
            renderMessages();
        }
    };

    shadow.querySelectorAll('.quick-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const question = btn.getAttribute('data-question') || '';
            sendMessage(question);
        });
    });

    // Form Submission
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        chatInput.value = '';
        await sendMessage(text);
    });

    renderMessages();
})();
