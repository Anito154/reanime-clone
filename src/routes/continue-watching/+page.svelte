<script lang="ts">
	import { continueWatching, getAnimeById } from '$lib/data/store.svelte';

	interface ContinueWatchingItem {
		anime: NonNullable<ReturnType<typeof getAnimeById>>;
		episode: string;
		progress: number;
	}

	let hiddenItems = $state<string[]>([]);

	let items = $derived<ContinueWatchingItem[]>(
		continueWatching
			.map((cw) => {
				const anime = getAnimeById(cw.animeId);
				const epNum = anime ? Math.min(Math.ceil(cw.progress / 100 * anime.totalEpisodes) || 1, anime.totalEpisodes) : 1;
				return {
					anime,
					episode: `Episode ${epNum}`,
					progress: cw.progress
				};
			})
			.filter((item): item is ContinueWatchingItem => item.anime !== undefined)
			.filter((item) => !hiddenItems.includes(item.anime.id))
	);

	function removeItem(id: string) {
		hiddenItems = [...hiddenItems, id];
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
				<h1 class="animate-fade-in mb-2 text-4xl font-extrabold tracking-tight text-white md:text-5xl">Continue Watching</h1>
				<p class="animate-fade-in text-sm font-medium text-text-muted" style="animation-delay: 80ms">Pick up where you left off</p>
			</div>
		</div>
	</div>

	<div class="max-w-7xl mx-auto px-4 py-8 md:py-12">
		<div class="animate-fade-in" style="animation-delay: 200ms">
			{#if items.length === 0}
				<div class="flex flex-col items-center justify-center py-20 text-center">
					<div class="w-20 h-20 rounded-2xl bg-card flex items-center justify-center mb-5">
						<svg class="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-white mb-1">Nothing to continue</h3>
					<p class="text-sm text-text-muted mb-6 max-w-sm">You haven't started watching any anime yet.</p>
					<a href="/anime" class="inline-flex h-10 items-center gap-2 rounded-md bg-accent-primary px-5 py-2 text-sm font-medium text-black shadow transition-all hover:brightness-110">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
						Browse Anime
					</a>
				</div>
			{:else}
				<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
					{#each items as { anime: item, episode, progress }}
						<div class="group relative">
							<a href="/anime/{item.id}" class="block">
								<div class="relative aspect-[5/7] overflow-hidden rounded-xl bg-zinc-900">
									<img src={item.image} alt={item.title} class="h-full w-full object-cover transition-all duration-500 group-hover:scale-110" loading="lazy" />
									<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
									<div class="absolute top-2 left-2">
										<span class="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-accent-primary backdrop-blur-sm">{progress}%</span>
									</div>
									<div class="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
										<div class="h-full bg-accent-primary transition-all" style="width: {progress}%"></div>
									</div>
									<div class="absolute inset-0 z-10 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
										<div class="flex size-12 items-center justify-center rounded-full bg-accent-primary shadow-[0_0_20px_rgba(0,0,0,0.5)]">
											<svg class="ml-0.5 size-5 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
										</div>
									</div>
								</div>
								<div class="mt-2 px-0.5">
									<h3 class="truncate text-xs font-semibold text-white group-hover:text-accent-primary transition-colors">{item.title}</h3>
									<p class="mt-0.5 text-[10px] text-zinc-500">{episode}</p>
								</div>
							</a>
							<div class="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
								<button
									onclick={() => removeItem(item.id)}
									class="flex size-7 items-center justify-center rounded-full bg-black/70 text-zinc-400 hover:bg-red-500/80 hover:text-white backdrop-blur-sm transition-all"
									title="Remove from continue watching"
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