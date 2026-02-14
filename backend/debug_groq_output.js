const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const generator = require('./services/generator');
const planner = require('./services/planner');

async function debugGroqOutput() {
    console.log("Starting Debug Process for Groq Llama-3.1-8b...");

    const userPrompt = "Create a simple music player with a list of songs and a play button.";

    try {
        console.log("1. Generating Plan...");
        const plan = await planner(userPrompt);
        console.log("Plan Generated:", JSON.stringify(plan, null, 2));

        console.log("\n2. Generating Code...");
        const code = await generator(plan, null, userPrompt);

        console.log("\n------------------ RAW OUTPUT START ------------------");
        console.log(code);
        console.log("------------------ RAW OUTPUT END --------------------\n");

        if (code.includes("Here is") || code.includes("```")) {
            console.error("FAILURE: Output contains forbidden text/markdown.");
        } else {
            console.log("SUCCESS: Output appears clean (no markdown/text detected).");
        }

        // Simple syntax check
        try {
            if (code.startsWith("<") && code.endsWith(">")) {
                console.log("Structure Check: PASS (Starts and ends with tags)");
            } else {
                console.error("Structure Check: FAIL (Does not start/end with tags)");
            }
        } catch (e) {
            console.error("Structure Check Error:", e);
        }

    } catch (error) {
        console.error("Debug Process Failed:", error);
    }
}

debugGroqOutput();
