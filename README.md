# Node AI API Starter

An AI Backend Starter built with Hono + TypeScript + DeepSeek.

## Features

- ✅ Hono REST API
- ✅ Zod Validation
- ✅ API Key Authentication
- ✅ Global Error Handler
- ✅ Request Logger
- ✅ Resume Parser
- ✅ JD Parser
- ✅ DeepSeek Integration

## Tech Stack

- TypeScript
- Hono
- Zod
- OpenAI SDK
- pdf-parse
- pnpm

## Quick Start

```bash
pnpm install

cp .env.example .env

pnpm dev
```

## API

| Method | API |
| ------- | ---- |
| GET | /health |
| POST | /chat |
| POST | /parse-resume |
| POST | /extract-jd |

## Roadmap

- ✅ Resume Parser
- ✅ JD Parser
- 🚧 Match Score
- 🚧 Resume Rewrite
- 🚧 Cover Letter