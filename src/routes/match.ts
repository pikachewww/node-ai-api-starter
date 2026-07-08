// 将ai组合成完整业务
// match_scores
// /parse-resume
//         │
//         ▼
// Resume JSON
// /extract-jd
//         │
//         ▼
// JD JSON
// /match-score ⭐⭐⭐⭐⭐
//         │
//         ▼
// Score JSON


import { Hono } from "hono"
import { success, fail } from "../utils/response.js"
import { matchSchema } from "../schemas/ai/match.js"
import { aiService } from "../service/ai.service.js"
import { matchPrompt } from "../prompt/match.prompt.js";
import { parseJson } from "../utils/json.js"

export const matchRoute = new Hono();

matchRoute.post("/match-score", async (c) => {
    // 匹配大模型
    // 分析岗位
    // 分析结果
    // 根据结果返回建议

    // 参数校验
    const body = await c.req.json()

    const result = matchSchema.safeParse(body)

    if(!result.success) {
        return fail(c, "参数错误", 201)
    }

    // result 写提示词发给ai
    const system = matchPrompt
    const user = `Resume:
                    ${JSON.stringify(result.data.resume)}
                    JD:
                    ${JSON.stringify(result.data.jd)}`
    const raw = await aiService.chat(system, user)
    const score = parseJson(raw)
    
    console.log(JSON.stringify(score));
  
    return success(c, score);

})