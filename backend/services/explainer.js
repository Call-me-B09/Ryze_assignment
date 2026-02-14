const { generateContentWithRetry } = require('../utils/geminiHelper');
require('dotenv').config();

const explainer = async (code, plan) => {
    const systemInstruction = `
You are a UI Explainer Agent. Your job is to explain the generated UI in plain English.

Input:
- React Code
- JSON Plan (can be a full layout plan OR an edit plan with an "edits" array)

Output:
- If NEW GENERATION: A concise paragraph explaining what was built and why.
- If EDIT: A concise paragraph explaining WHAT CHANGED based on the "edits" array (e.g., "Added a Settings modal..."). Do not describe unchanged parts.
`;

    const promptParts = [{ text: systemInstruction + "\n\nCode:\n" + code + "\n\nPlan:\n" + JSON.stringify(plan) }];

    const result = await generateContentWithRetry(promptParts);

    const response = result.response;
    return response.text();
};

module.exports = explainer;
