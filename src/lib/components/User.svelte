<script lang='ts'>
  import type { UserData } from "#lib/types.ts";
	import { tooltipper } from "#lib/util/tooltip.ts";
  
  type Props = {
    user: UserData
    size?: number
    tooltip?: boolean
    multi?: boolean
  };

  const sizes: string[] = [
    "size-0", "size-0.5", "size-1", "size-1.5",
    "size-2", "size-2.5", "size-3", "size-3.5",
    "size-4", "size-5", "size-6", "size-7",
    "size-8", "size-9", "size-10", "size-11",
    "size-12", "size-14", "size-16", "size-20",
    "size-24", "size-28", "size-32", "size-36",
    "size-40", "size-44", "size-48", "size-52",
    "size-56", "size-60", "size-64", "size-72",
    "size-80", "size-96"
  ];
  
  let { 
    user, 
    size = 8, 
    tooltip = false, 
    multi = false 
  }: Props = $props();
  
  const currentSize = $derived(sizes.find(s => s === `size-${size}`) ?? "");
  const multiclass = $derived(multi ? "first:-mr-2 border-4 border-white -mx-1" : "")
  const initial = $derived(user.name.charAt(0).toLocaleUpperCase() ?? "?");
</script>

{#if user.avatarurl}
	<img
		src={user.avatarurl}
		alt="{user.name} profile"
		class="rounded-full {multiclass} {multi ? "border-4 border-white -mx-1.5 inline" : ""} {currentSize}"
		{@attach tooltip && tooltipper(user.name)}
	/>
{:else}
	<div
		class="flex shrink-0 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-700 {multiclass} {multi ? "inline-flex" : ""} {sizes.find(s => s === `size-${size}`)}"
		{@attach tooltip && tooltipper(user.name)}
	>
		{initial}
	</div>
{/if}