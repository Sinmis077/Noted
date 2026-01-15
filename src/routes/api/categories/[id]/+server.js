import { error, json } from '@sveltejs/kit';
import { deleteCategory, saveCategory } from '$lib/server/database/catagories_repository.js';

export async function PUT({ params, request, locals }) {
	const workspace = locals.workspace;

	if(!workspace) {
		throw error(403, 'You are unauthorized');
	}

	const category = await request.json();

	if (category.label !== params.label) {
		throw error(400, 'Category label mismatch between URL and body');
	}

	const updatedCategory = saveCategory(workspace, category);

	return json(updatedCategory);
}

export async function DELETE({ params, locals }) {
	const workspace = locals.workspace;

	if (!workspace) {
		throw error(403, 'You are unauthorized');
	}

	const success = deleteCategory(workspace, params.id);

	if (!success) {
		throw error(404, 'Category not found');
	}

	return new Response(null, { status: 204 });
}
