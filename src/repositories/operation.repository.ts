import { prisma } from "../utils/prisma.js"
import type { Prisma } from "@prisma/client"

export class OperationRepository {
    create(data: Prisma.OperationLogCreateInput) {
        return prisma.operationLog.create({
            data
        })
    }
}

export const operationRepository = new OperationRepository()