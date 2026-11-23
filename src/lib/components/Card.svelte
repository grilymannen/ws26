<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	let { children, ...props }: SvelteHTMLElements['div'] = $props();
</script>

<div class={`rounded-md border border-gray-300 p-4`} {...props}>
	{@render children?.()}
</div>
