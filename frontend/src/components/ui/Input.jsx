import React from 'react';
import { themes } from '../../theme';

export function Input({ placeholder, value, onChange, type = "text", theme = "dark", variant = 'default' }) {
    const t = themes[theme] || themes.dark;

    const styles = {
        width: "100%",
        padding: "10px 16px",
        borderRadius: "8px",
        border: `1px solid ${t.border}`,
        background: t.surface,
        color: t.text,
        fontSize: "14px",
        outline: "none",
        transition: "border-color 0.2s",
        boxSizing: "border-box"
    };

    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={styles}
            onFocus={(e) => e.currentTarget.style.borderColor = t.primary}
            onBlur={(e) => e.currentTarget.style.borderColor = t.border}
        />
    );
}
