import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	server: {
		port: process.env.NODE_ENV === 'development' ? 5173 : (process.env.SERVER_PORT ?? 3000)
	},
	plugins: [tailwindcss(), sveltekit()],
	ssr: {
		noExternal: ['bits-ui', 'lucide-svelte', 'clsx', 'tailwind-variants', 'tailwind-merge']
	},
	optimizeDeps: {
		include: ['bits-ui']
	}
});