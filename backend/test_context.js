const planner = require('./services/planner');
const generator = require('./services/generator');
require('dotenv').config();

const testContext = async () => {
    console.log("=== Testing Context Adaptation ===");

    const scenarios = [
        { type: "Music App", prompt: "Create a music player interface." },
        { type: "Ecommerce App", prompt: "Create an online store dashboard." }
    ];

    for (const scenario of scenarios) {
        console.log(`\n--- Scenario: ${scenario.type} ---`);
        try {
            console.log("Generating Plan...");
            const plan = await planner(scenario.prompt, null);

            console.log("Generating Code...");
            const code = await generator(plan, null, scenario.prompt);

            console.log("Checking Content...");

            if (scenario.type === "Music App") {
                if (code.includes("Songs") || code.includes("Artist") || code.includes("Album")) {
                    console.log("[SUCCESS] Found Music-related terms.");
                } else {
                    console.log("[FAILURE] Missing Music terms.");
                }
            }

            if (scenario.type === "Ecommerce App") {
                if (code.includes("Product") || code.includes("Price") || code.includes("Stock") || code.includes("Shop")) {
                    console.log("[SUCCESS] Found Ecommerce-related terms.");
                } else {
                    console.log("[FAILURE] Missing Ecommerce terms.");
                }
            }

            console.log("Code Snippet (First 200 chars):", code.substring(0, 200).replace(/\n/g, ' '));

        } catch (error) {
            console.error("Test Failed:", error);
        }
    }
};

testContext();
