<script lang="ts">
	import { Button, Card, Input, Message } from '#lib/components.ts';
	import { tooltip } from '#lib/util/tooltip.ts';
	import { createMessage, getForum, getMessages } from './remote';
	import type { PageProps } from './$types';

	let { params, data }: PageProps = $props();
	let forum = $derived(await getForum(params.id));
	let allMessages = $derived(await getMessages(params.id));
	let participants = $derived([...new Map(allMessages.map((m) => [m.user!.id, m.user])).values()]);
</script>

<Card>
	{#if forum}
		<h1 class="text-xl font-semibold">{forum.text}</h1>
		<p>ID: <span class="text-gray-600">{params.id}</span></p>
		<p>Created at {forum.created_at} by {forum.user.name}</p>
		<div class="flex items-center mt-4">
			<span class="mr-1">Participants: {participants.length}</span> 
			{#each participants as participant}
				{#if participant}
					{#if participant.avatarurl}
						<img
							src={participant.avatarurl}
							alt="{participant.name} profile"
							class="-mx-1 size-8 rounded-full border-4 border-white first:-mr-1"
							{@attach tooltip(participant.name)}
						/>
					{:else}
						<div
							class="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-700"
						>
							{participant.name.charAt(0).toLocaleUpperCase()}
						</div>
					{/if}
				{/if}
			{/each}
		</div>
		<div class="flex max-h-120 flex-col gap-4 overflow-y-scroll p-4">
			{#each allMessages as message}
				<Message {message} />
			{:else}
				<p>No messages yet :(</p>
			{/each}
		</div>
		<form {...createMessage}>
			{let { text, forumid, userid } = createMessage.fields}
			<div class="flex gap-2">
				<Input class="flex-1" placeholder="Post to '{forum.text}'" {...text.as('text')} />
				<Button type="submit">Send</Button>
				<input {...forumid.as('hidden', params.id)} />
				<input {...userid.as('hidden', data.user!.id)} />
			</div>
		</form>
	{/if}
</Card>
