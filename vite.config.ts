import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": "/src", // Здесь мы указываем, что `@` — это путь к папке `/src`
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.ts"],
  },
});
