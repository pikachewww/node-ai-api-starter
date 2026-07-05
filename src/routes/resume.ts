import { Hono } from "hono";
import { success, fail } from "../utils/response.js";
import { resumeService } from "../service/resume.service.js";

export const resumeRoute = new Hono();
//  解析简历
resumeRoute.post("/parse-resume", async (c) => {
  // http格式已经变成 multipart/form-data
  const body = await c.req.parseBody();

  console.log(body);

  // 拿到文件 还要放到本地存起来
  const file = body["resume"];
  if (!(file instanceof File)) {
    return fail(c, "请上传简历文件", 400);
  }

  const result = await resumeService.parseResume(file)

  return success(c, result);
});
