import React from 'react';

export function Table({ columns = [], data = [], theme }) {
    // Mock data generation if none provided
    const displayData = data.length > 0 ? data : [
        { id: 1, col1: "Data 1", col2: "Data 2", col3: "Data 3" },
        { id: 2, col1: "Data 4", col2: "Data 5", col3: "Data 6" },
    ];

    return (
        <div className={`overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 ${theme === 'dark' ? 'dark' : ''}`}>
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    <tr>
                        {columns.length > 0 ? columns.map((col) => (
                            <th key={col} className="px-6 py-3 font-medium">{col}</th>
                        )) : (
                            <>
                                <th className="px-6 py-3 font-medium">Column 1</th>
                                <th className="px-6 py-3 font-medium">Column 2</th>
                                <th className="px-6 py-3 font-medium">Column 3</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                    {displayData.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            {Object.values(row).map((cell, j) => (
                                <td key={j} className="px-6 py-4 text-gray-600 dark:text-gray-400">{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
