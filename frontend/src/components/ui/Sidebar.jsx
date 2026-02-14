import React from 'react';
import { themes } from '../../theme';

export function Sidebar({ children, items, theme = "dark" }) {
    const t = themes[theme] || themes.dark;

    // If children are provided, use them. Otherwise, render default structure.
    const content = children || (
        <>
            {(items || ["Dashboard", "Settings", "Profile"]).map((item) => (
                <div key={item} style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    color: t.textSecondary,
                    cursor: "pointer",
                    fontSize: "14px"
                }}
                    onMouseOver={(e) => { e.currentTarget.style.background = t.surface; e.currentTarget.style.color = t.text; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t.textSecondary; }}
                >
                    {item}
                </div>
            ))}
        </>
    );

    return (
        <div style={{
            width: "240px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "16px",
            boxSizing: "border-box",
            background: t.sidebarSurface, // Updated to specific sidebar surface
            height: "100%",
            borderRight: `1px solid ${t.border}`
        }}>
            {content}
        </div>
    );
}
