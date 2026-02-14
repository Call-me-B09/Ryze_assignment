
const generator = require('./services/generator');

const plan = ["Create a table with columns 'Post ID' and 'Date'"];
const userPrompt = "Make a table with columns 'Post ID' and 'Date'.";

console.log("Starting generation...");
generator(plan, null, userPrompt)
    .then(code => {
        console.log("Generation successful!");
        console.log(code);
    })
    .catch(err => {
        console.error("Generation failed:", err);
    });
