import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    resolve: {
      alias: [],
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
