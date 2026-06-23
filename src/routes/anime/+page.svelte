<script lang="ts">
	import { animeList } from '$lib/data/mock';

	let viewMode = $state<'grid' | 'list'>('grid');
	let sortBy = $state('popularity');
	let selectedGenres = $state<string[]>([]);

	const allGenres = $derived([...new Set(animeList.flatMap(a => a.genres))].sort());
	const sortedAnime = $derived(() => {
		let list = [...animeList];
		if (selectedGenres.length > 0) {
			list = list.filter(a => selectedGenres.some(g => a.genres.includes(g)));
		}
		switch (sortBy) {
			case 'popularity': return list.sort((a, b) => (b.episodes.length + b.rating * 10) - (a.episodes.length + a.rating * 10));
			case 'rating': return list.sort((a, b) => b.rating - a.rating);
			case 'year': return list.sort((a, b) => b.year - a.year);
			case 'title': return list.sort((a, b) => a.title.localeCompare(b.title));
			default: return list;
		}
	});

	function toggleGenre(genre: string) {
		if (selectedGenres.includes(genre)) {
			selectedGenres = selectedGenres.filter(g => g !== genre);
		} else {
			selectedGenres = [...selectedGenres, genre];
		}
	}
</script>

<div class="min-h-screen bg-[#050505] text-white">
	<div class="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
		<!-- Header -->
		<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h1 class="text-2xl font-light text-white lg:text-3xl">Anime <span class="font-medium text-primary">Catalog</span></h1>
				<p class="mt-1 text-sm text-zinc-500">{animeList.length} titles available</p>
			</div>
			<div class="flex items-center gap-3">
				<div class="flex rounded-lg border border-white/10 bg-[#0a0a0a] p-0.5">
					<button
						class="rounded-md px-3 py-1.5 text-xs font-medium transition-all {viewMode === 'grid' ? 'bg-primary text-black' : 'text-zinc-400 hover:text-white'}"
						onclick={() => viewMode = 'grid'}
					>
						<svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
					</button>
					<button
						class="rounded-md px-3 py-1.5 text-xs font-medium transition-all {viewMode === 'list' ? 'bg-primary text-black' : 'text-zinc-400 hover:text-white'}"
						onclick={() => viewMode = 'list'}
					>
						<svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
					</button>
				</div>
				<select
					bind:value={sortBy}
					class="rounded-lg border border-white/10 bg-[#0a0a0a] px-3 py-2 text-xs font-medium text-zinc-400 focus:outline-none"
				>
					<option value="popularity">Popularity</option>
					<option value="rating">Rating</option>
					<option value="year">Year</option>
					<option value="title">Title A-Z</option>
				</select>
			</div>
		</div>

		<div class="flex gap-8">
			<!-- Genre Sidebar -->
			<aside class="hidden w-[200px] shrink-0 lg:block">
				<div class="sticky top-20">
					<h3 class="mb-3 text-xs font-black tracking-[0.2em] text-primary uppercase">Genres</h3>
					<div class="flex flex-col gap-1">
						<button
							class="rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-all {selectedGenres.length === 0 ? 'bg-primary/10 text-primary' : 'text-zinc-500 hover:text-white hover:bg-white/5'}"
							onclick={() => selectedGenres = []}
						>All</button>
						{#each allGenres as genre}
							<button
								class="rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-all {selectedGenres.includes(genre) ? 'bg-primary/10 text-primary' : 'text-zinc-500 hover:text-white hover:bg-white/5'}"
								onclick={() => toggleGenre(genre)}
							>{genre}</button>
						{/each}
					</div>
				</div>
			</aside>

			<!-- Grid View -->
			{#if viewMode === 'grid'}
				<div class="flex-1">
					<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
						{#each sortedAnime() as item}
							<a href="/anime/{item.id}" class="group block">
								<div class="relative aspect-[5/7] overflow-hidden rounded-xl bg-zinc-900">
									<img src={item.image} alt={item.title} class="h-full w-full object-cover transition-all duration-500 group-hover:scale-110" loading="lazy" />
									<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
									<div class="absolute top-2 left-2">
										<span class="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">{item.type.replace('_', ' ')}</span>
									</div>
									<div class="absolute top-2 right-2">
										<span class="flex items-center gap-0.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-yellow-400 backdrop-blur-sm">
											<svg class="size-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
											{item.rating || '?'}
										</span>
									</div>
									<div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
										<div class="flex size-12 items-center justify-center rounded-full bg-primary shadow-[0_0_20px_rgba(0,0,0,0.5)]">
											<svg class="ml-0.5 size-5 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
										</div>
									</div>
								</div>
								<div class="mt-2 px-0.5">
									<h3 class="truncate text-xs font-semibold text-white group-hover:text-primary transition-colors">{item.title}</h3>
									<p class="mt-0.5 text-[10px] text-zinc-500">{item.year} &middot; {item.episodes.length} ep</p>
								</div>
							</a>
						{/each}
					</div>
				</div>
			{:else}
				<!-- List View -->
				<div class="flex-1 space-y-1">
					{#each sortedAnime() as item}
						<a href="/anime/{item.id}" class="group flex items-center gap-4 rounded-xl px-3 py-2.5 transition-all hover:bg-white/[0.03]">
							<div class="w-10 shrink-0 text-center text-xs font-bold text-zinc-600">{sortedAnime().indexOf(item) + 1}</div>
							<div class="size-10 shrink-0 overflow-hidden rounded-lg">
								<img src={item.image} alt={item.title} class="h-full w-full object-cover" loading="lazy" />
							</div>
							<div class="min-w-0 flex-1">
								<h3 class="truncate text-sm font-medium text-white group-hover:text-primary transition-colors">{item.title}</h3>
								<p class="truncate text-xs text-zinc-500">{item.genres.slice(0, 3).join(', ')}</p>
							</div>
							<div class="hidden shrink-0 text-xs text-zinc-500 sm:block">{item.type.replace('_', ' ')}</div>
							<div class="hidden shrink-0 text-xs text-zinc-500 md:block">{item.year}</div>
							<div class="hidden shrink-0 text-xs text-zinc-500 lg:block">{item.episodes.length} ep</div>
							<div class="flex shrink-0 items-center gap-1 text-xs font-bold text-yellow-400">
								<svg class="size-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
								{item.rating || '?'}
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
