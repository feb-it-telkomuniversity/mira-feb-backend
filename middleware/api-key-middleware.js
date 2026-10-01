export const verifyApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    const validApiKey = process.env.EXTERNAL_API_KEY || 'mira_api_key_secure_2026';

    if (!apiKey || apiKey !== validApiKey) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid API Key'
        });
    }

    next();
};
