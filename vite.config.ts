import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vue from '@vitejs/plugin-vue'
import visualizer from 'rollup-plugin-visualizer'
import figlet from 'figlet'

import type { UserConfig } from 'vite'

console.log(figlet.textSync('Vue3 TuiCalendar'))

const enableTypeBuild = !!+(process.env.ENABLE_TYPE_BUILD || 0)
const enableVisualizer = !!+(process.env.VISUALIZER || 0)

console.log('\n')
console.log('[info] build target', 'TuiCalendar')
console.log('[info] enable type build', enableTypeBuild)
console.log('[info] enable denpendencies visualizer', enableVisualizer)
console.log('\n')

export default defineConfig(({ mode }) => {
  const config: UserConfig = {
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
    build: {
      minify: false,
      emptyOutDir: false,
      lib: {
        entry: path.resolve(__dirname, './src/index.ts'),
        name: 'TuiCalendar',
        formats: ['es', 'umd'],
        fileName: (format: string) => {
          const postFix = format === 'umd' ? 'umd' : format === 'es' ? 'esm' : 'unknown'
          return `lib/index.${postFix}.js`
        },
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue',
          },
        },
      },
    },
    plugins: [
      vue(),
      enableTypeBuild &&
        dts({
          outputDir: path.resolve(__dirname, './dist/types/'),
          include: ['./src/**/*', 'env.d.ts'],
          copyDtsFiles: true,
          compilerOptions: {
            disableSizeLimit: true,
            preserveSymlinks: false,
            skipLibCheck: true,
            strict: false,
          },
        }),
      enableVisualizer && visualizer(),
    ],
  }

  console.log('[info] mode', mode)

  return config
})
