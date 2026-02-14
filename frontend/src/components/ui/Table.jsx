import React from 'react';
import { themes } from '../../theme';

export function Table({ columns = [], data = [], theme = "dark" }) {
    const t = themes[theme] || themes.dark;

    // Mock data generation if none provided
    const displayData = data.length > 0 ? data : [
        { id: 1, col1: "Data 1", col2: "Data 2", col3: "Data 3" },
        { id: 2, col1: "Data 4", col2: "Data 5", col3: "Data 6" },
    ];

    return (
        <div style={{
            width: "100%",
            overflowX: "auto",
            borderRadius: t.radius,
            border: `1px solid ${t.border}`,
            boxShadow: t.shadowSm,
            background: t.card // Table container background
        }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                    <tr style={{ background: t.surface, borderBottom: `1px solid ${t.border}` }}>
                        {columns.length > 0 ? columns.map((col, i) => (
                            <th key={i} style={{
                                padding: "12px 16px",
                                fontSize: "12px",
                                fontWeight: "600",
                                color: t.textSecondary,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em"
                            }}>
                                {col}
                            </th>
                        )) : (
                            // Fallback headers if no columns provided
                            <>
                                <th style={{ padding: "12px 16px", color: t.textSecondary }}>Column 1</th>
                                <th style={{ padding: "12px 16px", color: t.textSecondary }}>Column 2</th>
                                <th style={{ padding: "12px 16px", color: t.textSecondary }}>Column 3</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {displayData.map((row, i) => (
                        <tr key={i}
                            style={{ borderBottom: i === displayData.length - 1 ? 'none' : `1px solid ${t.border}`, transition: "background 0.1s" }}
                            onMouseOver={(e) => e.currentTarget.style.background = `${t.surface}80`}
                            onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                        >
                            {columns.length > 0 ? columns.map((col, j) => {
                                // 1. Try strict camelCase (e.g. "Post ID" -> "postId")
                                // Standard camelCase: lowercase first word, capitalize first letter of subsequent words
                                const camelKey = col.split(/\s+/).map((word, idx) =>
                                    idx === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                                ).join('');

                                // 2. Robust Lookup: Find any key in row that matches structurally
                                // This handles "Post ID" -> "postId", "postid", "PostID", "Post_ID" etc.
                                const normalizedCol = col.toLowerCase().replace(/[^a-z0-9]/g, '');
                                const foundKey = Object.keys(row).find(k =>
                                    k.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedCol
                                );

                                const val = row[camelKey] || row[foundKey] || row[col] || "";

                                return (
                                    <td key={j} style={{ padding: "16px", color: t.text, fontSize: "14px" }}>
                                        {val}
                                    </td>
                                );
                            }) : Object.values(row).map((cell, j) => (
                                <td key={j} style={{ padding: "16px", color: t.text, fontSize: "14px" }}>
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
