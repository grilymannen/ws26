<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = Omit<HTMLInputAttributes, 'class'> & { class?: string };

	let {
		value = $bindable(''),
		class: className = '',
		maxlength,
		autocomplete = 'off',
		...rest
	}: Props = $props();

	const showCounter = $derived(maxlength != null && maxlength > 0);
</script>

<div class="relative flex items-center {className}">
	<input
		{...rest}
		bind:value
		{maxlength}
		{autocomplete}
		class="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none
			focus:border-neutral-900 disabled:cursor-not-allowed disabled:bg-black/5
			{showCounter ? 'pr-14' : ''}"
	/>
	{#if showCounter}
		<span aria-hidden="true" class="pointer-events-none absolute right-3 text-xs text-neutral-500">
			{String(value ?? '').length}/{maxlength}
		</span>
	{/if}
</div>
