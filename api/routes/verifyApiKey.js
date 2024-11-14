const User = require("../models/User");

// Middleware to verify API key
const verifyApiKey = async (req, res, next) => {
    try {
        const apiKey = req.query.apiKey || req.headers['x-api-key'];
        if (!apiKey) {
            return res.status(400).json({ error: 'API key is missing from the request' });
        }
        const user = await User.findOne({ apiKey });
        if (!user) {
            return res.status(404).json({ error: 'Invalid API key or user not found' });
        }
        req.user = user;  // Attach user to request object for further use
        next();
    } catch (error) {
        console.error('Error verifying API key:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = verifyApiKey;
