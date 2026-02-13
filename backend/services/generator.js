const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

const generator = async (plan) => {
  const systemInstruction = `
You are a React Code Generator Agent. Your job is to convert a structured UI plan into valid React component code.

Allowed Components:
- Navbar
- Sidebar
- Table
- Card
- Button
- Input
- Modal

Rules:
1. Output ONLY the React JSX code. No imports, no default exports, just the component tree (fragments are allowed).
2. Do NOT use <div>, <span>, or any HTML tags. ONLY use the allowed matching components.
3. Do NOT generate CSS or Tailwind classes.
4. Follow the structure defined in the plan strictly.

Example Input Plan:
{
  "layout": "dashboard",
  "components": [
    { "type": "Button", "props": { "label": "Submit" } }
  ]
}

Example Output:
<>
    <Button label="Submit" />
</>
`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: systemInstruction + "\n\nPlan:\n" + JSON.stringify(plan) }] }]
  });

  const response = result.response;
  let text = response.text();

  // Clean up markdown
  text = text.replace(/```jsx/g, "").replace(/```javascript/g, "").replace(/```/g, "").trim();

  return text;
};

module.exports = generator;
