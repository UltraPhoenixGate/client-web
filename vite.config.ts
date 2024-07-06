import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import UnoCss from 'unocss/vite'

// https://vitejs.dev/config/
// @ts-expect-error tauri is not defined in the browser
export default defineConfig(async () => ({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  plugins: [
    solid(),
    UnoCss(),
    // legacy(),
  ],
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
}))
