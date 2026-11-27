<script lang="ts">
	import { deleteAllSessions, deleteSession, getAllSessions, uploadAvatar } from './remote';

	import { Button, Card, Input, Label, Modal } from '#lib/components.ts';
	import { ClockFading, Monitor, Settings, SquarePen, Clock, Trash } from '@lucide/svelte';

	import type { PageProps } from './$types';
	import type { Component } from 'svelte';

	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	import { tooltipper } from '#lib/util/tooltip.ts';
	import { logout } from '#lib/logout.ts';

	let { data }: PageProps = $props();

	const user = $derived(data.user);
	const { file, id } = uploadAvatar.fields;

	const categories = [
		{ text: 'general', Icon: Settings },
		{ text: 'sessions', Icon: Monitor }
	] as const satisfies { text: string; Icon: Component }[];

	type Category = (typeof categories)[number]['text'];

	function getCategory(value: string | null): Category {
		return categories.find((c) => c.text === value)?.text ?? 'general';
	}

	let category: Category = $derived(getCategory(page.url.searchParams.get('t')));

	let sessiondata = $derived(await getAllSessions(user!.id));
	let allSessions = $derived(sessiondata.all);
	let modalOpen = $state(false);
</script>

<Card>
	<h1 class="truncate text-xl font-semibold">
		Your account: <span class="font-bold">{user!.name}</span>
	</h1>
	<div class="flex gap-4">
		<div class="flex w-sm flex-col gap-2 border-r border-gray-300 p-4">
			{#each categories as { text, Icon }}
				<Button variant="outline" onclick={() => goto(`account?t=${text}`)}>
					<Icon></Icon>
					<p>{text}</p>
				</Button>
			{/each}
		</div>
		<div class="flex w-xl flex-col gap-4 p-4">
			{#if category === 'general'}
				<Label>
					Username:
					<Input value={user!.name} disabled={true} />
				</Label>
				<form {...uploadAvatar} enctype="multipart/form-data" class="flex flex-col gap-4">
					<Label>
						Avatar:
						<div class="group flex items-center justify-center">
							<img src={user?.avatarurl} alt={user!.name} class="cursor-pointer rounded" />
							<div
								class="absolute cursor-pointer rounded-xl bg-black/50 p-4 text-white opacity-0 transition-opacity group-hover:opacity-100"
							>
								<SquarePen />
							</div>
						</div>
						<input class="hidden" {...file.as('file')} />
					</Label>
					<input {...id.as('hidden', user!.id)} />
					<Button type="submit">Upload</Button>
				</form>
			{:else if category === 'sessions'}
				<Button onclick={() => (modalOpen = true)}>Delete all</Button>
				{#each allSessions as session, i (session.id)}
					{let expired = $derived(
						Temporal.Instant.compare(session.expires, Temporal.Now.instant()) < 1
					)}
					{let isCurrent = $derived(session.id === sessiondata.current!)}
					<div class="flex items-center justify-between">
						<Button variant="ghost" {@attach tooltipper(expired ? 'Expired' : 'Not expired')}>
							{#if expired}
								<ClockFading />
							{:else}
								<Clock />
							{/if}
						</Button>
						<p>
							{i + 1}.
							<span class:text-gray-500={expired}
								>{session.expires} {isCurrent ? '(CURRENT)' : ''}</span
							>
						</p>
						<Button
							variant="outline"
							onclick={async () => {
								await deleteSession(session.id);
								if (isCurrent) {
									await logout();
								}
							}}
						>
							<Trash />
						</Button>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</Card>

<Modal
	bind:modalState={modalOpen}
	title="Are you sure you want to delete all sessions?"
	description="Deleting all sessions will log you out here"
>
	<div class="flex gap-4">
		<Button
			onclick={async () => {
				await deleteAllSessions(user!.id);
				await logout();
			}}
		>
			Yes, log me out
		</Button>
		<Button variant="secondary" onclick={() => (modalOpen = false)}>Cancel</Button>
	</div>
</Modal>
