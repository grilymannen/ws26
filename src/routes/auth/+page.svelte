<script lang="ts">
	import { signup, login } from './remote';
	import { ArrowLeftRightIcon } from '@lucide/svelte';
	import { Button, Card, Input, Label } from '#lib/components.ts';
	import { fly } from 'svelte/transition';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let user = $derived(data.user)
	let signingup = $state(true);
	let hasUser = $derived(!!user);

	const toggle = () => (signingup = !signingup);
</script>

{#snippet authForm(action: typeof signup, title: string, other: string)}
	<form {...action}>
		<h2 class="mb-2 text-xl font-semibold">{title}</h2>

		<Label>
			Username<Input
				{...action.fields.name.as('text')}
				disabled={!!action.pending || hasUser}
			/></Label
		>
		<Label
			>Password<Input
				{...action.fields.pass.as('password')}
				disabled={!!action.pending || hasUser}
			/></Label
		>

		<div class="mt-4">
			{#if action.result}
				<p class:text-red-500={!action.result.success}>{action.result.message}</p>
			{/if}
			{#each action.fields.allIssues() as { message, path }}
				{let issue = $derived(message.split(':'))}
				{let a = $derived(issue[1].match(/[0-9]/))}
				<p class="text-red-500/90">{issue[0]}: {path} must be {a}</p>
			{/each}
		</div>

		<div class="mt-4">
			<Button type="submit" disabled={!!action.pending || hasUser}>{title}</Button>
			<Button type="button" variant="secondary" onclick={toggle}>
				<div class="flex items-center gap-2">
					{other} instead? <ArrowLeftRightIcon size={20} />
				</div>
			</Button>
		</div>
	</form>
{/snippet}

<Card>
	<div class="relative h-75 overflow-hidden text-nowrap">
		{#if signingup}
			<div class="absolute inset-0" transition:fly={{ x: 300 }}>
				{@render authForm(signup, 'Sign up', 'Log in')}
			</div>
		{:else}
			<div class="absolute inset-0" transition:fly={{ x: -300 }}>
				{@render authForm(login, 'Log in', 'Sign up')}
			</div>
		{/if}
	</div>
</Card>
