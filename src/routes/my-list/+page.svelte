<script lang="ts">
	import { animeList, getAnimeById } from '$lib/data/mock';
	import { myList, type ListStatus, type MyListItem } from '$lib/myList.svelte';
	import type { Anime } from '$lib/data/mock';

	const statusTabs: { value: ListStatus | 'all'; label: string }[] = [
		{ value: 'all', label: 'All' },
		{ value: 'watching', label: 'Watching' },
		{ value: 'completed', label: 'Completed' },
		{ value: 'plan_to_watch', label: 'Plan to Watch' },
		{ value: 'dropped', label: 'Dropped' },
		{ value: 'on_hold', label: 'On Hold' }
	];

	let activeTab = $state<ListStatus | 'all'>('all');

	let listItems = $derived(
		activeTab === 'all'
			? myList.items
			: myList.items.filter((i) => i.status === activeTab)
	);

	type DisplayEntry = { item: MyListItem; anime: Anime };

	let displayEntries = $derived(
		listItems
			.map((item) => {
				const anime = getAnimeById(item.animeId);
				return anime ? { item, anime } as DisplayEntry : null;
			})
			.filter((e): e is DisplayEntry => e !== null)
			.sort((a, b) => b.item.updatedAt - a.item.updatedAt)
	);

	function handleRemove(animeId: string) {
		myList.remove(animeId);
	}

	function handleStatusChange(animeId: string, status: ListStatus) {
		myList.add(animeId, status);
	}

	function getCount(status: ListStatus | 'all'): number {
		if (status === 'all') return myList.items.length;
		return myList.items.filter((i) => i.status === status).length;
	}
</script>

<div class="min-h-screen bg-bg">
	<div class="relative -mt-16 h-56 sm:h-64 overflow-hidden pt-16">
		<div class="absolute inset-0 -bottom-32 overflow-hidden">
			<div class="absolute inset-0 bg-gradient-to-b from-accent-primary/[0.08] via-transparent to-transparent"></div>
			<div class="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent"></div>
		</div>
		<div class="absolute inset-x-0 bottom-0 flex items-end justify-center px-4 pb-8">
			<div class="text-center">
				<h1 class="animate-fade-in mb-2 text-4xl font-extrabold tracking-tight text-white md:text-5xl">My List</h1>
				<p class="animate-fade-in text-sm font-medium text-text-muted" style="animation-delay: 80ms">Track and organize your anime</p>
			</div>
		</div>
	</div>

	<div class="max-w-7xl mx-auto px-4 py-8 md:py-12">
		<div class="animate-fade-in flex items-center gap-2 overflow-x-auto scroll-hidden pb-4 mb-8" style="animation-delay: 160ms">
			{#each statusTabs as tab}
				<button
					class="relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap {activeTab === tab.value ? 'bg-accent-primary text-white' : 'bg-card text-text-muted hover:bg-white/10 hover:text-white'}"
					onclick={() => activeTab = tab.value}
				>
					{tab.label}
					<span class="ml-1.5 text-xs opacity-60">({getCount(tab.value)})</span>
				</button>
			{/each}
		</div>

		<div class="animate-fade-in" style="animation-delay: 200ms">
			{#if displayEntries.length === 0}
				<div class="flex flex-col items-center justify-center py-20 text-center">
					<div class="w-20 h-20 rounded-2xl bg-card flex items-center justify-center mb-5">
						<svg class="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-white mb-1">No anime here yet</h3>
					<p class="text-sm text-text-muted mb-6 max-w-sm">
						{activeTab === 'all' ? 'Start building your list by adding anime from the catalog.' : `You don't have any anime marked as "${statusTabs.find(t => t.value === activeTab)?.label}".`}
					</p>
					<a href="/anime" class="inline-flex h-10 items-center gap-2 rounded-md bg-accent-primary px-5 py-2 text-sm font-medium text-black shadow transition-all hover:brightness-110">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
						Browse Anime
					</a>
				</div>
			{:else}
				<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
					{#each displayEntries as { item, anime }}
						<div class="group relative">
							<a href="/anime/{anime.id}" class="block">
								<div class="relative aspect-[5/7] overflow-hidden rounded-xl bg-zinc-900">
									<img src={anime.image} alt={anime.title} class="h-full w-full object-cover transition-all duration-500 group-hover:scale-110" loading="lazy" />
									<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
									<div class="absolute top-2 left-2">
										<span class="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">{anime.type.replace('_', ' ')}</span>
									</div>
									<div class="absolute top-2 right-2">
										<span class="flex items-center gap-0.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-yellow-400 backdrop-blur-sm">
											<svg class="size-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
											{anime.rating || '?'}
										</span>
									</div>
									<div class="absolute bottom-0 left-0 right-0 p-2">
										<span class="inline-flex items-center gap-1 rounded bg-accent-primary/20 px-2 py-0.5 text-[10px] font-semibold text-accent-primary backdrop-blur-sm">
											<svg class="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6L9 17l-5-5"/></svg>
											{statusTabs.find(t => t.value === item.status)?.label}
										</span>
									</div>
								</div>
								<div class="mt-2 px-0.5">
									<h3 class="truncate text-xs font-semibold text-white group-hover:text-accent-primary transition-colors">{anime.title}</h3>
									<p class="mt-0.5 text-[10px] text-zinc-500">{anime.year} &middot; {anime.episodes.length} ep</p>
								</div>
							</a>
							<div class="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
								<button
									onclick={() => handleRemove(anime.id)}
									class="flex size-7 items-center justify-center rounded-full bg-black/70 text-zinc-400 hover:bg-red-500/80 hover:text-white backdrop-blur-sm transition-all"
									title="Remove from list"
								>
									<svg class="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
