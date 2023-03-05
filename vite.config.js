import { sveltekit } from '@sveltejs/kit/vite'

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			'src/': new URL('./src/', import.meta.url).pathname,
		},
	},
}

export default config
