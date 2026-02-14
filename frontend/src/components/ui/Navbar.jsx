import React from 'react';
import { themes } from '../../theme';

export function Navbar({ children, logo = "App", theme = "dark" }) {
    const t = themes[theme] || themes.dark;

    // If children are provided, use them. Otherwise, render default structure.
    const content = children || (
        <>
            <div style={{ fontWeight: "bold", fontSize: "20px", color: t.text }}>{logo}</div>
            <div style={{ display: "flex", gap: "24px" }}>
                <a href="#" style={{ color: t.textSecondary, textDecoration: "none", fontSize: "14px" }}>Home</a>
                <a href="#" style={{ color: t.textSecondary, textDecoration: "none", fontSize: "14px" }}>About</a>
                <a href="#" style={{ color: t.textSecondary, textDecoration: "none", fontSize: "14px" }}>Contact</a>
            </div>
        </>
    );

    return (
        <div style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            borderBottom: `1px solid ${t.border}`,
            background: t.navSurface, // Updated to user specific nav surface
            boxSizing: "border-box",
            color: t.text
        }}>
            {content}
        </div>
    );
}
