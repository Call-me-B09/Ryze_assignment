const planner = require('./services/planner');
const generator = require('./services/generator');
require('dotenv').config();

const testModalState = async () => {
    console.log("=== Testing Modal Default State ===");

    // Prompt asks for a user management UI, which implies a modal for "Add User"
    const prompt = "Create a user management dashboard.";

    try {
        console.log("Generating Plan...");
        const plan = await planner(prompt, null);

        console.log("Generating Code...");
        const code = await generator(plan, null, prompt);

        console.log("\n--- Modal State Check ---");

        const hasModal = code.includes("<Modal");
        const isOpenFalse = code.includes("isOpen={false}");
        const isOpenTrue = code.includes("isOpen={true}");

        if (hasModal) {
            if (isOpenFalse && !isOpenTrue) {
                console.log("[PASS] Modal generated with isOpen={false}.");
            } else if (isOpenTrue) {
                console.log("[FAIL] Modal generated with isOpen={true}.");
            } else {
                console.log("[FAIL] Modal isOpen prop missing or unclear.");
            }
        } else {
            console.log("[WARN] No Modal generated. Cannot verify state.");
        }

        console.log("\nCode Snippet:\n", code.substring(0, 500).replace(/\n/g, ' '));
        // console.log("Full Code:", code);

    } catch (error) {
        console.error("Test Failed:", error);
    }
};

testModalState();
