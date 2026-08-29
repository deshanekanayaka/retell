import path from "node:path";
import { defineConfig } from "vitest/config";

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
