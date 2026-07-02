import type { MiddlewareHandler } from "hono"
import { fail } from "../utils/response.js"

export const apiKeyAuth: MiddlewareHandler = async (c, next) => {
  const apiKey = c.req.header("x-api-key")
  const expectedApiKey = process.env.APP_API_KEY

  if (!expectedApiKey) {
    return fail(c, "服务端未配置 APP_API_KEY", 500)
  }

  if (apiKey !== expectedApiKey) {
    return fail(c, "Unauthorized", 401)
  }

  await next()
}