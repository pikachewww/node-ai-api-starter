import { aiClient } from "../utils/ai.js";
// service 负责写业务
// ai调用 PDF解析 JD分析 Match score
export class AIservice {
    async chat(system: string, user: string) {
        const completion = await aiClient.chat.completions.create({
            model: process.env.MODLE || "deepseek-chat",

            messages: [
                {
                    role: "system",
                    content: system
                },
                {
                    role: "user",
                    content: user
                }
            ]
        })

        return completion.choices[0]?.message?.content || ""
    }
}

export const aiService = new AIservice()