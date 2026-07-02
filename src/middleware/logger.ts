import type { MiddlewareHandler } from "hono"

export const logger: MiddlewareHandler = async (c, next) => {
  if (c.req.path.startsWith("/.well-known")) {
    await next()
    return
  }

  const start = Date.now()

  console.log("Request", `${c.req.method} ${c.req.path}`)

  await next()

  const duration = Date.now() - start

  console.log("Response", `${c.req.method} ${c.req.path} ${c.res.status} ${duration}ms`)
}