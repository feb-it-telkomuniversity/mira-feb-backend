import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" })

async function generateResponse(prompt) {
    try {
        const result = await model.generateContent(prompt)
        return result.response.text()
    } catch (error) {
        console.error("Error dari Gemini Service:", error)
        return "Maaf, sistem AI sedang mengalami gangguan."
    }
}

export { generateResponse }