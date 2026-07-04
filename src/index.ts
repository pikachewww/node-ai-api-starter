import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { z } from "zod"
import { success } from "./utils/response.js"
import { logger } from "./middleware/logger.js";
import { apiKeyAuth } from "./middleware/apiKey.js";
import { aiClient } from "./utils/ai.js"
import 'dotenv/config'
import { errorHandler } from "./middleware/error.js";
import { ErrorCode } from './constants/const.js'
import { fail } from "./utils/response.js";
import { resumeRoute } from "./routes/resume.js"
import { jdRoute } from "./routes/jd.js";
import { matchRoute } from "./routes/match.js";

// 模型
const AI_MODEL = process.env.MODEL || "deepseek-chat"
// hono框架/express
const app = new Hono();
// 中间件
app.use('*', logger)
// app.use('*', apiKeyAuth)
app.onError(errorHandler)
// Zod 参数校验
const chatSchema = z.object({
  message: z.string()
})
// 路由：
app.route("/", resumeRoute) // 解析路由
app.route("/", jdRoute) // 解析路由
app.route("/", matchRoute) // 解析jd

app.get("/", (c) => {
  console.log('1234', process.env.PORT)
  return c.text("Hello Hono!");
});

app.get("/home", (c) => {
  return c.text("home page");
});

app.get("/health", (c) => {
  // 封装的方法
  return fail(c, "message不能为空", ErrorCode.PARAMS_ERROR);
  // return success(c, null, "Server is running");
});

app.post("/chat", apiKeyAuth, async(c) => {
  const req = await c.req.json()
  // zod参数校验
  const result = chatSchema.safeParse(req)

  if(!result.success) {
    return c.json({
      success: false,
      message: "参数校验失败: message必须是字符串",
    })
  }
// chat 大模型交互
  const compliation = await aiClient.chat.completions.create({
    model: AI_MODEL,
    messages: [
      {
        role: "system",
        content: '你是一个专业版，简洁的AI助手。'
      },
      {
        role: "user",
        content: result.data.message
      }
    ]
  })

  const answer = compliation.choices[0]?.message?.content
  // throw new Error()
  // 返回大模型响应
  return success(c, {answer});
});

// 调用接口案例： get post put
// 文本 视频流 文件
// fs stream 文件读写 图片

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
