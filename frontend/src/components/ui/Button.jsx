import React from 'react';
import { themes } from '../../theme';

export function Button({ children, label, onClick, variant = 'primary', theme = 'dark', className = '' }) {
    const t = themes[theme] || themes.dark;

    // Map variant to theme color
    const bgColor = variant === 'primary' ? t.primary :
        variant === 'secondary' ? t.secondary : 'transparent';

    // Ghost variant handling
    const textColor = variant === 'ghost' ? t.textSecondary :
        variant === 'secondary' ? t.text : '#ffffff';

    const header = variant === "primary" ? t.primary : t.secondary;

    const styles = {
        background: bgColor,
        color: textColor,
        border: "none",
        padding: "10px 16px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "500",
        transition: "opacity 0.2s",
        fontSize: "14px"
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
