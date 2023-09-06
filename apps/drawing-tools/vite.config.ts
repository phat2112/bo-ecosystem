/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPath from "vite-tsconfig-paths";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPath()],
  base: "./",
  test: {
    include: ["**/__tests__/*.{test,spec}.[jt]s?(x)"],
    globals: true,
    environment: "jsdom",
  },
  resolve: {
    alias: {
      Hooks: path.resolve(__dirname, "./src/hooks"),
      Components: path.resolve(__dirname, "./src/components"),
      Screen: path.resolve(__dirname, "./src/screens"),
      Type: path.resolve(__dirname, "src/types"),
    },
  },
});
