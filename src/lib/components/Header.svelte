<script lang="ts">
	import SearchPopup from './SearchPopup.svelte';

	let searchOpen = $state(false);

		function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S' || e.code === 'KeyS')) {
			e.preventDefault();
			searchOpen = true;
		}
		if (e.key === 'Escape' && searchOpen) {
			searchOpen = false;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if searchOpen}
	<SearchPopup onclose={() => { searchOpen = false; }} />
{/if}

<header
	class="fixed top-0 right-0 left-0 z-[10000] border-b"
	style="border-color: rgba(255, 255, 255, 0)"
>
	<div class="absolute inset-0 z-[-1] bg-black/80 backdrop-blur-2xl" style="opacity: 0;"></div>
	<div
		class="pointer-events-none absolute inset-y-0 left-0 z-[-2] w-64 bg-gradient-to-r from-black/80 to-transparent md:w-[400px]"
		style="-webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%); mask-image: linear-gradient(to bottom, black 50%, transparent 100%);"
	></div>
	<div
		class="pointer-events-none absolute inset-y-0 right-0 z-[-2] w-48 bg-gradient-to-l from-black/80 to-transparent md:w-64"
		style="-webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%); mask-image: linear-gradient(to bottom, black 50%, transparent 100%);"
	></div>
	<div class="relative z-10 flex w-full items-center justify-between py-3 pr-4 pl-6">
		<div class="flex items-center gap-4 sm:gap-6">
			<a href="/home" class="group -mr-2 -ml-2 flex items-center sm:-mr-4 sm:-ml-3">
				<img
					src="/logo.png"
					alt="Re:ANIME"
					class="h-12 w-auto transition-transform duration-300 group-hover:scale-102 sm:h-16"
				/>
			</a>
			<button
				onclick={() => { searchOpen = true; }}
				class="hidden min-w-[320px] items-center gap-3 rounded-xl border border-white/20 bg-black/40 px-4 py-2.5 text-left text-gray-300 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-black/60 hover:text-white sm:flex"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class="size-5 text-gray-400 transition-colors group-hover:text-primary"
				><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>
				<span class="text-base font-medium">Search anime...</span>
				<div class="ml-auto flex items-center gap-1 text-xs text-gray-500">
					<kbd class="rounded border border-white/20 bg-white/10 px-2 py-1 text-xs font-medium"
						>⌘</kbd
					>
					<kbd class="rounded border border-white/20 bg-white/10 px-2 py-1 text-xs font-medium"
						>S</kbd
					>
				</div>
			</button>
		</div>
		<div class="flex items-center gap-1">
			<button
				onclick={() => { searchOpen = true; }}
				class="rounded-xl p-2.5 text-gray-400 transition-all duration-300 hover:bg-white/10 hover:text-white sm:hidden"
				aria-label="Search"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class="size-6"
				><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>
			</button>
			<button
				class="rounded-md bg-gradient-to-r from-primary to-primary/80 px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105"
			>
				Sign In
			</button>
		</div>
	</div>
</header>
