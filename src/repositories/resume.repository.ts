import { prisma } from "../utils/prisma.js"
// 统一封装数据库
export class ResumeRepository {
    async create(data: {
        filename: string;
        originalText: string;
        parsedJson: unknown;
    }) {
        return prisma.resume.create({
            data,
        })
    }
}

export const resumeRepository = new ResumeRepository();