import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import babel from 'rollup-plugin-babel';
import localResolve from 'rollup-plugin-node-resolve';
import scss from 'rollup-plugin-scss';
import commonjs from 'rollup-plugin-commonjs';
import json from "rollup-plugin-json";
import replace from 'rollup-plugin-replace';
import alias from 'rollup-plugin-alias';
const path = require('path');
const cwd = process.cwd()

export default {
	input: 'src/index.js', 
	external: ['vue', 'vuex', 'axios', 'nextcloud-vue', 'nextcloud-axios', 'v-tooltip'],
	output: {
		file: 'dist/nextcloud-vue-collections.js',
		format: 'esm'
	},
	plugins: [
		scss({
			
		}),
		vue({
			css: true, // Dynamically inject css as a <style> tag
			compileTemplate: true, // Explicitly convert template to render function
			scss: {
				indentedSyntax: true
			},
		}),
		babel({
			exclude: 'node_modules/**'
		}),
		localResolve({
			extensions: ['.js', '.vue'],
		}),
		json(),
		replace({
			SCOPE_VERSION: 'abc123'
		}),
		alias({
			resolve: ['.js', '/index.js'],
		}),
		commonjs(),
	],
};
