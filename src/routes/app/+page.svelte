<script lang="ts">
	import { Card, Button, Input } from '#lib/components.ts';
	import { getAllForums, createForum } from './remote';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let user = $derived(data.user);
	let { text, userid } = createForum.fields;
</script>

<Card>
	<div class="flex gap-4">
		<Button variant="secondary">Top</Button>
		<Button variant="ghost">Recent</Button>
	</div>
	<h2 class="mt-2 text-xl font-semibold">Rooms</h2>
	<div class="flex max-h-120 flex-col gap-2 overflow-y-scroll p-4">
		{#each await getAllForums() as room (room.id)}
			<a href="app/{room.id}" class="block rounded border border-gray-300">
				<p class="p-2">{room.text}</p>
			</a>
		{:else}
			No rooms :(
		{/each}
	</div>
	<form class="flex gap-4" {...createForum}>
		<Input class="flex-1" maxlength={40} {...text.as('text')}></Input>
		<input {...userid.as('hidden', user!.name)} />
		<Button type="submit">Create room</Button>
	</form>
</Card>
