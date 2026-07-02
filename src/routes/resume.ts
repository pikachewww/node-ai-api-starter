import { Hono } from "hono";
import fs from "node:fs/promises";
import { parsePdf } from "../utils/pdf.js";
import { aiClient } from "../utils/ai.js";
import { success, fail } from "../utils/response.js";

export const resumeRoute = new Hono();
//  解析简历
resumeRoute.post("/parse-resume", async (c) => {
  // http格式已经变成 multipart/form-data
  const body = await c.req.parseBody();

  console.log(body);

  // 拿到文件 还要放到本地存起来
  const file = body["resume"];
  if (!(file instanceof File)) {
    return c.json(
      {
        success: false,
        message: "请上传简历文件",
      },
      400,
    );
  }

  const arraybuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arraybuffer);
  // 创建文件夹
  await fs.mkdir("uploads", { recursive: true });
  // 写入文件
  await fs.writeFile(`uploads/${file.name}`, buffer);
  const text = await parsePdf(`uploads/${file.name}`);

  // 发送pdf解析结果给ai
  if (!text.trim()) {
    return fail(c, "PDF 未解析出有效文本", 2001);
  }

  const completion = await aiClient.chat.completions.create({
    model: process.env.MODEL || "deepseek-chat",
    messages: [
      {
        role: "system",
        content: `
            你是一个专业的简历解析助手。
            请从用户提供的简历文本中提取结构化信息。
            只返回 JSON，不要返回 Markdown，不要解释。
            JSON 格式如下：
            {
                "name": "",
                "phone": "",
                "email": "",
                "skills": [],
                "education": [],
                "workExperience": [],
                "projects": [],
                "summary": ""
            }
            `,
      },
      {
        role: "user",
        content: text,
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

  //   return c.json({
  //     success: true,
  //     data: {
  //       filename: file.name,
  //       size: file.size,
  //       type: file.type,
  //       text: text.slice(0, 1000),
  //     },
  //   });
});
