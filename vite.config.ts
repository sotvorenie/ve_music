import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from 'node:url'

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [vue()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1421,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@api': fileURLToPath(new URL('./src/api', import.meta.url)),
            '@icons': fileURLToPath(new URL('./src/assets/icons', import.meta.url)),
            '@composables': fileURLToPath(new URL('./src/composables', import.meta.url)),
            '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
            '@store': fileURLToPath(new URL('./src/store', import.meta.url)),
            '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
            '@components': fileURLToPath(new URL('./src/components/block', import.meta.url)),
            '@common': fileURLToPath(new URL('./src/components/common', import.meta.url)),
            '@ui': fileURLToPath(new URL('./src/components/ui', import.meta.url)),
        }
    }
}));
