<script lang="ts">
	import { animeList, type Anime } from '$lib/data/store.svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let { onclose }: { onclose: () => void } = $props();

	let query = $state('');
	let selectedIndex = $state(0);
	let inputEl: HTMLInputElement | undefined = $state();

	let results = $derived.by(() => {
		if (!query.trim()) return animeList.slice(0, 8);
		const lower = query.trim().toLowerCase();
		return animeList
			.filter(a =>
				a.title.toLowerCase().includes(lower) ||
				(a.titleJapanese && a.titleJapanese.toLowerCase().includes(lower))
			)
			.sort((a, b) => b.rating - a.rating)
			.slice(0, 10);
	});

	$effect(() => {
		if (browser && inputEl) {
			inputEl.focus();
		}
	});

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S' || e.code === 'KeyS')) {
			e.preventDefault();
			return;
		}
		if (e.key === 'Escape') {
			onclose();
			return;
		}
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
			return;
		}
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = Math.max(selectedIndex - 1, 0);
			return;
		}
		if (e.key === 'Enter') {
			e.preventDefault();
			if (results[selectedIndex]) {
				goto(`/anime/${results[selectedIndex].id}`);
				onclose();
			}
			return;
		}
	}

	function goToAnime(anime: Anime) {
		goto(`/anime/${anime.id}`);
		onclose();
	}

	function handleBackdropKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) onclose();
	}

	function handleInput() {
		selectedIndex = 0;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	role="presentation"
	ontouchmove={(e) => e.preventDefault()}
	onkeydown={handleBackdropKeydown}
	class="fixed inset-0 z-[99999] flex items-start justify-center bg-black/60 backdrop-blur-sm pt-[80px] sm:pt-[88px]"
	onclick={handleBackdropClick}
>
	<div
		class="w-full max-w-lg mx-4 bg-[#0a0a0a] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden search-popup-content"
		role="dialog"
		aria-modal="true"
		aria-label="Search anime"
	>
		<div class="relative flex items-center border-b border-white/[0.08]">
			<svg
				class="absolute left-4 size-5 text-gray-400"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				viewBox="0 0 24 24"
			><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
			<input
				bind:value={query}
				oninput={handleInput}
				bind:this={inputEl}
				class="w-full bg-transparent py-4 pl-12 pr-12 text-base text-white placeholder-gray-500 outline-none"
				placeholder="Search anime..."
				autocomplete="off"
				spellcheck="false"
				type="text"
			/>
			<button
				onclick={onclose}
				class="absolute right-3 rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
				aria-label="Close search"
			>
				<svg class="size-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
			</button>
		</div>

		<div class="max-h-[60vh] overflow-y-auto">
			{#if query.trim() === ''}
				<div class="px-4 pt-3 pb-2">
					<p class="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Popular</p>
				</div>
			{/if}

			{#each results as anime, i}
				<button
					onclick={() => goToAnime(anime)}
					onmouseenter={() => { selectedIndex = i; }}
					class="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/5 {i === selectedIndex ? 'bg-white/5' : ''}"
				>
					<img src={anime.image} alt={anime.title} class="size-10 rounded-lg object-cover flex-shrink-0" loading="lazy" />
					<div class="min-w-0 flex-1">
						<p class="truncate text-sm font-medium text-white">{anime.title}</p>
						<p class="truncate text-xs text-gray-400">{anime.year} &middot; {anime.type}</p>
					</div>
					<span class="flex items-center gap-1 text-xs font-medium text-yellow-400 flex-shrink-0">
						<svg class="size-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
						{anime.rating}
					</span>
				</button>
			{:else}
				<div class="flex flex-col items-center py-10 text-gray-500">
					<svg class="size-8 mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.34-4.34"/></svg>
					<p class="text-sm">No results found</p>
				</div>
			{/each}

			<div class="border-t border-white/[0.08] px-4 py-2.5">
				<div class="flex items-center gap-4 text-[11px] text-gray-500">
					<span class="flex items-center gap-1"><kbd class="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px]">↑↓</kbd> Navigate</span>
					<span class="flex items-center gap-1"><kbd class="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px]">⏎</kbd> Select</span>
					<span class="flex items-center gap-1"><kbd class="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px]">Esc</kbd> Close</span>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.search-popup-content {
		animation: popup-enter 0.15s ease-out;
	}
	@keyframes popup-enter {
		from {
			opacity: 0;
			transform: scale(0.96) translateY(-4px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}
</style>
