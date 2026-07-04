-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalText" TEXT NOT NULL,
    "parsedJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);
