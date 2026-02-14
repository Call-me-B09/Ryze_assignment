const planner = require('./services/planner');
const generator = require('./services/generator');
require('dotenv').config();

const testUniversal = async () => {
    console.log("=== Universal Compatibility Test ===");

    const scenarios = [
        { type: "Music App", prompt: "Create a music player interface." },
        { type: "Dashboard", prompt: "Create an admin dashboard." },
        { type: "Ecommerce", prompt: "Create an online store." },
        { type: "Chat App", prompt: "Create a chat application." },
        { type: "Login Page", prompt: "Create a login page." }
    ];

    for (const scenario of scenarios) {
        console.log(`\n--- Scenario: ${scenario.type} ---`);
        try {
            console.log("Generating Plan...");
            const plan = await planner(scenario.prompt, null);

            console.log("Generating Code...");
            const code = await generator(plan, null, scenario.prompt);

            // Verification Logic
            const checks = {
                hasNavbar: code.includes("<Navbar"),
                hasSidebar: scenario.type !== "Login Page" ? code.includes("<Sidebar") : true, // Login might not have sidebar
                hasMainCard: code.includes("<Card"),
                hasButtons: code.includes("<Button"),
                hasInputs: code.includes("<Input"),
                noHTML: !code.match(/<(div|span|h1|p|section)\b/),
                noStyle: !code.includes("style={"),
                noClassName: !code.includes("className=")
            };

            const allPass = Object.values(checks).every(Boolean);

            if (allPass) {
                console.log(`[PASS] ${scenario.type} generated correctly.`);
            } else {
                console.log(`[FAIL] ${scenario.type} failed checks:`, checks);
            }

            // Context Check
            if (scenario.type === "Music App" && !code.includes("Songs")) console.log("[WARN] Music context missing 'Songs'");
            if (scenario.type === "Ecommerce" && !code.includes("Product")) console.log("[WARN] Ecommerce context missing 'Product'");

        } catch (error) {
            console.error(`[ERROR] ${scenario.type} failed:`, error.message);
        }
    }
};

testUniversal();
