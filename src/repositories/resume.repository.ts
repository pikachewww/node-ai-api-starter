import { prisma } from "../utils/prisma.js";
import type { Prisma } from "@prisma/client";

// 统一封装数据库
export class ResumeRepository {
  async create(data: Prisma.ResumeCreateInput) {
    return prisma.resume.create({
      data,
    });
  }
  // 加事务方法
  async createWithLog(data: Prisma.ResumeCreateInput) {
    return prisma.$transaction(async (tx) => {
      const resume = await tx.resume.create({
        data,
      });
    });
  }

  // 查询所有简历 并按照创建时间倒序 最新的排前面
  async findAll() {
    return prisma.resume.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // 根据简历id查询数据: 全量查询
  async findById(id: string) {
    return prisma.resume.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  // 根据id 软删除
  async softDelete(id: string) {
    return prisma.resume.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // 分页查询:
  async findPage(params: { page: number; pageSize: number }) {
    const { page, pageSize } = params;

    const [list, total] = await Promise.all([
      prisma.resume.findMany({
        where: {
          deletedAt: null,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.resume.count({
        where: {
          deletedAt: null,
        },
      }),
    ]);
    console.log("Repository findPage");
    return {
      list,
      total,
      page,
      pageSize,
    };
  }

  async findPageAll(params: { page: number; pageSize: number }) {
    const { page, pageSize } = params;

    return prisma.resume.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // update
  async update(id: string, data: Prisma.ResumeUpdateInput) {
    return prisma.resume.update({
      where: { id },
      data,
    });
  }
}

export const resumeRepository = new ResumeRepository();
