const { generateContentWithRetry } = require('../utils/geminiHelper');
require('dotenv').config();

const planner = async (prompt, previousCode = null) => {
  const systemInstruction = previousCode
    ? `
You are an expert UI/UX Architect specializing in incremental updates.
Your job is to analyze the user request and the existing code to create an **EDIT PLAN**.

### EDIT TYPES
1. **ADD**: Insert a new component (e.g., Modal, Button, Section).
2. **MODIFY**: Change properties, text, or style of an existing component.
3. **REMOVE**: Delete a component.
4. **REPLACE**: Swap one component for another.
5. **REORDER**: Move components.

### OBJECTIVES
1. Analyze user prompt vs existing code.
2. Identify the *minimal* set of actions needed.
3. Output a structured JSON plan.

### JSON STRUCTURE (Strict)
Return a single JSON object with an "edits" array.
{
  "edits": [
    {
      "action": "ADD",
      "target": "ParentComponentName or Description",
      "component": "ComponentName",
      "props": { "propName": "propValue" },
      "location": "description of where to add"
    },
    {
      "action": "MODIFY",
      "target": "Button containing text 'Login'",
      "change": "text", 
      "newValue": "Sign In"
    }
  ],
  "summary": "Brief explanation of changes"
}

### RULES
1. Do NOT generate a full UI tree. Only list changes.
2. Be specific about targets (e.g., "Card with title 'Welcome'").
3. Use ONLY allowed components: Navbar, Sidebar, Card, Input, Button, Table, Modal.
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
    ? `User Prompt: ${prompt}\n\nExisting Code:\n${previousCode}`
    : `User Prompt: ${prompt}`;

  const promptParts = [{ text: systemInstruction + "\n\n" + fullPrompt }];

  const result = await generateContentWithRetry(promptParts);

  const response = result.response;
  let text = response.text();

  const cleanJson = (str) => {
    // 1. Remove markdown code blocks (optional, but helps distinct blocks)
    str = str.replace(/```json/g, "").replace(/```/g, "").trim();

    // 2. Find the first '{' or '['
    const firstOpenBrace = str.indexOf('{');
    const firstOpenBracket = str.indexOf('[');

    let startIndex = -1;
    let endChar = '';

    if (firstOpenBrace !== -1 && (firstOpenBracket === -1 || firstOpenBrace < firstOpenBracket)) {
      startIndex = firstOpenBrace;
      endChar = '}';
    } else if (firstOpenBracket !== -1) {
      startIndex = firstOpenBracket;
      endChar = ']';
    }

    if (startIndex === -1) return str; // No JSON found

    // 3. Robust extraction using brace counting
    let openCount = 0;
    let endIndex = -1;
    let inString = false;
    let escape = false;

    for (let i = startIndex; i < str.length; i++) {
      const char = str[i];

      if (escape) {
        escape = false;
        continue;
      }

      if (char === '\\') {
        escape = true;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === '{' || char === '[') {
          openCount++;
        } else if (char === '}' || char === ']') {
          openCount--;
          if (openCount === 0) {
            endIndex = i;
            break;
          }
        }
      }
    }

    if (endIndex !== -1) {
      str = str.substring(startIndex, endIndex + 1);
    }

    // 4. Cleanup text inside the extracted block
    // Remove single-line comments (careful not to remove URLs)
    // str = str.replace(/\/\/.*$/gm, ""); // Risky if // is in string

    // Remove trailing commas (simple regex, can be risky but usually fine)
    str = str.replace(/,(\s*[}\]])/g, '$1');

    return str;
  };

  const cleanedText = cleanJson(text);

  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Failed to parse JSON Plan:", error);
    console.error("Raw Text:", text);
    console.error("Cleaned Text:", cleanedText);
    // Fallback: Return a simple error plan logic or throw
    throw new Error("Invalid structure returned by Planner Agent. Please try again.");
  }
};

module.exports = planner;
