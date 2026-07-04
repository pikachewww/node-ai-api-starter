import { z } from 'zod'
//  数据结构
export const jdSchema = z.object({
    jd: z.string().min(20, "JD内容太短")
})