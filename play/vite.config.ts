import path from "node:path";
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    resolve: {
      alias: [
        {
          find: /^@\//,
          replacement: path.resolve(__dirname, './src') + path.sep,
        },
        {
          find: /^~@/,
          replacement: path.resolve(__dirname, './src'),
        },
      ],
    },
    server: {
      port: 8989,
      host: true,
      https: !!env.HTTPS,
    },
    optimizeDeps: {
      exclude: ['vue-demi'],
    },
  }
})
