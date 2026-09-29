const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const MODEL = "gemini-3.5-flash-lite";

exports.generateAIResponse = async (prompt) => {
    const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt
    });

    return response.text;
};