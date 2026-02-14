import React from 'react';
import { themes } from '../../theme';

export function Button({ children, label, onClick, variant = 'primary', color, theme = 'dark', className = '' }) {
    const t = themes[theme] || themes.dark;

    // Resolve custom color from theme if provided
    // Allowed colors: primary, secondary, accent, neutral
    const customBg = color && t[color] ? t[color] : undefined;
    const customText = color && variant !== 'ghost' ? '#ffffff' : undefined; // Assume white text for colored buttons unless ghost

    const baseStyles = {
        border: "none",
        cursor: "pointer",
        color: customText || (variant === 'ghost' ? t.textSecondary : variant === 'secondary' ? t.text : '#ffffff'),
        fontSize: "14px",
        fontWeight: "500",
        transition: "opacity 0.2s",
        boxSizing: "border-box"
    };

    const variants = {
        primary: {
            background: customBg || t.primary,
            padding: "10px 16px",
            borderRadius: "8px"
        },
        secondary: {
            background: customBg || t.secondary,
            padding: "10px 16px",
            borderRadius: "8px"
        },
        ghost: {
            background: "transparent",
            padding: "10px 16px",
            borderRadius: "8px",
            border: `1px solid ${t.border}`,
            color: color && t[color] ? t[color] : t.textSecondary // Ghost uses color for text
        },
        circle: {
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: customBg || t.surface,
            border: `1px solid ${t.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0",
            overflow: "hidden"
        }
    };

    // Safe fallback: if variant doesn't exist, default to primary
    const activeStyle = variants[variant] || variants.primary;

    const styles = {
        ...baseStyles,
        ...activeStyle
    };

    return (
        <button
            onClick={onClick}
            style={styles}
            onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
            onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
        >
            {children || label || 'Button'}
        </button>
    );
}
