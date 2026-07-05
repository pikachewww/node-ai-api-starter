import { Hono } from "hono";
import { success, fail } from "../utils/response.js";
import { resumeService } from "../service/resume.service.js";
import { resumeListQuerySchema } from "../schemas/request/resume.schema.js"

export const resumeRoute = new Hono();
//  上传并解析简历
// curl -X POST http://localhost:3000/parse-resume \
//   -F "resume=@test-files/test1.pdf"
resumeRoute.post("/parse-resume", async (c) => {
  // http格式已经变成 multipart/form-data
  const body = await c.req.parseBody();

  console.log(body);

  // 拿到文件 还要放到本地存起来
  const file = body["resume"];
  if (!(file instanceof File)) {
    return fail(c, "请上传简历文件", 400);
  }

  const result = await resumeService.parseResume(file);

  return success(c, result);
});

// 查询所有简历
resumeRoute.get("/resumes", async (c) => {
  const result = await resumeService.listResumes();

  return success(c, result);
});

// 根据id查询
// curl http://localhost:3000/resumes/cmr7gyc2p0000c955vz1gs6cc
resumeRoute.get("/resumes/:id", async (c) => {
  const id = c.req.param("id");
  const result = await resumeService.getResumeById(id);
  return success(c, result);
});

// 删除
// curl -X DELETE http://localhost:3000/resumes/cmr7gyc2p0000c955vz1gs6cc
resumeRoute.delete("/resumes/:id", async (c) => {
  const id = c.req.param("id");
  const result = await resumeService.deleteResumeById(id);
  return success(c, result, "删除成功");
});

// 按照分页查询
// curl "http://localhost:3000/resumesPage?page=1&pageSize=10"
resumeRoute.get("/resumesPage", async (c) => {
  // 异常测试： curl "http://localhost:3000/resumesPage?page=abc&pageSize=-10"
  const query = resumeListQuerySchema.parse({
        page: c.req.query("page"),
        pageSize: Number(c.req.query("pageSize") || 10)
  })

  const result = await resumeService.listPageResumes(query);
  console.log("Route /resumesPage");
  return success(c, result);
});
// {"success":false,
//   "code":500,
//   "message":"[\n  {\n    \"expected\": \"number\",\n    \"code\": \"invalid_type\",\n    \"received\": \"NaN\",\n    \"path\": [\n      \"page\"\n    ],\n    \"message\": \"Invalid input: expected number, received NaN\"\n  }\n]",
//   "data":null
// }
