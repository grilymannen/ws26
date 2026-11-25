<script lang="ts">
	import './layout.css';

	import type { LayoutProps } from './$types';
	import { tooltipper } from '#lib/util/tooltip.ts';

	import { Page, Button } from '#lib/components.ts';
	import { House, Lock, LogOut, MessageCircle, User } from '@lucide/svelte';
	import { logout } from '#lib/logout.ts';

	let { children, data, params }: LayoutProps = $props();
	let user = $derived(data.user);
</script>

<nav class="flex gap-2 p-2">
	<a href="/" {@attach tooltipper('Home')}>
		<Button variant="secondary">
			<House />
		</Button>
	</a>
	<a href="/app" {@attach tooltipper('App')}>
		<Button variant="secondary">
			<MessageCircle />
		</Button>
	</a>
	<a href="/auth" {@attach tooltipper('Auth')}>
		<Button variant="secondary">
			<Lock />
		</Button>
	</a>
	<a href="/account">
		<Button variant="secondary" {@attach tooltipper('Account')}>
			<User />
			{#if user}
				Logged in as: <span class="font-semibold">{user.name}</span><img
					class="size-6 rounded-full"
					src={user?.avatarurl}
					alt={user.name}
				/>
			{:else}
				Not logged in
			{/if}
		</Button>
	</a>
	<Button variant="secondary" {@attach tooltipper('Log out')} onclick={logout}>
		<LogOut />
	</Button>
</nav>
<Page>
	{@render children()}
</Page>
<style>
  /*View transitions (?)*/
</style>