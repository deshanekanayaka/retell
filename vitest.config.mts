import path from "node:path";
import { defineConfig } from "vitest/config";

// The evaluation harness (lib/harness/*.eval.test.ts) calls the real model
// provider, costs money, and needs ANTHROPIC_API_KEY. It must never run as
// part of the default `pnpm test`, which every pull request runs and which
// has no network access to a live provider. `pnpm test:eval` (vitest.harness
// .config.mts) runs it deliberately, on demand.
export default defineConfig({
  resolve: {
    // Matches tsconfig.json's "@/*" -> "./*", the alias every route and
    // most lib files import through. Vitest does not read tsconfig paths on
    // its own.
    alias: { "@": path.resolve(import.meta.dirname, ".") },
  },
  test: {
    exclude: ["**/node_modules/**", "**/*.eval.test.ts"],
  },
});
