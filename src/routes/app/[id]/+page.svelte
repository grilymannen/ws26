<script lang="ts">
	import { Button, Card, Input, Message, User } from '#lib/components.ts';
	import { createMessage, getForum, getMessages } from './remote';
	import type { PageProps } from './$types';

	let { params, data }: PageProps = $props();
	let forum = $derived(await getForum(params.id));
	let allMessages = $derived(await getMessages(params.id));
	let participants = $derived([...new Map(allMessages.map((m) => [m.user!.id, m.user])).values()]);
</script>

<Card>
	{#if forum}
		<h1 class="overflow-x-hidden text-xl font-semibold wrap-break-word">{forum.text}</h1>
		<p>ID: <span class="text-gray-600">{params.id}</span></p>
		<p>Created at {forum.created_at} by {forum.user!.name}</p>
		<div class="mt-4 flex items-center">
			<span class="mr-1">Participants: {participants.length}</span>
			{#each participants as user}
				{#if user}
					<User {user} size={8} tooltip={true} multi={true} />
				{/if}
			{/each}
		</div>
		<div id="chat" class="flex max-h-120 flex-col gap-4 overflow-y-scroll p-4">
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
