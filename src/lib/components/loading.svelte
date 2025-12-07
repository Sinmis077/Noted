<script>
	import { Empty, EmptyDescription, EmptyHeader, EmptyMedia } from '$lib/components/ui/empty/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';

	let { description } = $props();
</script>

<div class="container mx-auto h-screen flex flex-col justify-center items-center">
	<Empty>
		<EmptyHeader>
			<EmptyMedia variant="icon">
				<Spinner class="size-12 text-blue-500" />
			</EmptyMedia>
			<EmptyDescription>{description}</EmptyDescription>
		</EmptyHeader>
	</Empty>
</div>
