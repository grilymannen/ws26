<script lang="ts">
	import type { UserData } from '#lib/types.ts';
	import { EllipsisVertical } from '@lucide/svelte';
	import Button from './Button.svelte'
	import User from './User.svelte';

	type Message = {
		created_at: Temporal.Instant;
		id: string;
		text: string;
		userid: string;
		forumid: string;
		user: UserData | null;
	};

	type Props = {
		message: Message;
	};

	let { message }: Props = $props();
	const user = $derived(message.user);
</script>

<article class="flex gap-3 rounded-lg border border-gray-300 p-4" id={message.id}>
	{#if !!user}
		<User {user} size={10} tooltip={false}/>

		<div class="min-w-0 flex-1">
			<div class="flex flex-wrap items-center gap-2">
				<span class="font-semibold">
					{user.name}
				</span>

				<p class="text-sm text-gray-500">
					{message.created_at}
				</p>
				<Button variant="outline" class="justify-self-end">
				  <EllipsisVertical size={16}/>
				</Button>
			</div>

			<p class="wrap-break-words break-all mt-2 text-sm whitespace-pre-wrap">
			{let isImage = /\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(message.text)}
			{let isURL = /^https?:\/\/.+/i.test(message.text);}
			{#if isImage}
			  <img src={message.text} alt={message.text}>
			{:else if isURL}
			  <a href={message.text} target="_blank" class="text-blue-500 underline">{message.text}</a>
			{:else}
			  {message.text}
			{/if}
			</p>
		</div>
	{/if}
</article>
