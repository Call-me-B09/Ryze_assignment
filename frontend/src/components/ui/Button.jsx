import React from 'react';

export function Button({ children, onClick, variant = 'primary', className = '' }) {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors duration-200";
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        secondary: "bg-gray-700 hover:bg-gray-600 text-gray-200",
        ghost: "bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white"
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
