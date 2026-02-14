const planner = require('./services/planner');
const generator = require('./services/generator');
require('dotenv').config();

const testFlow = async () => {
    console.log("=== Testing Interaction Flow ===");

    // Prompt specifically asks for an action that requires a modal
    const prompt = "Create a user management dashboard where I can add new users.";

    try {
        console.log("Generating Plan...");
        const plan = await planner(prompt, null);

        console.log("Generating Code...");
        const code = await generator(plan, null, prompt);

        console.log("\n--- Flow Checks ---");

        const hasModal = code.includes("<Modal");
        // Check for a button that likely triggers it (case insensitive "Add User" or "Create")
        // Updated regex to allow whitespace or text before the keyword
        const hasButton = /<Button[^>]*>.*(Add|Create|New).*<\/Button>/i.test(code);

        if (hasModal && hasButton) {
            console.log("[SUCCESS] Modal and Trigger Button found.");
            console.log("- Modal present: true");
            console.log("- Trigger Button found: true");
        } else if (!hasModal) {
            console.log("[WARNING] No Modal generated (LLM decision).");
        } else {
            console.log("[FAILURE] Modal found but no clear Trigger Button.");
            console.log("- Modal present: true");
            console.log("- Trigger Button found: false");
        }


        console.log("\nCode Snippet:\n", code);

    } catch (error) {
        console.error("Test Failed:", error);
    }
};

testFlow();
