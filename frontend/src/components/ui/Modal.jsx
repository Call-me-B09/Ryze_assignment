import React from 'react';
import { themes } from '../../theme';

export function Modal({ isOpen, onClose, title, children, theme = "dark" }) {
    if (!isOpen) return null;
    const t = themes[theme] || themes.dark;

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0,0,0,0.5)",
            zIndex: 50,
            backdropFilter: "blur(4px)"
        }}>
            <div style={{
                background: t.surface,
                color: t.text,
                padding: "24px",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "500px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                border: `1px solid ${t.border}`,
                margin: "20px"
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                    borderBottom: `1px solid ${t.border}`,
                    paddingBottom: "16px"
                }}>
                    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>{title}</h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: t.textSecondary,
                            fontSize: "20px",
                            cursor: "pointer"
                        }}
                    >
                        ✕
                    </button>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}
