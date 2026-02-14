import React from 'react';
import { themes } from '../../theme';

export function Card({ children, variant = "default", theme = "dark" }) {
    const t = themes[theme] || themes.dark;

    const styles = {
        background: variant === 'subtle' ? 'transparent' : t.surface,
        border: variant === 'outline' ? `1px dashed ${t.neutral}` : `1px solid ${t.border}`,
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
        width: "100%",
        boxSizing: "border-box",
        color: t.text
    };

    return (
        <div style={styles}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px"
            }}>
                {children}
            </div>
        </div>
    );
}
