const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const MODEL = "gemini-3.8-flash";

exports.generateAIResponse = async (prompt) => {
    const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt
    });

    return response.text;
};