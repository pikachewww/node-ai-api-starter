import fs from "node:fs/promises";
import { parsePdf } from "../utils/pdf.js";
import { fail } from "../utils/response.js";
import { aiService } from "../service/ai.service.js";
import { resumePrompt } from "../prompt/resume.prompt.js";
import { parseJson } from "../utils/json.js";
import { resumeRepository } from "../repositories/resume.repository.js";
import { error } from "node:console";

export class ResumeService {
  // 解析简历
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

  // 查询所有简历列表
  async listResumes() {
    return resumeRepository.findAll()
  }

  // 查询所有简历列表: 分页
  async listPageResumes(params: {page: number; pageSize: number}) {
    // return resumeRepository.findPageAll(params)
    // curl "http://localhost:3000/resumes?page=1&pageSize=10"
    console.log("Service listResumes")
    return resumeRepository.findPage(params)
  }

  // 根据id查询
  async getResumeById(id: string) {
    const resume = await resumeRepository.findById(id)

    if (!resume) {
      throw new Error("简历不存在")
    }

    return resume
  }

  // 删除
  async deleteResumeById(id: string) {
    const result = resumeRepository.findById(id)
    
    if(!result) {
      throw new Error("简历不存在")
    }
    
    return resumeRepository.deleteById(id)
  }
}

export const resumeService = new ResumeService()