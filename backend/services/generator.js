const { generateContentWithRetry } = require('../utils/geminiHelper');
require('dotenv').config();

const generator = async (plan, previousCode = null, userPromptText = "") => {
  const systemInstruction = `
You are a senior frontend engineer.

MODE: ${previousCode ? "EDIT / UPDATE" : "NEW GENERATION"}

${previousCode ? `
You are modifying an existing React UI.

EXISTING CODE:
${previousCode}

RULES:
1. Preserve existing components unless edit requires removal.
2. Only apply minimal changes.
3. Maintain layout hierarchy.
4. Do NOT regenerate everything.
5. Do NOT remove Navbar or Sidebar unless explicitly requested.
6. Output ONLY updated valid JSX.
` : `
YOUR TASK:
1. Generate professional React UI using a fixed deterministic component library.
2. Follow strict layout hierarchy actions.
`}

CRITICAL CONSTRAINT: Styling is STRICTLY FORBIDDEN in generated code.
DO NOT use: style={}, className="", inline styles, Tailwind classes.
CRITICAL RULES:
1. You MUST ONLY use these components:
   - Navbar (props: logo, children, theme="dark"|"light"|"ocean")
   - Sidebar (props: items, children, theme="dark"|"light"|"ocean")
   - Card (props: children, theme="dark"|"light"|"ocean", variant="default"|"outline"|"subtle")
   - Button (props: children, onClick, variant="primary"|"secondary"|"ghost", theme="dark"|"light"|"ocean")
   - Input (props: placeholder, value, onChange, theme="dark"|"light"|"ocean")
   - Table (props: columns, data, theme="dark"|"light"|"ocean")
   - Modal (props: isOpen, onClose, title, children, theme="dark"|"light"|"ocean")

2. THEME SYSTEM:
   - You MUST accept an optional 'theme' prop in your main component and pass it down.
   - Allowed themes: "dark", "light", "ocean".
   - Default theme is "dark".
   - DO NOT use 'style' props or 'className' for colors. Use the 'theme' prop.

3. You must NOT import anything. All components are available in the global scope.
4. You must NOT Use Tailwind classes.
5. You must NOT use standard HTML tags like <div>, <button>, <input> etc. ONLY use the provided components.
6. Your output must be a SINGLE COMPONENT export, e.g., 'export default function Dashboard() { ... }'.

IMAGE PLACEHOLDERS (CRITICAL):
Since <img> is forbidden, use this pattern for visual media (profile pics, covers, products):
<Card variant="subtle">
  <Button variant="ghost">Image Description</Button>
</Card>

LAYOUT RULES:
1. Navbar, Sidebar, and Modal are AUTOMATICALLY DETECTED and placed in the correct layout shell.
2. Do NOT create your own layout wrappers. Just return a Fragment or a container Div if strictly necessary for grouping, but prefer returning a list of components or a main function with them.
3. **SECTION CARDS**: Break up the UI into logical sections. EACH section must be wrapped in its own \`Card\`.
   - **Media Section**: Card containing album art/profile pic.
   - **Controls Section**: Card containing play/pause/action buttons.
   - **Data Section**: Card containing the Table.
   - **Search Section**: Card containing Input + Search Button.
4. **NO LOOSE COMPONENTS**: Do not place Buttons, Inputs, or Tables directly in the Main Card. ALWAYS wrap them in a Section Card.

EXAMPLE STRUCTURE (FOLLOW THIS):
<>
  <Navbar>...</Navbar>
  <Sidebar>...</Sidebar>
  
  <Card variant="default"> {/* MAIN CONTAINER */}
  
    {/* SECTION 1: HEADER / MEDIA */}
    <Card variant="subtle">
       <Card variant="ghost"><Button>Album Art</Button></Card>
       <Button>Play</Button>
    </Card>

    {/* SECTION 2: SEARCH */}
    <Card variant="subtle">
       <Input placeholder="Search..." />
       <Button>Search</Button>
    </Card>

    {/* SECTION 3: DATA */}
    <Card variant="subtle">
      <Table columns={[...]} data={[...]} />
    </Card>

  </Card>

  <Modal ... />
</>

CONTEXT ADAPTATION (CRITICAL):
Infer the "App Type" from the user prompt and adapt content accordingly.

1. **Music App**:
   - Navbar: Home, Library, Search
   - Sidebar: Songs, Artists, Albums, Genres
   - Table Columns: ["Title", "Artist", "Album", "Duration"]
   - Inputs: "Search songs...", "Filter artists..."
   - Images: Use <Card variant="subtle"><Button variant="ghost">Album Art</Button></Card>

2. **Dashboard / Admin**:
   - Navbar: Dashboard, Notifications, Profile
   - Sidebar: Overview, Analytics, Users, Settings, Reports
   - Table Columns: ["User", "Email", "Role", "Status", "Last Login"]
   - Inputs: "Search users...", "Filter by date..."

3. **Ecommerce**:
   - Navbar: Home, Shop, Cart, Account
   - Sidebar: Recent Orders, Wishlist, Settings
   - Table Columns: ["Product", "Price", "Stock", "Category"]
   - Inputs: "Search products...", "Discount code..."
   - Images: Use <Card variant="subtle"><Button variant="ghost">Product Image</Button></Card>

4. **Chat App**:
   - Navbar: Chats, Contacts, Settings
   - Sidebar: Recent Conversations, Online Friends
   - Table Columns: ["Contact", "Last Message", "Time"]
   - Inputs: "Type a message...", "Search contacts..."
   - Images: Use <Card variant="subtle"><Button variant="ghost">Profile Pic</Button></Card>

5. **Login / Auth**:
   - Navbar: BrandName (minimal)
   - Layout: Centered Card
   - Content: Email Input, Password Input, "Sign In" Button, "Forgot Password" Button

CRITICAL QUALITY RULES:
1. **NO EMPTY COMPONENTS**: Navbar and Sidebar MUST have children (Buttons).
2. **MEANINGFUL CONTENT**: Buttons must have text. Tables must have mock data. Inputs must have placeholders.
3. **NO CSS/STYLE**: Do not use className or style={{}}.
4. **NO IMG TAGS**: Use Card placeholders.

CRITICAL OUTPUT RULES (ZERO TOLERANCE):
1. Output **ONLY** valid JSX code.
2. **NO** explanations, **NO** markdown, **NO** comments, **NO** introductory text.
3. **NO** "Here is the code:" or "Updated code:".
4. **NO** duplication. Return EXACTLY ONE component tree.
5. **NO** <img> tags. Use Card placeholders.
6. **NO** className or style props.
7. **NO COMPONENT DEFINITIONS**: The components (Navbar, Sidebar, Card, Button, Input, Table, Modal) are **ALREADY IMPORTED**. DO NOT define them. DO NOT write "function Navbar...". DO NOT write "import ...".

VIOLATION EXAMPLE (DO NOT DO THIS):
function Navbar() { ... }
export default Navbar;
<Navbar />

CORRECT EXAMPLE (DO THIS):
<Navbar>
  <Button>Home</Button>
</Navbar>
`;

  const userPrompt = previousCode
    ? `
You are modifying an existing React UI.

Existing code:
${previousCode}

User request:
${userPromptText}

Edit plan:
${JSON.stringify(plan)}

Modify the existing code accordingly.

Rules:
- REPLACE the existing code with the FULL updated version.
- Do NOT append new code to the old code.
- Do NOT output the existing code again before the new code.
- Return ONLY the final, single, complete JSX tree.
- Preserve existing components unless explicitly removed.
`
    : `Here is the plan for the UI:\n${JSON.stringify(plan)}\n\nUSER PROMPT: ${userPromptText}`;

  const promptParts = [{ text: systemInstruction + "\n\n" + userPrompt }];

  const result = await generateContentWithRetry(promptParts);


  const response = result.response;
  let text = response.text();

  // Clean up markdown
  text = text.replace(/```jsx/g, "").replace(/```javascript/g, "").replace(/```/g, "").trim();

  // STAGE 2: Aggressive Clean-up (Remove "Here is the code" explanations)
  const firstTagIndex = text.indexOf('<');
  const lastTagIndex = text.lastIndexOf('>');

  if (firstTagIndex !== -1 && lastTagIndex !== -1) {
    text = text.substring(firstTagIndex, lastTagIndex + 1);
  }

  // Ensure no "import React" (as it's provided by preview scope) but ALLOW other imports
  text = text.replace(/import React.*?;/g, "");

  return text;
};

module.exports = generator;
