import { z } from 'zod'

export const matchSchema = z.object({
    resume: z.any(),
    jd: z.any()
})