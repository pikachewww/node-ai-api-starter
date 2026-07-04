import { Hono } from "hono";
import fs from "node:fs/promises";
import { parsePdf } from "../utils/pdf.js";
import { success, fail } from "../utils/response.js";
import { aiService } from "../service/ai.service.js";
import { resumePrompt } from "../prompt/resume.prompt.js";
import { parseJson } from "../utils/json.js";

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

  const system = resumePrompt;
  const user = text;
  const raw = await aiService.chat(system, user);
  
  const resume = parseJson(raw);

  return success(c, resume);
});
