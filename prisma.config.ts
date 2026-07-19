import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // Migrations/introspection use the direct (unpooled) Neon connection.
  datasource: {
    url: process.env.DIRECT_URL,
  },
});
