import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": "/src", // Здесь мы указываем, что `@` — это путь к папке `/src`
    },
  },
  test: {
    globals: true,
    environment: "jsdom", // Эмуляция браузера для тестов
  },
});
