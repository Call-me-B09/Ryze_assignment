const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");
require('dotenv').config();

// Safely initialize Gemini (only if key exists)
let genAI = null;
let model = null;
if (process.env.GEMINI_API_KEY) {
    try {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    } catch (err) {
        console.warn("Gemini init failed:", err.message);
    }
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MAX_RETRIES = 0;
const INITIAL_BACKOFF_MS = 1000;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateContentWithGroq = async (promptParts) => {
    try {
        // Convert Gemini prompt parts (array of {text: ...}) to Groq message content
        // Gemini structure: [{ role: "user", parts: [{ text: "..." }] }] -> input is just `promptParts` here which is `[{ text: "..." }]`
        const content = promptParts.map(part => part.text).join('\n');

        console.log("Fallback: Using Groq API (llama-3.1-8b-instant)...");
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: content,
                },
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
            max_tokens: 8000,
        });

        // Mock the Gemini response structure
        const text = chatCompletion.choices[0]?.message?.content || "";
        return {
            response: {
                text: () => text
            }
        };
    } catch (error) {
        console.error("Groq API Fallback Failed:", error);
        throw error;
    }
};

const generateContentWithRetry = async (promptParts, retries = 0) => {
    // DIRECT OVERRIDE: Use Groq API only (User Request)
    try {
        console.log("Direct Mode: Using Groq API (llama-3.1-8b-instant)...");
        return await generateContentWithGroq(promptParts);
    } catch (error) {
        console.error("Groq API Request Failed:", error);
        throw error;
    }
};

module.exports = { generateContentWithRetry };
