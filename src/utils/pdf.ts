import fs from "node:fs/promises"
import {PDFParse} from "pdf-parse"
// import pdf = require('pdf-parse')

export async function parsePdf(path: string) {
  const buffer = await fs.readFile(path)

  const parser = new PDFParse({data: buffer})
  const result = await parser.getText()

  return result.text
}