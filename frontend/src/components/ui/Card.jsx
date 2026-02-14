import React from 'react';
import { themes } from '../../theme';

export function Card({ children, variant = "default", theme = "dark", layout = "column", fullWidth = false, fullHeight = false }) {
    const t = themes[theme] || themes.dark;

    const styles = {
        background: variant === 'app' ? t.appBackground :
            variant === 'default' ? t.cardPrimary : // Default maps to Primary Card surface
                variant === 'section' ? t.cardSecondary : // Section maps to Secondary Card surface
                    variant === 'imagePlaceholder' ? 'transparent' :
                        variant === 'ghost' ? 'transparent' : 'transparent',

        border: variant === 'outline' ? `1px dashed ${t.border}` :
            variant === 'imagePlaceholder' ? `1px dashed ${t.border}` :
                variant === 'app' ? 'none' : `1px solid ${t.border}`,

        borderRadius: variant === 'app' ? '0px' : t.radius,

        boxShadow: variant === 'default' ? t.shadowSm : 'none',

        padding: variant === 'ghost' ? '0px' :
            variant === 'app' ? '0px' :
                variant === 'imagePlaceholder' ? '0px' : "24px",

        marginBottom: "0px",
        width: fullWidth || variant === 'app' ? "100%" : "100%", // Default to full width for cards
        height: fullHeight || variant === 'app' ? "100%" : "auto",
        boxSizing: "border-box",
        color: t.text,
        display: "flex",
        flexDirection: layout,
        gap: variant === 'app' ? '0' : "20px",
        alignItems: "stretch", // Default stretch
        overflow: variant === 'app' ? "hidden" : "visible", // Inner cards might need visible overflow
        position: "relative"
    };

    // Special handling for Image Placeholders
    if (variant === 'imagePlaceholder') {
        styles.alignItems = "center";
        styles.justifyContent = "center";
        styles.minHeight = "180px";
        styles.height = "220px"; // Fixed height preference
        styles.background = t.secondary; // Distinct background for placeholders
        styles.color = t.textSecondary;
        styles.fontSize = "14px";
    }

    return (
        <div style={styles}>
            {children}
        </div>
    );
}
