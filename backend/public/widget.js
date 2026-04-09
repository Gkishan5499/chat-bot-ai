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
    const botName = currentScript.getAttribute('data-name') || "AI Assistant";
    // We assume backend is mounted exactly from the same host dispensing the script, but default to localhost for test
    const apiUrl = currentScript.src.includes('localhost') ? 'http://localhost:5001/api' : 'https://api.botflow.io/api';
    
    // Generate an anonymous visitor session ID that lasts for the page view
    const visitorId = "visitor-" + Math.random().toString(36).substr(2, 9);
    let messages = [];
    let isOpen = false;
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

    // Rendering Messages
    const renderMessages = () => {
        // Remove existing bubbles
        shadow.querySelectorAll('.bubble').forEach(el => el.remove());
        
        if (messages.length > 0) {
            emptyState.style.display = 'none';
        }

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

    // Form Submission
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text || isLoading) return;

        // Push User Message
        messages.push({ role: 'user', content: text });
        chatInput.value = '';
        renderMessages();
        toggleLoading(true);

        try {
            const res = await fetch(`${apiUrl}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    apiKey: apiKey,
                    visitorId: visitorId,
                    history: messages.slice(0, -1) // Excluding the one we just pushed
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
    });
})();
