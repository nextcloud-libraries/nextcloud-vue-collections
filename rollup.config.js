import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import babel from 'rollup-plugin-babel';
import localResolve from 'rollup-plugin-node-resolve';
import scss from 'rollup-plugin-scss';
import commonjs from 'rollup-plugin-commonjs';
import json from "rollup-plugin-json";
import alias from 'rollup-plugin-alias';
import terser from 'rollup-plugin-terser';
const path = require('path');
const cwd = process.cwd()

const isProduction = process.env.NODE_ENV === 'production';

export default {
	input: 'src/index.js', 
	external: (id) => {
		const externals = ['vue', 'vuex', 'axios', 'nextcloud-vue', 'nextcloud-axios']
		if (externals.includes(id)) {
			return true;
		}
		return /nextcloud-vue\/dist/.test(id)
	},
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
		alias({
			resolve: ['.js', '/index.js'],
		}),
		commonjs(),
		isProduction && terser.terser()
	],
};
