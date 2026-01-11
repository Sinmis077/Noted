import { writable } from 'svelte/store';
import { api } from '$lib/utils/api.js';

function createCategoriesStore() {
	const { subscribe, set, update } = writable([]);

	return {
		subscribe,

		loadCategories: async () => {
			try {
				const { data } = await api.get('/categories');
				set([
					{ label: 'to-dos', description: 'Things left to-do' },
					...data,
					{ label: 'completed', description: "I've completed these, I should be proud!" }
				]);
			} catch (err) {
				set([
					{ label: 'to-dos', description: 'Things left to-do' },
					{ label: 'completed', description: "I've completed these, I should be proud!" }
				]);
				throw err;
			}
		},

		addCategory: async (category) => {
			let existingCategory = null;
			update((categories) => {
				existingCategory = categories.filter(c => c.label === category.label);
				return categories;
			})

			if(existingCategory.length > 0) return existingCategory;

			const { data } = await api.post('/categories', category);

			update((categories) => [...categories, data]);

			return data;
		},

		editCategory: async (category) => {
			const { data } = await api.put(`/categories/${category.label}`, category);

			update((categories) =>
				categories.map((oldCategory) => (oldCategory.label === category.label ? data : oldCategory))
			);
		},

		deleteCategory: async (label) => {
			await api.delete(`/categories/${label}`);

			update((categories) => categories.filter((category) => category.label !== label));
		}
	};
}

export const categories = createCategoriesStore();
