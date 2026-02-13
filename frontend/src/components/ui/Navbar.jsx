import React from 'react';

export function Navbar({ logo = "App", links = ["Home", "About", "Contact"], theme }) {
    return (
        <nav className={`w-full h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-6 ${theme === 'dark' ? 'dark' : ''}`}>
            <div className="font-bold text-xl text-gray-900 dark:text-gray-100">{logo}</div>
            <div className="flex gap-6">
                {links.map((link) => (
                    <a key={link} href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium">
                        {link}
                    </a>
                ))}
            </div>
        </nav>
    );
}
