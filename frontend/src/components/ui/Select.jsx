
import React from 'react';
import { themes } from '../../theme';

export const Select = ({ value, onChange, theme = 'dark', children, className = '' }) => {
    const t = themes[theme] || themes.dark;
    const isDark = theme === 'dark' || theme === 'ocean';

    // SVG caret icon encoded as data URI for custom arrow
    const caretColor = isDark ? (theme === 'ocean' ? "%2322d3ee" : "%2394a3b8") : "%2364748b";
    const caretSvg = `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${caretColor}' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/></svg>`;
    const caretDataUri = `url("data:image/svg+xml,${caretSvg}")`;

    const styles = {
        padding: "8px 32px 8px 12px", // Extra right padding for arrow
        borderRadius: t.radius || "8px",
        border: `1px solid ${t.border}`,
        background: t.inputSurface,
        color: t.text,
        fontSize: "14px",
        fontWeight: "500",
        outline: "none",
        cursor: "pointer",
        appearance: "none",
        backgroundImage: caretDataUri,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.5rem center",
        backgroundSize: "1.5em 1.5em",
        minWidth: "120px" // Minimum width for usability
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <select
                value={value}
                onChange={onChange}
                style={styles}
                className={className}
            >
                {children}
            </select>
        </div>
    );
};
