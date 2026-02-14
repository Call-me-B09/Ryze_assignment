
const toCamel = (col) => {
    return col.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
};

const cols = ["Post ID", "Date", "User Name", "Is Active"];
cols.forEach(col => {
    console.log(`"${col}" -> "${toCamel(col)}"`);
});
