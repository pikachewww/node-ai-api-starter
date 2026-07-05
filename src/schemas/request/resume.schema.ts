import { z } from "zod"

export const resumeListQuerySchema = z.object({
    // z.coerce.number()：把 "1" 这种字符串转成数字 1  
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().max(100).default(10)
})