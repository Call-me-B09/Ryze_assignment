const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

const explainer = async (code, plan) => {
    const systemInstruction = `
You are a UI Explainer Agent. Your job is to explain the generated UI in plain English.

Input:
- React Code
- JSON Plan

Output:
- A concise paragraph explaining what was built and why. usage of specific components.
`;

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: systemInstruction + "\n\nCode:\n" + code + "\n\nPlan:\n" + JSON.stringify(plan) }] }]
    });

    const response = result.response;
    return response.text();
};

module.exports = explainer;
