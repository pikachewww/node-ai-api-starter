import type { ErrorHandler } from "hono";
import { fail } from '../utils/response.js'

export const errorHandler: ErrorHandler = (error, c) => {
  console.error(error)
  return fail(c, error instanceof Error ? error.message : '服务器错误', 500)
}