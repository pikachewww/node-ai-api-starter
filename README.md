# Node AI API Starter

A production-style AI backend starter built with Hono, TypeScript, Prisma and PostgreSQL.

## Features

- Hono + TypeScript REST API
- OpenAI-compatible LLM integration
- PDF resume parsing
- JD extraction
- Resume-JD match scoring
- Prisma + PostgreSQL persistence
- Docker PostgreSQL environment
- Repository / Service / Route layered architecture
- Zod request validation
- Unified response and error handling
- Soft delete
- Operation log transaction

## Tech Stack

- Hono

- TypeScript

- Prisma

- PostgreSQL

- Zod

- Docker

- OpenAI Compatible API

## Project Structure

src
 ├── constants
 ├── middleware
 ├── prompt
 ├── repositories
 ├── routes
 ├── schemas
 ├── services
 ├── utils

## API Examples

### Health Check

```bash
curl http://localhost:3000/health
```

## Quick Start

```bash
pnpm install

cp .env.example .env

pnpm dev

Generate Prisma
pnpm prisma generate

Run Migration
pnpm prisma migrate dev
```

## API Examples

| Method | API |
| ------- | ---- |
| GET | /health |
| POST | /chat |
| POST | /parse-resume |
| POST | /extract-jd |

```Bash
Chat
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-api-key-123" \
  -d '{"message":"用一句话解释什么是 RAG"}'

Parse Resume
curl -X POST http://localhost:3000/parse-resume \
  -F "resume=@test-files/test1.pdf"

List Resumes
curl "http://localhost:3000/resumes?page=1&pageSize=10"

Get Resume Detail
curl http://localhost:3000/resumes/{id}

Update Resume
curl -X PATCH http://localhost:3000/resumes/{id} \
  -H "Content-Type: application/json" \
  -d '{"filename":"updated-test.pdf"}'

Soft Delete Resume
curl -X DELETE http://localhost:3000/resumes/{id}
```
