<script>
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { Empty, EmptyHeader, EmptyTitle } from '$lib/components/ui/empty/index.js';

	let { value = $bindable(0) } = $props();
</script>

<div class="container mx-auto">
	<Empty>
		<EmptyHeader>
			{#if value === 0}
				<EmptyTitle>Fetching your notes...</EmptyTitle>
			{:else if value === 50}
				<EmptyTitle>Rendering your notes...</EmptyTitle>
			{/if}
		</EmptyHeader>
	</Empty>
	<Progress {value} max={100} />
</div>
