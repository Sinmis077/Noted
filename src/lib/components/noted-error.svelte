<script>
	import {
		Empty,
		EmptyDescription,
		EmptyHeader,
		EmptyMedia,
		EmptyTitle
	} from '$lib/components/ui/empty/index.js';
	import { MessageSquareWarning } from 'lucide-svelte';

	const { error, title } = $props();
</script>

<div class="container mx-auto">
	<Empty>
		<EmptyHeader>
			<EmptyMedia class="rounded-full" variant="icon"><MessageSquareWarning /></EmptyMedia>
			<EmptyTitle>{title}</EmptyTitle>
			<EmptyDescription class="text-red-600">{error}</EmptyDescription>
		</EmptyHeader>
	</Empty>
</div>