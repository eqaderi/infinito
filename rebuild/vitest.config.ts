import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@lib": resolve(__dirname, "src/lib"),
    },
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
  },
});
