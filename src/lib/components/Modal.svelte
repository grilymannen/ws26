<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import Button from './Button.svelte';
	import Card from './Card.svelte';
	import { X } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		title?: string;
		description?: string;
		modalState: boolean;
	};

	let { children, modalState = $bindable(), title = '', description = '' }: Props = $props();
	$inspect(modalState);
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') modalState = false;
	}}
/>
{#if modalState}
	<div transition:fade class="fixed inset-0 z-20 flex items-center justify-center">
		<!--svelte-ignore a11y_no_static_element_interactions,a11y_click_events_have_key_events-->
		<div
			class="absolute inset-0 bg-black/10 backdrop-blur-sm"
			onclick={() => (modalState = false)}
		></div>
		<!--svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions-->
		<Card
			class="relative max-h-11/12 w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="mb-4 flex items-center justify-between p-2">
				<div>
					<h1 class="text-2xl font-semibold">{title}</h1>
					<p class="text-gray-500">{description}</p>
				</div>
				<Button onclick={() => (modalState = false)}>
					<X />
				</Button>
			</div>
			{@render children?.()}
		</Card>
	</div>
{/if}
