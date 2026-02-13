const { generateContentWithRetry } = require('../utils/geminiHelper');
require('dotenv').config();

const planner = async (prompt, previousCode = null) => {
  const systemInstruction = previousCode
    ? `
You are an expert UI/UX Architect. Your job is to analyze the user request and UPDATE the existing React application structure.

### Objectives
1. **Analyze Changes**: Compare the User Prompt with the Previous Version. Identify what needs to be added, removed, or modified.
2. **Preserve Structure**: Keep the existing layout (Navbar/Sidebar/Main Card) unless explicitly asked to change it.
3. **Plan Update**: Output a JSON plan that reflects the *new* state of the application after changes.

### Rules
1. Return **ONLY** a JSON object (no markdown).
2. Structure:
   {
     "layout": "description of existing layout + changes",
     "components": [
       { "name": "Sidebar", "description": "Navigation links..." },
       { "name": "Card", "description": "Main container..." },
       // List ALL components needed for the new version
     ],
     "change_strategy": "Briefly explain what is being changed (e.g. 'Adding a new button to the main card')"
   }
3. DO NOT suggest standard HTML elements (div, span, etc) or CSS styling. Focus on component composition and hierarchy.
`
    : `
You are an expert UI/UX Architect. Your job is to analyze the user request and create a detailed structure for a React application using ONLY the allowed component library.

### Objectives
1. **Understand Intent**: Analyze what the user wants.
2. **Plan Layout**: Suggest a layout using the allowed components (Button, Card, Input, Table, Modal, Sidebar, Navbar) observing STRICT hierarchy rules:
   - Root: Navbar, Sidebar.
   - Main Content: Wrapped in ONE top-level Card.
   - Sections: Inside the main Card, use child Cards for sections.
   - Content: Input, Button, Table inside section Cards.
3. **Detail Components**: List necessary components from the allowed list.

### Rules
1. Return **ONLY** a JSON object (no markdown).
2. Structure:
   {
     "layout": "description of layout with strict hierarchy (Navbar/Sidebar -> Main Card -> Section Cards)",
     "components": [
       { "name": "Sidebar", "description": "Navigation links..." },
       { "name": "Card", "description": "Main container..." }
     ],
     "suggestion": "Advice on grouping and avoiding over-nesting (max 2 levels deep for Cards)"
   }
3. DO NOT suggest standard HTML elements (div, span, etc) or CSS styling. Focus on component composition and hierarchy.
`;

  const fullPrompt = previousCode
    ? `User Prompt: ${prompt}\n\nPrevious Version Code:\n${previousCode}`
    : `User Prompt: ${prompt}`;

  const promptParts = [{ text: systemInstruction + "\n\n" + fullPrompt }];

  const result = await generateContentWithRetry(promptParts);

  const response = result.response;
  let text = response.text();

  // Clean up potential markdown code blocks
  text = text.replace(/```json/g, "").replace(/```/g, "").trim();

  return JSON.parse(text);
};

module.exports = planner;
