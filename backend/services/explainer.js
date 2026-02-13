const { generateContentWithRetry } = require('../utils/geminiHelper');
require('dotenv').config();

const explainer = async (code, plan) => {
    const systemInstruction = `
You are a UI Explainer Agent. Your job is to explain the generated UI in plain English.

Input:
- React Code
- JSON Plan

Output:
- A concise paragraph explaining what was built and why. usage of specific components.
`;

    const promptParts = [{ text: systemInstruction + "\n\nCode:\n" + code + "\n\nPlan:\n" + JSON.stringify(plan) }];

    const result = await generateContentWithRetry(promptParts);

    const response = result.response;
    return response.text();
};

module.exports = explainer;
