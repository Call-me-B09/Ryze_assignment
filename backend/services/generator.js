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
1. **PRESERVE SHELL**: DO NOT move or modify the Root Card, Navbar, or Sidebar.
2. **EDIT LAYOUT**: Apply changes ONLY inside the 'Main Content' container.
3. **PRESERVE COMPONENTS**: Keep existing components unless removal is requested.
4. **MINIMAL CHANGES**: Do not regenerate the entire UI if only a section needs update.
5. **VALID JSX**: Output ONLY updated valid JSX.
6. **THEME RESTRICTION**: Ensure all components use the same theme prop.
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
   - Card (props: children, theme="dark"|"light"|"ocean", variant="app"|"default"|"section"|"outline"|"subtle"|"imagePlaceholder", layout="column"|"row", fullWidth, fullHeight)
   - Button (props: children, onClick, variant="primary"|"secondary"|"ghost"|"circle", color="primary"|"secondary"|"accent"|"neutral", theme="dark"|"light"|"ocean")
   - Input (props: placeholder, value, onChange, theme="dark"|"light"|"ocean")
   - Table (props: columns, data, theme="dark"|"light"|"ocean")
   - Modal (props: isOpen, onClose, title, children, theme="dark"|"light"|"ocean")
   - Select (props: value, onChange, children, theme="dark"|"light"|"ocean")
   - Option (props: value, children)

CRITICAL JSX RULES (ZERO TOLERANCE):
1. NEVER use children={[ ... ]} syntax. 
   - WRONG: <Navbar children={[ <Button>Home</Button> ]} />
   - CORRECT: <Navbar><Button>Home</Button></Navbar>
2. NEVER pass JSX elements inside arrays as props.
3. ALWAYS use valid component nesting.
4. STRICTLY FOLLOW the "App Container" hierarchy defined below.

2. THEME SYSTEM (TRUE DARK & LIGHT):
   - You MUST accept an optional 'theme' prop in your main component and pass it down.
   - Allowed themes: "dark", "light", "ocean".
   - **LIGHT MODE**: Use WHITE surfaces (#ffffff). NO gray backgrounds.
   - **DARK MODE**: Use SLATE backgrounds (#0f172a). NO gray-on-gray.

3. INTENT MAPPING (DETERMINISTIC):
   - "Blue button" -> <Button color="primary">
   - "Image/Photo" -> <Card variant="imagePlaceholder">Image</Card> (Strict rule: NO BUTTONS INSIDE)
   - "Search Section" -> <Card variant="section"><Input placeholder="Search..." /><Button>Search</Button></Card>
   - "Data Grid" -> <Card variant="section"><Table .../></Card>

IMAGE PLACEHOLDERS (CRITICAL):
For ANY image request (profile pic, cover art, product image), you MUST use this EXACT pattern:
<Card variant="imagePlaceholder">
  Image
</Card>
DO NOT put a Button inside the image placeholder. It must be plain text.

VISUAL HIERARCHY RULES:
1. MAX NESTING: Do not nest cards more than 2 levels deep inside Main Content.
2. SPACING: Use proper separation between sections.
3. ALIGNMENT: Align Search, Content, and Data sections vertically.

LAYOUT RULES (STRICT VISUAL HIERARCHY):
1. **ROOT**: <Card variant="app" fullWidth fullHeight> (App Background)
2. **NAVBAR**: First child. Top, full width.
3. **LAYOUT ROW**: Second child. <Card variant="subtle" layout="row" fullHeight>. (Transparent wrapper)
4. **SIDEBAR**: First child of Row. Left, fixed.
5. **MAIN CONTENT**: Second child of Row. <Card variant="subtle" layout="column" fullWidth fullHeight>. (Right, flex)
6. **CONTENT SECTIONS**: Inside Main Content, use <Card variant="section"> to group distinct blocks (Search, Hero, Data).
   - NEVER put loose Inputs/Buttons in Main Content.

CONTEXT ADAPTATION (CRITICAL):
Infer the "App Type" from the user prompt and adapt content accordingly.
1. **Music App**: Navbar: Home, Library, Search. Sidebar: Songs, Artists, Albums, Genres. Table: Title, Artist, Album, Duration. Inputs: "Search songs...", "Filter artists...". Images: Use <Card variant="subtle"><Button variant="ghost">Album Art</Button></Card>
2. **Dashboard / Admin**: Navbar: Dashboard, Notifications, Profile. Sidebar: Overview, Analytics, Users, Settings, Reports. Table: User, Email, Role, Status, Last Login. Inputs: "Search users...", "Filter by date..."
3. **Ecommerce**: Navbar: Home, Shop, Cart, Account. Sidebar: Recent Orders, Wishlist, Settings. Table: Product, Price, Stock, Category. Inputs: "Search products...", "Discount code...". Images: Use <Card variant="subtle"><Button variant="ghost">Product Image</Button></Card>
4. **Chat App**: Navbar: Chats, Contacts, Settings. Sidebar: Recent Conversations, Online Friends. Table: Contact, Last Message, Time. Inputs: "Type a message...", "Search contacts...". Images: Use <Card variant="subtle"><Button variant="ghost">Profile Pic</Button></Card>
5. **Login / Auth**: Navbar: BrandName (minimal). Layout: Centered Card. Content: Email Input, Password Input, "Sign In" Button, "Forgot Password" Button

CRITICAL QUALITY RULES:
1. **NO EMPTY COMPONENTS**: Navbar and Sidebar MUST have children (Buttons).
2. **MEANINGFUL CONTENT**: Buttons must have text. Tables must have mock data. Inputs must have placeholders.
3. **NO CSS/STYLE**: Do not use className or style={{}}.
4. **NO IMG TAGS**: Use Card placeholders.
5. **TABLE DATA KEYS MUST BE CAMELCASE & NO SPACES**:
   - **Correct**: columns={["Post ID", "Date"]} data={[{ postId: "1", date: "2024" }]}
   - **Incorrect**: columns={["Post ID"]} data={[{ "Post ID": "1" }]} (Keys with spaces forbidden)
   - **Incorrect**: columns={["Post ID"]} data={[{ post_id: "1" }]} (Use camelCase)

CRITICAL OUTPUT RULES (ZERO TOLERANCE):
1. Output **ONLY** pure, clean React component code.
2. **NO** markdown. **NO** backticks (\`). **NO** explanations.
3. **MUST** start with: \`import React, { useState } from 'react';\`
4. **MUST** export a default function component named 'App'.
5. **MUST** define 'const [theme, setTheme] = useState("dark");' inside App.
6. **MUST** pass 'theme={theme}' to EVERY child component.
7. **NO** other imports. Components (Navbar, Sidebar, Card, Button, Input, Table, Modal, Select, Option) are available in scope.
8. **NEVER** usage of undefined variables. specifically 'code'.
9. **NEVER** output 'theme = {theme}' (spaces around equals). Use 'theme={theme}'.

EXAMPLE STRUCTURE (FOLLOW THIS EXACTLY):
import React, { useState } from 'react';

export default function App() {
  const [theme, setTheme] = useState("dark");

  return (
    <Card variant="app" theme={theme} fullWidth fullHeight> {/* ROOT */}
      
      <Navbar theme={theme}>
         <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span>Brand</span>
         </div>
         <Button theme={theme}>Login</Button>
      </Navbar>
      
      <Card variant="subtle" layout="row" fullHeight theme={theme}> {/* WRAPPER */}
        
         <Sidebar theme={theme}>
            <Button variant="ghost" theme={theme} fullWidth>Home</Button>
            <Button variant="ghost" theme={theme} fullWidth>Settings</Button>
         </Sidebar>
         
         <Card variant="subtle" layout="column" fullWidth fullHeight theme={theme}> {/* MAIN CONTENT */}
         
           {/* SEARCH SECTION */}
           <Card variant="section" theme={theme}>
              <Input placeholder="Search..." theme={theme} />
              <Button theme={theme}>Search</Button>
           </Card>
           
           {/* HERO / IMAGE SECTION */}
           <Card variant="section" theme={theme}>
             <Card variant="imagePlaceholder" theme={theme}>Product Image</Card>
             <Button variant="primary" theme={theme}>Action</Button>
           </Card>
           
           {/* DATA SECTION */}
           <Card variant="section" theme={theme}>
              <Table columns={["Name", "Role"]} data={[{Name: "Alice", Role: "Admin"}]} theme={theme} />
           </Card>
         
         </Card>
  
      </Card>
  
    </Card>
  );
}
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

   // Remove any text before the first import or export
   const importIndex = text.indexOf('import');
   const exportIndex = text.indexOf('export');

   let startIndex = -1;
   if (importIndex !== -1 && (exportIndex === -1 || importIndex < exportIndex)) {
      startIndex = importIndex;
   } else if (exportIndex !== -1) {
      startIndex = exportIndex;
   }

   if (startIndex !== -1) {
      text = text.substring(startIndex);
   }

   // Remove any text after the last closing brace '}'
   const lastBraceIndex = text.lastIndexOf('}');
   if (lastBraceIndex !== -1) {
      text = text.substring(0, lastBraceIndex + 1);
   }

   // Remove imports of components we know are in scope, BUT KEEP React/useState
   // We already instruct the model to only import React. 
   // Just in case, remove component imports if any sneak in.
   text = text.replace(/import\s+(?!React)\w+\s+from\s+['"].*?['"];?/g, "");

   return text;
};

module.exports = generator;
