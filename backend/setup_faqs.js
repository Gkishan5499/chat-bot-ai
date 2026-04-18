import mongoose from "mongoose";
import "dotenv/config";
import Faq from "./models/Faq.js";

const seedFaqs = [
  {
    question: "How do I create a tawk.to account?",
    answer:
      "Sign up for a free account: visit tawk.to and fill out the signup form with your name, email, and desired password.",
    keywords: ["sign", "signup", "register", "create", "account", "new", "tawk"],
    minMatches: 2,
    sortOrder: 1,
  },
  {
    question: "How do I log in to tawk dashboard?",
    answer: "Log in to your account: go to dashboard.tawk.to and sign in with your email and password.",
    keywords: ["log", "login", "sign in", "dashboard", "dashboard.tawk.to", "account"],
    minMatches: 1,
    sortOrder: 2,
  },
  {
    question: "How do I add the chat widget to my site?",
    answer:
      "Add the chat widget: 1) Click the Administration (gear) icon in the upper tab menu. 2) In the left menu, select Chat Widget. 3) Copy the Widget Code. 4) Add it to your site HTML before the </body> tag.",
    keywords: ["add", "install", "widget", "code", "html", "body", "script", "chat"],
    minMatches: 2,
    sortOrder: 3,
  },
  {
    question: "How can we use this on our website?",
    answer:
      "To use it on your website: sign in to dashboard.tawk.to, open Administration > Chat Widget, copy the widget code, and paste it before the </body> tag on your site.",
    keywords: ["use", "website", "site", "integrate", "embed", "setup", "add", "install"],
    minMatches: 2,
    sortOrder: 4,
  },
  {
    question: "Where can I find detailed help articles?",
    answer:
      "For more detailed information, check these articles: How to create a new account, and How to add the tawk.to widget to my website.",
    keywords: ["article", "articles", "help", "guide", "detailed", "documentation", "docs", "information"],
    minMatches: 1,
    sortOrder: 5,
  },
  {
    question: "Can I book a free onboarding call?",
    answer: "You can also book a free onboarding call with a member of our team for guided setup and best practices.",
    keywords: ["onboarding", "call", "book", "meeting", "support", "team", "free call"],
    minMatches: 1,
    sortOrder: 6,
  },
  {
    question: "Do you have pricing plans?",
    answer:
      "We offer flexible packages based on your needs: Starter for small sites, Growth for scaling teams, and Agency for multiple client websites.",
    keywords: ["price", "pricing", "cost", "plan", "package", "monthly", "subscription"],
    minMatches: 1,
    sortOrder: 7,
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes, you can start with a free trial/demo flow and test the chatbot on your website before moving to a paid plan.",
    keywords: ["free", "trial", "demo", "start free", "test"],
    minMatches: 1,
    sortOrder: 8,
  },
  {
    question: "Can I use this with WordPress or Shopify?",
    answer:
      "Yes, you can add the widget to most platforms like WordPress, Shopify, Wix, Webflow, or any custom HTML/React website using the script snippet.",
    keywords: ["wordpress", "shopify", "wix", "webflow", "react", "html", "cms"],
    minMatches: 1,
    sortOrder: 9,
  },
  {
    question: "Can I customize bot branding?",
    answer:
      "You can customize branding such as bot name, color, and tone so the chat experience matches your website style.",
    keywords: ["custom", "brand", "color", "name", "theme", "design", "logo"],
    minMatches: 1,
    sortOrder: 10,
  },
  {
    question: "How long does setup take?",
    answer:
      "Setup is quick and usually takes just a few minutes: copy the script, paste it before </body>, and publish your site.",
    keywords: ["time", "how long", "minutes", "quick", "fast", "setup time"],
    minMatches: 1,
    sortOrder: 11,
  },
  {
    question: "How can I remove the widget?",
    answer:
      "To remove the chat widget, simply delete the widget script from your website HTML or disable it from your dashboard settings.",
    keywords: ["remove", "uninstall", "delete", "disable", "turn off"],
    minMatches: 1,
    sortOrder: 12,
  },
  {
    question: "Does it work on mobile devices?",
    answer: "Yes, the chat widget is responsive and works on desktop, tablet, and mobile devices.",
    keywords: ["mobile", "phone", "responsive", "tablet", "device"],
    minMatches: 1,
    sortOrder: 13,
  },
  {
    question: "Is your chatbot secure?",
    answer:
      "We follow standard security and privacy best practices. If needed, we can also guide you on compliance setup like privacy policy and consent messaging.",
    keywords: ["security", "secure", "safe", "privacy", "gdpr", "data"],
    minMatches: 1,
    sortOrder: 14,
  },
  {
    question: "Do you support multiple languages?",
    answer: "You can configure chatbot replies for multiple languages based on your audience and business needs.",
    keywords: ["language", "multilingual", "translate", "hindi", "english", "arabic"],
    minMatches: 1,
    sortOrder: 15,
  },
  {
    question: "How does this help with leads and conversions?",
    answer:
      "The chatbot helps capture and qualify leads, then guides visitors toward actions like booking calls, sending contact details, or making a purchase.",
    keywords: ["lead", "capture", "conversion", "customer", "sales", "bookings"],
    minMatches: 1,
    sortOrder: 16,
  },
  {
    question: "Can a human agent take over chat?",
    answer: "Yes, you can set flows to hand off conversations to a human agent when needed.",
    keywords: ["human", "agent", "manual", "handoff", "transfer", "live person"],
    minMatches: 1,
    sortOrder: 17,
  },
  {
    question: "How can I contact support?",
    answer: "Sure, our team can help with setup and optimization. You can book an onboarding call for step-by-step guidance.",
    keywords: ["contact", "support", "help me", "talk to team", "reach"],
    minMatches: 1,
    sortOrder: 18,
  },
  {
    question: "Thanks",
    answer: "You are welcome. Let me know if you have any other question about setup, widget install, or onboarding.",
    keywords: ["thank", "thanks", "ok", "great"],
    minMatches: 1,
    sortOrder: 99,
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  for (const item of seedFaqs) {
    await Faq.findOneAndUpdate(
      { question: item.question },
      { ...item, isActive: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`Seeded/updated ${seedFaqs.length} FAQs`);
  process.exit(0);
}

run().catch((err) => {
  console.error("Failed to seed FAQs:", err);
  process.exit(1);
});
