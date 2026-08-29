import { existsSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vitest/config";

// Vitest does not read .env files the way Next.js does, so ANTHROPIC_API_KEY
// would otherwise need sourcing by hand before every run. process.loadEnvFile
// is Node's own .env parser (no extra dependency), loaded once here rather
// than in a test file so it runs before any test imports lib/evaluate.ts.
const envLocalPath = path.resolve(import.meta.dirname, ".env.local");
if (existsSync(envLocalPath)) {
  process.loadEnvFile(envLocalPath);
}

// Only the harness. Run explicitly via `pnpm test:eval`, never part of the
// default `pnpm test` (see vitest.config.mts). Needs ANTHROPIC_API_KEY.
export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, ".") },
  },
  test: {
    include: ["lib/harness/**/*.eval.test.ts"],
  },
});
