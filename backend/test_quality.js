const planner = require('./services/planner');
const generator = require('./services/generator');
require('dotenv').config();

const testQuality = async () => {
    console.log("=== Testing UI Quality ===");

    const prompt = "Create a user management dashboard with a user table and settings.";

    try {
        console.log("Generating Plan...");
        const plan = await planner(prompt, null);

        console.log("Generating Code...");
        const code = await generator(plan, null, prompt);

        console.log("\n--- Generated Code Length: " + code.length + " ---");

        // Checks
        let failures = [];

        if (code.includes("className=") || code.includes("style={")) {
            failures.push("Found forbidden CSS/Style usage.");
        }

        if (code.includes("<Navbar />") || code.includes("<Navbar></Navbar>")) {
            failures.push("Found empty Navbar.");
        }

        if (code.includes("<Table />") || !code.includes("data={")) {
            failures.push("Found Table without data.");
        }

        if (failures.length > 0) {
            console.log("\n[FAILURE] Quality checks failed:");
            failures.forEach(f => console.log("- " + f));
            console.log("\nCode Snippet:\n", code.substring(0, 500));
        } else {
            console.log("\n[SUCCESS] All quality checks passed!");
            console.log("- No CSS/Style found.");
            console.log("- Navbar has content.");
            console.log("- Table has data.");
        }

    } catch (error) {
        console.error("Test Failed:", error);
    }
};

testQuality();
