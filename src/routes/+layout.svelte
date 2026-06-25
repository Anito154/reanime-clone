<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import DockSidebar from '$lib/components/DockSidebar.svelte';
	import { onMount } from 'svelte';
	import { initStore } from '$lib/data/store.svelte';
	let { children } = $props();
	onMount(() => { initStore(); });
</script>

<div class="flex min-h-[100dvh] flex-col bg-black">
	<DockSidebar />
	<Header />
	<main class="flex-1 pb-[76px] pt-[72px] lg:pb-0 lg:pt-[88px]">
		{@render children()}
	</main>
</div>
