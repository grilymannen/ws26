<script lang="ts">
	import { Card, Button, Input, User } from '#lib/components.ts';
	import { getAllForums, createForum, changeMethod } from './remote';
	import type { PageProps } from './$types';
	import type { SortMethod } from '#lib/types.ts';
	
	let { data }: PageProps = $props();
	let user = $derived(data.user);
	
	let { text, userid } = createForum.fields;
	let sortMethod: SortMethod = $state("top")

	const sortButtons: {text: SortMethod, dsc?: string}[] = [
	  {text: "top"},
		{text: "recent"},
		{text: "old"}
	]
</script>

<Card>
	<div class="flex gap-4">
  	{#each sortButtons as btn}
  		<Button variant={btn.text === sortMethod ? "secondary" : "ghost"} onclick={() => {sortMethod = btn.text; changeMethod(btn.text)}} >{btn.text}</Button>
  	{/each}
	</div>
	<h2 class="mt-2 text-xl font-semibold">Rooms</h2>
	<div class="flex max-h-120 flex-col gap-2 overflow-y-scroll p-4">
		{#each await getAllForums() as room (room.id)}
		{let {count, participants} = (room.messages)}
		{let unique = $derived([...new Map(participants.map((p) => [p.user!.id, p.user])).values()])}
			<a href="app/{room.id}" class="block rounded border border-gray-300">
				<div class="p-2">
  				{room.text} - {count} message(s) - 
  				Participant(s): {unique.length} 
  				{#each unique as user}
  				  <User {user} size={8} tooltip={true} multi={true}/>
  				{/each}
				</div>
			</a>
		{:else}
			No rooms :(
		{/each}
	</div>
	<form class="flex gap-4" {...createForum}>
		<Input class="flex-1" maxlength={40} {...text.as('text')}></Input>
		<input {...userid.as('hidden', user!.id)} />
		<Button type="submit">Create room</Button>
	</form>
</Card>
