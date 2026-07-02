import OpenAI from "openai";
import 'dotenv/config'

export const aiClient = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: process.env.BASE_URL
})

export const AI_MODEL = process.env.MODEL