const { generateContentWithRetry } = require('../utils/geminiHelper');
require('dotenv').config();

const generator = async (plan, previousCode = null) => {
  const systemInstruction = `
You are a senior frontend engineer.

MODE: ${previousCode ? "EDIT / UPDATE" : "NEW GENERATION"}

${previousCode ? `
YOUR TASK:
1. You will be given a PLAN (JSON) and PREVIOUS CODE (JSX).
2. You must APPLY changes to the PREVIOUS CODE based on the PLAN and User Prompt.
3. KEEP existing functionality, layout, and components that are NOT part of the requested change.
4. DO NOT rewrite the entire application from scratch unless the plan explicitly says "Redesign everything".
5. MERGE new features into the existing structure.
` : `
YOUR TASK:
1. Generate professional React UI using a fixed deterministic component library.
2. Follow strict layout hierarchy actions.
`}

ALLOWED COMPONENTS:
Navbar, Sidebar, Card, Input, Button, Table, Modal

STRICT LAYOUT RULES:
- Root: Navbar, Sidebar
- Main: ONE top-level Card
- Sections: Card (max depth 2)
- Content: Input, Button, Table inside Cards

CRITICAL:
- Output ONLY valid JSX.
- No markdown or comments.
- No "import React".
`;

  const userPrompt = previousCode
    ? `PLAN:\n${JSON.stringify(plan)}\n\nPREVIOUS CODE:\n${previousCode}\n\nUSER PROMPT/INSTRUCTION: Edit the code above to match the plan.`
    : `Here is the plan for the UI:\n${JSON.stringify(plan)}`;

  const promptParts = [{ text: systemInstruction + "\n\n" + userPrompt }];

  const result = await generateContentWithRetry(promptParts);


  const response = result.response;
  let text = response.text();

  // Clean up markdown
  // Clean up markdown
  text = text.replace(/```jsx/g, "").replace(/```javascript/g, "").replace(/```/g, "").trim();

  // Ensure no "import React" (as it's provided by preview scope) but ALLOW other imports
  text = text.replace(/import React.*?;/g, "");

  return text;
};

module.exports = generator;
