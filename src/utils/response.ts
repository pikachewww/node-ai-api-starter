import { Context } from "hono"

export function success(
  c: Context,
  data: unknown = null,
  message = "Success"
) {
  return c.json({
    success: true,
    code: 0,
    message,
    data
  })
}

export function fail(
  c: Context,
  message = "Error",
  code = 400
) {
  return c.json(
    {
      success: false,
      code,
      message,
      data: null
    },
    // TypeScript 会把 status 推断成普通 number，但 Hono 的 c.json() 第二个参数要求的是特定的 HTTP 状态码类型，不接受随便一个 number。
    400
  )
}