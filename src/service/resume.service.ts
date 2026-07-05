import fs from "node:fs/promises";
import { parsePdf } from "../utils/pdf.js";
import { fail } from "../utils/response.js";
import { aiService } from "../service/ai.service.js";
import { resumePrompt } from "../prompt/resume.prompt.js";
import { parseJson } from "../utils/json.js";
import { resumeRepository } from "../repositories/resume.repository.js";

export class ResumeService {
  async parseResume(file: File) {
    const arraybuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arraybuffer);
    // 创建文件夹
    await fs.mkdir("uploads", { recursive: true });
    // 写入文件
    const filePath = `uploads/${file.name}`
    await fs.writeFile(filePath, buffer);
    const text = await parsePdf(`uploads/${file.name}`);

    // 发送pdf解析结果给ai
    if (!text.trim()) {
      throw new Error("PDF 未解析出有效文本")
    }

    const raw = await aiService.chat(resumePrompt, text);

    const parsed = parseJson(raw);

    const savedResume = await resumeRepository.create({
        filename: file.name,
        originalText: text,
        parsedJson: parsed
    })
    return savedResume
  }
}

export const resumeService = new ResumeService()