import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { dependencies } from './package.json'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'


export default defineConfig({
  plugins: [vue(), cssInjectedByJsPlugin()],
  build: {
    // target: browserslistToEsbuild(),
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      fileName: 'index',
      formats: ['cjs'], // es format removed to fix https://github.com/nextcloud/server build error
    },
    rollupOptions: {
      external: Object.keys(dependencies),
      output: {
        globals: { vue: 'Vue' }
      },
    },
  },
})
