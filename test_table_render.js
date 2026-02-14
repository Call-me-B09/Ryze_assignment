
const renderCell = (col, row) => {
    // 1. Try strict camelCase
    const camelKey = col.split(/\s+/).map((word, idx) =>
        idx === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join('');

    // 2. Robust Lookup
    const normalizedCol = col.toLowerCase().replace(/[^a-z0-9]/g, '');
    const foundKey = Object.keys(row).find(k =>
        k.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedCol
    );

    const val = row[camelKey] || row[foundKey] || row[col] || "MISSING";
    return val;
};

const row1 = { PostID: "123", Date: "2024" };
const row2 = { postId: "456", date: "2025" };
const row3 = { postid: "789", date: "2026" };

console.log("Post ID (Row1 PostID):", renderCell("Post ID", row1));
console.log("Post ID (Row2 postId):", renderCell("Post ID", row2));
console.log("Post ID (Row3 postid):", renderCell("Post ID", row3));
console.log("Date (Row1 Date):", renderCell("Date", row1));
console.log("Date (Row2 date):", renderCell("Date", row2));
