import React from 'react';
import { themes } from '../../theme';

export function Input({ placeholder, value, onChange, theme = 'dark', type = "text" }) {
    const t = themes[theme] || themes.dark;

    const styles = {
        background: t.inputSurface, // Updated to specific input surface
        border: `1px solid ${t.border}`,
        color: t.text,
        padding: "12px 16px",
        borderRadius: t.radius,
        width: "100%",
        outline: "none",
        fontSize: "14px",
        boxSizing: "border-box",
        transition: "border-color 0.2s, box-shadow 0.2s"
    };

    return (
        <input
            type={type}
            style={styles}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={(e) => {
                e.target.style.borderColor = t.primary;
                e.target.style.boxShadow = `0 0 0 2px ${t.primary}33`; // 20% opacity matching primary
            }}
            onBlur={(e) => {
                e.target.style.borderColor = t.border;
                e.target.style.boxShadow = "none";
            }}
        />
    );
}
