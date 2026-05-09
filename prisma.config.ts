import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: {
    // During build, we don't need the actual database URL for Prisma Client generation
    url: process.env.DATABASE_URL || "postgresql://placeholder:5432/placeholder",
  },
});