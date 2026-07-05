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

    // 查询所有简历 并按照创建时间倒序 最新的排前面
    async findAll() {
        return prisma.resume.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })
    }

    // 根据简历id查询数据: 全量查询
    async findById(id: string) {
        return prisma.resume.findUnique({
            where: { id }
        })
    }

    // 根据id删除
    async deleteById(id: string) {
        return prisma.resume.delete({
            where: { id }
        })
    }

    // 分页查询:
    async findPage(params: {page: number; pageSize: number}) {
        const { page, pageSize } = params

        const [ list, total ] = await Promise.all([
            prisma.resume.findMany({
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: {
                    createdAt: "desc"
                }
            }),
            prisma.resume.count()
        ])
        console.log("Repository findPage")
        return {
            list, 
            total,
            page,
            pageSize
        }
    }

    async findPageAll(params: {page: number; pageSize: number}) {
        const { page, pageSize } = params

        return prisma.resume.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: {
                createdAt: "desc"
            }
        })
    }
}

export const resumeRepository = new ResumeRepository();