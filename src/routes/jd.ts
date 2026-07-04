import { Hono } from "hono";
import { aiClient } from "../utils/ai.js";
import { success, fail } from "../utils/response.js";
import { jdSchema } from "../schema/jd.js"
import { aiService } from "../service/ai.service.js";
import { jdPrompt } from "../prompt/jd.prompt.js";
import { parseJson } from "../utils/json.js";
//  只负责
// 接收请求 参数校验 调用service 返回响应
export const jdRoute = new Hono();
// 岗位jd(职责)
jdRoute.post("/extract-jd", async (c) => {
  // 上传职责pdf 读取文本 传给ai 让它提取岗位要求 返回结构数据
  const body = await c.req.json();
  const result = jdSchema.safeParse(body)
  if (!result.success) {
    return fail(c, "参数校验失败：jd 必须是至少 20 个字符的字符串", 2001)
  }
  console.log(body);

  const system = jdPrompt
  const user = result.data.jd
  const raw = await aiService.chat( system, user)
  const resume = parseJson(raw)

  return success(c, resume);
});
