<script lang="ts">
	import type { UserData } from '#lib/types.ts';
	import { EllipsisVertical } from '@lucide/svelte';
	import Button from './Button.svelte'

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

<article class="flex gap-3 rounded-lg border border-gray-300 p-4">
	{#if !!user}
		{#if user.avatarurl}
			<img src={user.avatarurl} alt="{user.name} profile" class="size-10 rounded-full" />
		{:else}
			<div
				class="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-700"
			>
				{user.name.charAt(0).toLocaleUpperCase()}
			</div>
		{/if}

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

			<p class="wrap-break-words mt-2 text-sm whitespace-pre-wrap">
				{message.text}
			</p>
		</div>
	{/if}
</article>
