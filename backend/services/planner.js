const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

const planner = async (prompt, previousCode = null) => {
  const systemInstruction = `
You are a UI Planner Agent. Your job is to create a structured JSON plan for a React interface based on a user prompt.

Allowed Components:
- Navbar
- Sidebar
- Table (props: columns)
- Card
- Button
- Input
- Modal

Rules:
1. Return ONLY valid JSON. No markdown formatting.
2. Do not use any components other than the allowed list.
3. Structure the response with "layout" and "components" keys.
4. If "previousCode" is provided, try to respect the existing structure unless the prompt explicitly asks for a change.

Example Output:
{
  "layout": "dashboard",
  "components": [
    { "type": "Navbar" },
    { "type": "Sidebar" },
    {
      "type": "Table",
      "props": { "columns": ["Name", "Email", "Role"] }
    }
  ]
}
`;

  const fullPrompt = previousCode
    ? `User Prompt: ${prompt}\n\nPrevious Version Code:\n${previousCode}`
    : `User Prompt: ${prompt}`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: systemInstruction + "\n\n" + fullPrompt }] }]
  });

  const response = result.response;
  let text = response.text();

  // Clean up potential markdown code blocks
  text = text.replace(/```json/g, "").replace(/```/g, "").trim();

  return JSON.parse(text);
};

module.exports = planner;
