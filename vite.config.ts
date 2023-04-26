import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import { dependencies, peerDependencies } from './package.json'

export default defineConfig({
	plugins: [vue(), cssInjectedByJsPlugin()],
	build: {
		// target: browserslistToEsbuild(),
		outDir: 'dist',
		sourcemap: true,
		lib: {
			entry: resolve(__dirname, 'src/index.js'),
			fileName: 'index',
			formats: ['es', 'cjs'],
		},
		rollupOptions: {
			external: [...Object.keys(dependencies), ...Object.keys(peerDependencies)],
		},
	},
})
