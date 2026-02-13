const { generateContentWithRetry } = require('./utils/geminiHelper');
const planner = require('./services/planner');
const generator = require('./services/generator');
require('dotenv').config();

const testEditFlow = async () => {
    console.log("=== Testing Edit Flow ===");

    // Step 1: Initial Generation
    console.log("\n--- Step 1: Generating Initial UI ---");
    const initPrompt = "Create a simple dashboard with a navbar, sidebar, and a welcome card.";

    try {
        const plan1 = await planner(initPrompt, null);
        console.log("Plan 1 generated.");

        const code1 = await generator(plan1, null);
        console.log("Code 1 generated (Length: " + code1.length + ")");
        console.log("Code 1 Preview (Snippet):\n", code1.substring(0, 200));

        // Step 2: Edit Request
        console.log("\n--- Step 2: Requesting Edit (Change Welcome to 'Hello User') ---");
        const editPrompt = "Change the text in the welcome card to say 'Hello User'";

        const plan2 = await planner(editPrompt, code1);
        console.log("Plan 2 generated.");

        const code2 = await generator(plan2, code1);
        console.log("Code 2 generated (Length: " + code2.length + ")");

        // Verification
        if (code2.includes("Hello User")) {
            console.log("\n[SUCCESS] Edit applied successfully!");
        } else {
            console.log("\n[FAILURE] Edit NOT applied. 'Hello User' not found in code.");
            console.log("Code 2 Content:\n", code2);
        }

    } catch (error) {
        console.error("Test Failed:", error);
    }
};

testEditFlow();
