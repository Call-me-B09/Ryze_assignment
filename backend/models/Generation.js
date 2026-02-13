const mongoose = require('mongoose');

const generationSchema = new mongoose.Schema({
    version: {
        type: Number,
        required: true
    },
    parentVersion: {
        type: Number,
        default: null
    },
    prompt: {
        type: String,
        required: true
    },
    plan: {
        type: Object,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure version uniqueness if we wanted to enforce strictly linear versioning,
// but for branching we might just rely on the application logic or unique index on version.
// The user requirement implies a global versioning or simple incremental versioning.
// Let's index version for faster lookups.
generationSchema.index({ version: 1 }, { unique: true });

module.exports = mongoose.model('Generation', generationSchema);
