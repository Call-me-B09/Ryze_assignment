const planner = require('./services/planner');
const generator = require('./services/generator');
require('dotenv').config();

const testStructure = async () => {
    console.log("=== Testing Structural Integrity ===");

    const prompt = "Create a customer management dashboard.";

    try {
        console.log("Generating Plan...");
        const plan = await planner(prompt, null);

        console.log("Generating Code...");
        const code = await generator(plan, null, prompt);

        console.log("\n--- Structural Checks ---");

        // Check for Root Components
        const hasNavbar = code.includes("<Navbar");
        const hasSidebar = code.includes("<Sidebar");
        const hasMainCard = code.includes("<Card");

        // Check for Nested Cards (at least one Card inside another or multiple Cards)
        // This is a naive check; a better one would parse the JSX tree, but regex helps for a quick sanity check.
        // We look for multiple <Card occurences.
        const cardCount = (code.match(/<Card/g) || []).length;

        if (hasNavbar && hasSidebar && cardCount >= 2) {
            console.log("[SUCCESS] Structure likely correct.");
            console.log(`- Navbar present: ${hasNavbar}`);
            console.log(`- Sidebar present: ${hasSidebar}`);
            console.log(`- Total Cards found: ${cardCount} (Expected >= 2 for Main + Section)`);
        } else {
            console.log("[FAILURE] Recursive structure missing.");
            console.log(`- Navbar present: ${hasNavbar}`);
            console.log(`- Sidebar present: ${hasSidebar}`);
            console.log(`- Total Cards found: ${cardCount}`);
        }

        console.log("\nCode Snippet:\n", code.substring(0, 400).replace(/\n/g, ' '));

    } catch (error) {
        console.error("Test Failed:", error);
    }
};

testStructure();
