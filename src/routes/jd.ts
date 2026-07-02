import { Hono } from "hono";
import { aiClient } from "../utils/ai.js";
import { success, fail } from "../utils/response.js";
import { z } from "zod"

export const jdRoute = new Hono();
// 岗位jd(职责)
const jdSchema = z.object({
  jd: z.string().min(20, "JD 内容太短")
})
jdRoute.post("/extract-jd", async (c) => {
  // 上传职责pdf 读取文本 传给ai 让它提取岗位要求 返回结构数据
  const body = await c.req.json();
  const result = jdSchema.safeParse(body)
  if (!result.success) {
    return fail(c, "参数校验失败：jd 必须是至少 20 个字符的字符串", 2001)
  }
  console.log(body);

  const completion = await aiClient.chat.completions.create({
    model: process.env.MODEL || "deepseek-chat",
    messages: [
      {
        role: "system",
        content: `
            你是一个专业的jd解析助手。
            请从用户提供的岗位描述中提取结构化信息。
            只返回 JSON，不要返回 Markdown，不要解释。
            JSON 格式如下：
            {
                "title": "",

                "requiredSkills": [],

                "preferredSkills": [],

                "responsibilities": [],

                "experienceLevel": "",

                "keywords": []
                          }
            `,
      },
      {
        role: "user",
        content: result.data.jd,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content || "";

  let resume;

  try {
    resume = JSON.parse(raw);
  } catch {
    return fail(c, "AI 返回的不是合法 JSON", 5001);
  }

  return success(c, resume);
});
