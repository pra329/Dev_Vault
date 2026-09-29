const { generateAIResponse } = require('../services/aiService');
const AppError = require('../utils/appError');

exports.explainCode = async(req, res, next) => {
    try {
        const {code, language} = req.body;
        if(!code || !language) {
            return next(new AppError('code and language are required', 400));
        }
        const prompt = `
            you are a programming teacher
            Explain the following ${language} code in simple language.
            Include:
            1. What the code does
            2. How the code works step by step
            3. Time complexity
            4. Space complexity

            Keep the explanation clear and easy to understand.
            Code:
            ${code}`;

        const explanation = await generateAIResponse(prompt);
        return res.status(200).json({
            success: true,
            data: {
                explanation
            }
        });
    }
    catch(err) {
        return next(err);
    }
}