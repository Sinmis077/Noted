import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	ssr: {
		noExternal: ['bits-ui', 'lucide-svelte', 'clsx', 'tailwind-variants', 'tailwind-merge']
	},
	optimizeDeps: {
		include: ['bits-ui']
	}
});