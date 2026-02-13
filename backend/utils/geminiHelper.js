const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Use the same model as before, or fallback to a known stable model if needed.
// The user's code was using "gemini-flash-latest" but error logs showed "gemini-3-flash".
// We'll stick to what was working or intended.
// Note: "gemini-flash-latest" is an alias.
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MAX_RETRIES = 0;
const INITIAL_BACKOFF_MS = 1000;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateContentWithGroq = async (promptParts) => {
    try {
        // Convert Gemini prompt parts (array of {text: ...}) to Groq message content
        // Gemini structure: [{ role: "user", parts: [{ text: "..." }] }] -> input is just `promptParts` here which is `[{ text: "..." }]`
        const content = promptParts.map(part => part.text).join('\n');

        console.log("Fallback: Using Groq API (llama-3.3-70b-versatile)...");
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: content,
                },
            ],
            model: "llama-3.3-70b-versatile",
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
    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: promptParts }]
        });
        return result;
    } catch (error) {
        if (
            (error.status === 503 || error.status === 429 || error.message.includes('503') || error.message.includes('429')) &&
            retries < MAX_RETRIES
        ) {
            const backoffTime = INITIAL_BACKOFF_MS * Math.pow(2, retries);
            console.warn(`Gemini API Error (${error.status || error.message}). Retrying in ${backoffTime}ms... (Attempt ${retries + 1}/${MAX_RETRIES})`);
            await delay(backoffTime);
            return generateContentWithRetry(promptParts, retries + 1);
        } else {
            console.error(`Gemini API Request Failed after ${retries} retries. Switching to fallback...`);
            try {
                return await generateContentWithGroq(promptParts);
            } catch (fallbackError) {
                console.error("All API attempts failed (Gemini + Groq).");
                throw error; // Throw original error to preserve context, or fallbackError
            }
        }
    }
};

module.exports = { generateContentWithRetry };
