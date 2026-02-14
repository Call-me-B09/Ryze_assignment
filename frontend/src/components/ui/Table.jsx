import React from 'react';
import { themes } from '../../theme';

export function Table({ columns = [], data = [], theme = "dark" }) {
    const t = themes[theme] || themes.dark;

    // Mock data generation if none provided
    const displayData = data.length > 0 ? data : [
        { id: 1, col1: "Data 1", col2: "Data 2", col3: "Data 3" },
        { id: 2, col1: "Data 4", col2: "Data 5", col3: "Data 6" },
    ];

    const containerStyle = {
        width: "100%",
        overflowX: "auto",
        border: `1px solid ${t.border}`,
        borderRadius: "12px",
        background: t.surface
    };

    const tableStyle = {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "14px",
        color: t.text
    };

    const thStyle = {
        textAlign: "left",
        padding: "12px 24px",
        borderBottom: `1px solid ${t.border}`,
        color: t.textSecondary,
        fontWeight: "500"
    };

    const tdStyle = {
        padding: "16px 24px",
        borderBottom: `1px solid ${t.border}`, // Adds separator lines
        color: t.text
    };

    return (
        <div style={containerStyle}>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        {columns.length > 0 ? columns.map((col) => (
                            <th key={col} style={thStyle}>{col}</th>
                        )) : (
                            <>
                                <th style={thStyle}>Column 1</th>
                                <th style={thStyle}>Column 2</th>
                                <th style={thStyle}>Column 3</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {displayData.map((row, i) => (
                        <tr key={i} style={{ borderBottom: i === displayData.length - 1 ? 'none' : `1px solid ${t.border}` }}>
                            {Object.values(row).map((cell, j) => (
                                <td key={j} style={tdStyle}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
