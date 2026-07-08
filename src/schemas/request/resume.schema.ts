import { z } from "zod";
import type { Prisma } from "@prisma/client"

export const resumeListQuerySchema = z.object({
  // z.coerce.number()：把 "1" 这种字符串转成数字 1
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().max(100).default(10),
});

export const updateResumeSchema = z.object({
    filename: z.string().min(1).optional(),
    parsedJson: z.custom<Prisma.InputJsonValue>().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, "至少要传一个要更新的字段");
