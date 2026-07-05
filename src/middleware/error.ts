import type { ErrorHandler } from "hono";
import { fail } from '../utils/response.js'
import { ZodError } from "zod";

export const errorHandler: ErrorHandler = (error, c) => {
  console.error(error)

  // curl "http://localhost:3000/resumesPage?page=abc&pageSize=-10"
  if (error instanceof ZodError) {
    return fail(c, "参数错误" + error.issues[0]?.message, 400)
  }

  return fail(c, error instanceof Error ? error.message : '服务器错误', 500)
}