import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Modal } from './Modal';
import { themes } from '../../theme';

// Shell 1: Application Layout (Navbar + Sidebar)
export function AppShell({ navbar, sidebar, content, modals, theme = "dark" }) {
    const t = themes[theme] || themes.dark;

    return (
        <div style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: t.appBackground, // Updated token
            color: t.text,
            overflow: "hidden"
        }}>
            {/* Navbar Container - Component handles styling */}
            <div style={{
                width: "100%",
                flexShrink: 0
            }}>
                {navbar}
            </div>

            <div style={{
                flex: 1,
                display: "flex",
                overflow: "hidden"
            }}>
                {/* Sidebar Container - Component handles styling */}
                <div style={{
                    flexShrink: 0,
                    overflowY: "auto",
                    // Sidebar component defaults to fixed width, or we can enforce it here if needed.
                    // But strictly, Sidebar.jsx handles it.
                    height: "100%"
                }}>
                    {sidebar}
                </div>

                <div style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    padding: "40px",
                    overflowY: "auto",
                    position: "relative",
                    background: t.appBackground // Updated token
                }}>
                    <div style={{
                        width: "100%",
                        maxWidth: "1200px"
                    }}>
                        {content}
                    </div>
                </div>
            </div>
            {modals}
        </div>
    );
}

// Shell 2: Website Layout (Navbar Only)
export function WebsiteShell({ navbar, content, modals, theme = "dark" }) {
    const t = themes[theme] || themes.dark;

    return (
        <div style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: t.appBackground, // Updated token
            color: t.text,
            overflow: "hidden"
        }}>
            <div style={{
                width: "100%",
                flexShrink: 0
            }}>
                {navbar}
            </div>

            <div style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                padding: "40px",
                overflowY: "auto",
                position: "relative",
                background: t.appBackground // Updated token
            }}>
                <div style={{
                    width: "100%",
                    maxWidth: "1200px"
                }}>
                    {content}
                </div>
            </div>
            {modals}
        </div>
    );
}

// Shell 3: Centered Layout (Universal Container)
export function CenteredShell({ content, modals, theme = "dark" }) {
    const t = themes[theme] || themes.dark;

    return (
        <div style={{
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center", // Center vertically? Or top align? Vertically centering is nice.
            background: t.appBackground, // Updated token
            color: t.text,
            position: "relative",
            padding: "40px",
            boxSizing: "border-box",
            overflow: "hidden"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "1400px", // Increased from 400px for full app support
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden" // Prevent inner scroll double
            }}>
                {/* Scrollable content area inside the centered constraint */}
                <div style={{
                    flex: 1,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column"
                }}>
                    {content}
                </div>
            </div>
            {modals}
        </div>
    );
}

// Layout Interpreter: Detects structure and chooses the right Shell
export function LayoutInterpreter({ children, theme = "dark" }) {
    let navbar = null;
    let sidebar = null;
    const modals = [];
    const content = [];

    // Flatten children to handle fragments
    const childrenArray = React.Children.toArray(children).flatMap(child => {
        if (child.type === React.Fragment) {
            return React.Children.toArray(child.props.children);
        }
        return child;
    });

    childrenArray.forEach(child => {
        if (!child) return;

        // Clone element to inject theme prop
        const themedChild = React.cloneElement(child, { theme });

        // Strict Type Checking
        if (child.type.name === "Navbar" || child.type.displayName === "Navbar") { // Fix type check
            navbar = themedChild;
        } else if (child.type.name === "Sidebar" || child.type.displayName === "Sidebar") {
            sidebar = themedChild;
        } else if (child.type.name === "Modal" || child.type.displayName === "Modal") {
            modals.push(themedChild);
        } else {
            // Fallback for detection by name if type check fails
            const typeName = child.type?.name || child.type?.displayName || '';
            if (typeName.includes("Navbar")) navbar = themedChild;
            else if (typeName.includes("Sidebar")) sidebar = themedChild;
            else if (typeName.includes("Modal")) modals.push(themedChild);
            else content.push(themedChild);
        }
    });

    // Content also needs to receive theme if they are our components
    const themedContent = content.map(child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { theme });
        }
        return child;
    });


    // Decision Tree
    if (navbar && sidebar) {
        return <AppShell navbar={navbar} sidebar={sidebar} content={themedContent} modals={modals} theme={theme} />;
    }

    if (navbar && !sidebar) {
        return <WebsiteShell navbar={navbar} content={themedContent} modals={modals} theme={theme} />;
    }

    return <CenteredShell content={themedContent} modals={modals} theme={theme} />;
}

// Maintain backward compatibility if anyone imports 'Layout'
export const Layout = LayoutInterpreter;
