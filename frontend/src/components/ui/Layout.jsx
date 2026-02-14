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
            background: t.background,
            color: t.text,
            overflow: "hidden"
        }}>
            <div style={{
                width: "100%",
                borderBottom: `1px solid ${t.border}`,
                padding: "12px 24px",
                boxSizing: "border-box",
                flexShrink: 0,
                background: t.background
            }}>
                {navbar}
            </div>

            <div style={{
                flex: 1,
                display: "flex",
                overflow: "hidden"
            }}>
                <div style={{
                    width: "240px",
                    borderRight: `1px solid ${t.border}`,
                    padding: "16px",
                    flexShrink: 0,
                    overflowY: "auto",
                    background: t.background
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
                    background: t.background
                }}>
                    <div style={{
                        width: "100%",
                        maxWidth: "1100px"
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
            background: t.background,
            color: t.text,
            overflow: "hidden"
        }}>
            <div style={{
                width: "100%",
                borderBottom: `1px solid ${t.border}`,
                padding: "12px 24px",
                boxSizing: "border-box",
                flexShrink: 0,
                background: t.background
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
                background: t.background
            }}>
                <div style={{
                    width: "100%",
                    maxWidth: "1100px"
                }}>
                    {content}
                </div>
            </div>
            {modals}
        </div>
    );
}

// Shell 3: Centered Layout (Login / Simple Page)
export function CenteredShell({ content, modals, theme = "dark" }) {
    const t = themes[theme] || themes.dark;

    return (
        <div style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: t.background,
            color: t.text,
            position: "relative"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "400px",
                padding: "20px"
            }}>
                {content}
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
        if (child.type === Navbar) {
            navbar = themedChild;
        } else if (child.type === Sidebar) {
            sidebar = themedChild;
        } else if (child.type === Modal) {
            modals.push(themedChild);
        } else {
            // Fallback for detection by name if type check fails
            const typeName = child.type?.name || child.type?.displayName || '';
            if (typeName.includes("Navbar")) navbar = themedChild;
            else if (typeName.includes("Sidebar")) sidebar = themedChild;
            else if (typeName.includes("Modal")) modals.push(themedChild);
            else content.push(themedChild); // Should we theme generic content? Maybe not directly.
        }
    });

    // Content also needs to receive theme if they are our components
    const themedContent = content.map(child => {
        // Check if it's one of our UI components by checking display name or type
        if (child.type === Navbar || child.type === Sidebar || child.type === Modal) return child; // Already handled
        // We should try to pass theme to everything just in case? 
        // Safest is to rely on the generator passing it or us injecting it here.
        // Let's inject it if it's a valid element.
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
