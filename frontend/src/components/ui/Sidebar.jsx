import React from 'react';

export function Sidebar({ items = ["Dashboard", "Settings", "Profile"], theme }) {
    return (
        <aside className={`w-64 h-full border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4 flex flex-col gap-2 ${theme === 'dark' ? 'dark' : ''}`}>
            {items.map((item) => (
                <button key={item} className="w-full text-left px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                    {item}
                </button>
            ))}
        </aside>
    );
}
