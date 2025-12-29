import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
require("dotenv").config(); // Загружаем переменные окружения
const port = process.env.VITE_PORT; // Получаем порт из .env

// https://vite.dev/config/
export default defineConfig({
  root: "src",
  base: "./", // Делаем пути относительными для корректной работы через file://
  plugins: [react()],
  server: {
    port: `${port}`,
  },
  build: {
    outDir: "dist", // Устанавливаем директорию для сборки относительно корня
    emptyOutDir: true, // Очищаем директорию перед сборкой
  },
});
