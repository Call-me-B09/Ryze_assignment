const { generateContentWithRetry } = require('./utils/geminiHelper');
require('dotenv').config();

const testGemini = async () => {
    console.log("Testing Gemini API connection...");
    try {
        const start = Date.now();
        const result = await generateContentWithRetry([{ text: "Say 'Hello, World!' if you can hear me." }]);
        const duration = Date.now() - start;
        console.log(`Success! Response received in ${duration}ms:`);
        console.log(result.response.text());
    } catch (error) {
        console.error("Test failed:", error);
    }
};

testGemini();
