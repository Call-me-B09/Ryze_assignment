const Generation = require('../models/Generation');
const planner = require('../services/planner');
const generator = require('../services/generator');
const explainer = require('../services/explainer');

exports.generate = async (req, res) => {
    try {
        const { prompt, parentVersion } = req.body;
        console.log(`[Generate] Request received. Prompt: "${prompt}", ParentVersion: ${parentVersion}`);

        // Fetch parent version code if it exists (for context)
        let previousCode = null;
        if (parentVersion) {
            const parent = await Generation.findOne({ version: parentVersion });
            if (parent) {
                previousCode = parent.code;
                console.log(`[Generate] Found parent version ${parentVersion}. Code length: ${previousCode.length}`);
            } else {
                console.warn(`[Generate] Parent version ${parentVersion} NOT found.`);
            }
        }

        // 1. Planner Agent
        const plan = await planner(prompt, previousCode);

        // 2. Generator Agent
        let code = await generator(plan, previousCode, prompt);

        // Safety Check: Passed (We now allow standard HTML/Tailwind)
        // const forbiddenTags = ['<div', '<span', '<h1', '<p', 'className'];

        // 3. Explainer Agent
        const explanation = await explainer(code, plan);

        // Determine new version number
        // Simple strategy: Max version + 1. 
        // For distinct branching trees, we might want a different strategy, but "Version 4 with parent 2" implies a global sequence.
        const lastGen = await Generation.findOne().sort({ version: -1 });
        const newVersion = lastGen ? lastGen.version + 1 : 1;

        // 4. Save to DB
        const newGeneration = new Generation({
            version: newVersion,
            parentVersion: parentVersion || null,
            prompt,
            plan,
            code,
            explanation
        });

        await newGeneration.save();

        res.status(201).json(newGeneration);

    } catch (error) {
        console.error('Generation failed:', error);
        res.status(500).json({ error: 'Generation failed', details: error.message });
    }
};

exports.getVersions = async (req, res) => {
    try {
        const versions = await Generation.find().sort({ version: 1 });
        res.json(versions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch versions' });
    }
};

exports.getVersion = async (req, res) => {
    try {
        const version = await Generation.findOne({ version: req.params.version });
        if (!version) return res.status(404).json({ error: 'Version not found' });
        res.json(version);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch version' });
    }
};

exports.rollback = async (req, res) => {
    try {
        const { version } = req.body;
        const targetVersion = await Generation.findOne({ version });

        if (!targetVersion) {
            return res.status(404).json({ error: 'Target version not found' });
        }

        // In a real app, we might create a new "restore" event, but here we just return the version to the frontend
        res.json(targetVersion);
    } catch (error) {
        res.status(500).json({ error: 'Rollback failed' });
    }
};

exports.clearHistory = async (req, res) => {
    try {
        console.log("Attempting to clear history...");
        const result = await Generation.deleteMany({});
        console.log("History cleared. Deleted count:", result.deletedCount);
        res.json({ message: 'History cleared', deletedCount: result.deletedCount });
    } catch (error) {
        console.error("Error clearing history:", error);
        res.status(500).json({ error: 'Failed to clear history' });
    }
};
