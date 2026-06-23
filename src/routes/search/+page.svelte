<script lang="ts">
	import { animeList } from '$lib/data/mock';

	let query = $state('');
	let results = $state([]) as any[];
	let isSearching = $state(false);
	let hasSearched = $state(false);
	let selectedSeason = $state('');
	let selectedFormat = $state('');
	let selectedStatus = $state('');
	let selectedYear = $state('');
	let selectedOrigin = $state('');

	function doSearch(q: string) {
		isSearching = true;
		hasSearched = true;
		setTimeout(() => {
			let filtered = [...animeList];
			const lower = q.trim().toLowerCase();
			if (lower) {
				filtered = filtered.filter(a =>
					a.title.toLowerCase().includes(lower) ||
					(a.titleJapanese && a.titleJapanese.toLowerCase().includes(lower))
				);
			}
			filtered.sort((a, b) => (b.episodes.length + b.rating) - (a.episodes.length + a.rating));
			results = filtered;
			isSearching = false;
		}, 200);
	}

	const years = Array.from({ length: 10 }, (_, i) => String(2024 - i));
	const seasons = ['Winter', 'Spring', 'Summer', 'Fall'];
	const formats = ['TV', 'TV_SHORT', 'MOVIE', 'ONA', 'OVA', 'Special'];
	const statuses = [
		{ value: 'releasing', label: 'Releasing' },
		{ value: 'finished', label: 'Finished' },
		{ value: 'not-yet-released', label: 'Not Yet Released' }
	];
	const origins = ['Japan', 'South Korea', 'China', 'Taiwan'];
</script>

<div class="min-h-screen bg-black text-white">
	<div class="min-h-screen xl:ml-1.5">
		<!-- Mobile Search Header -->
		<div class="mt-3 border-b border-white/5 px-4 pt-1 pb-4 lg:hidden">
			<div class="mb-4 flex flex-col gap-4">
				<div class="relative col-span-2 w-full">
					<div class="mb-1.5 pl-1 text-[13px] font-bold tracking-wide text-white">Search Anime</div>
					<form class="relative w-full">
						<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
							<svg class="h-[14px] w-[14px] text-text-muted" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 20 20">
								<path stroke-linecap="round" stroke-linejoin="round" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
							</svg>
						</div>
						<input
							bind:value={query}
							oninput={() => doSearch(query)}
							class="block w-full rounded-lg border border-white/5 bg-[#141414] px-4 py-2.5 ps-9 text-sm font-medium text-gray-300 placeholder-gray-500 transition-colors focus:border-accent-primary/50 focus:outline-none"
							placeholder="Type to search..."
							autocomplete="off"
							type="search"
						/>
					</form>
				</div>
			</div>
		</div>

		<!-- Desktop Layout -->
		<div class="flex h-full w-full flex-col lg:flex-row">
			<!-- Sidebar Filters - Desktop -->
			<div class="hidden lg:flex lg:w-[250px] xl:w-[280px] flex-shrink-0 flex-col gap-5 border-r border-white/5 px-4 py-6 overflow-y-auto" style="height: calc(100vh - 64px);">
				<div>
					<h3 class="mb-3 text-lg font-semibold">Search</h3>
					<form class="relative">
						<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
							<svg class="h-4 w-4 text-text-muted" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 20 20">
								<path stroke-linecap="round" stroke-linejoin="round" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
							</svg>
						</div>
						<input
							bind:value={query}
							oninput={() => doSearch(query)}
							class="w-full rounded-[10px] bg-zinc-900 py-2.5 ps-10 pe-3 text-sm font-medium text-gray-300 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-primary/30"
							placeholder="Type to search..."
							autocomplete="off"
							type="search"
						/>
					</form>
				</div>

				<div>
					<div class="mb-1 text-lg font-semibold">Year</div>
					<select
						bind:value={selectedYear}
						onchange={() => doSearch(query)}
						class="w-full rounded-[10px] bg-zinc-900 py-2.5 px-3 text-sm font-medium text-gray-300 transition-all duration-200 focus:outline-none hover:bg-zinc-800">
						<option value="">Any</option>
						{#each years as y}
							<option value={y}>{y}</option>
						{/each}
					</select>
				</div>

				<div>
					<div class="mb-1 text-lg font-semibold">Tags</div>
					<button class="flex w-full items-center justify-between rounded-[10px] bg-zinc-900 py-2.5 pr-3 pl-3 text-sm font-medium text-gray-300 transition-all duration-200 focus:outline-none hover:bg-zinc-800 cursor-not-allowed opacity-60">
						<span class="mr-0.5 line-clamp-1">Any</span>
						<svg class="w-4 h-4 text-white/50" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
					</button>
				</div>

				<div>
					<div class="mb-1 text-lg font-semibold">Character</div>
					<button class="flex w-full items-center justify-between rounded-[10px] bg-zinc-900 py-2.5 pr-3 pl-3 text-sm font-medium text-gray-300 transition-all duration-200 focus:outline-none hover:bg-zinc-800 cursor-not-allowed opacity-60">
						<span class="mr-0.5 line-clamp-1">Any</span>
						<svg class="w-4 h-4 text-white/50" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
					</button>
				</div>

				<div>
					<div class="mb-1 text-lg font-semibold">Staff</div>
					<button class="flex w-full items-center justify-between rounded-[10px] bg-zinc-900 py-2.5 pr-3 pl-3 text-sm font-medium text-gray-300 transition-all duration-200 focus:outline-none hover:bg-zinc-800 cursor-not-allowed opacity-60">
						<span class="mr-0.5 line-clamp-1">Any</span>
						<svg class="w-4 h-4 text-white/50" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
					</button>
				</div>

				<div>
					<div class="mb-1 text-lg font-semibold">Studio</div>
					<button class="flex w-full items-center justify-between rounded-[10px] bg-zinc-900 py-2.5 pr-3 pl-3 text-sm font-medium text-gray-300 transition-all duration-200 focus:outline-none hover:bg-zinc-800 cursor-not-allowed opacity-60">
						<span class="mr-0.5 line-clamp-1">Any</span>
						<svg class="w-4 h-4 text-white/50" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
					</button>
				</div>
			</div>

			<!-- Results Area -->
			<div class="flex-1 px-4 py-6 lg:px-8">
				<div class="mb-4 text-sm text-text-muted">
					{#if hasSearched}
						<span class="tabular-nums">{results.length}</span> results found
					{/if}
				</div>

				{#if isSearching}
					<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
						{#each Array(10) as _}
							<div>
								<div class="skeleton aspect-[5/7] rounded-xl mb-2"></div>
								<div class="skeleton h-4 w-3/4 rounded mb-1"></div>
								<div class="skeleton h-3 w-1/2 rounded"></div>
							</div>
						{/each}
					</div>
				{:else if hasSearched && results.length === 0}
					<div class="flex flex-col items-center justify-center py-20">
						<div class="flex flex-col items-center text-center">
							<div class="relative mb-8 h-20 w-20">
								<div class="absolute inset-0 rounded-xl bg-zinc-900"></div>
								<div class="absolute inset-0 flex items-center justify-center">
									<svg class="h-8 w-8 text-accent-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
										<circle cx="11" cy="11" r="8"/>
										<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.34-4.34"/>
									</svg>
								</div>
							</div>
							<h3 class="mb-2 text-xl font-semibold text-white/90">No Results Found</h3>
							<p class="mb-6 max-w-[280px] text-sm text-text-muted">We couldn't find any anime that match your current filters.</p>
							<button
								onclick={() => { query = ''; hasSearched = false; results = []; }}
								class="flex items-center rounded-xl bg-zinc-900 px-4 py-2 text-sm text-gray-300 transition-all duration-200 hover:bg-zinc-800 hover:text-white">
								<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l-7-7 7-7"/></svg>
								Reset Filters
							</button>
						</div>
					</div>
				{:else if hasSearched && results.length > 0}
					<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
						{#each results as item, i}
							<a href="/anime/{item.id}" class="group block rounded-xl overflow-hidden bg-card card-hover animate-fade-in" style="animation-delay: {i * 0.03}s">
								<div class="relative aspect-[5/7] overflow-hidden">
									<img src={item.image} alt={item.title} class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" loading="lazy" />
									<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
									<div class="absolute top-2 left-2">
										<span class="px-2 py-0.5 rounded text-[10px] font-medium bg-black/60 backdrop-blur-sm text-white/90">{item.type}</span>
									</div>
									<div class="absolute bottom-2 left-2 right-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
										<span class="flex items-center gap-1 text-yellow-400 text-xs font-bold">
											<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
											{item.rating}
										</span>
									</div>
								</div>
								<div class="p-2.5">
									<h3 class="text-xs font-medium text-text-primary truncate group-hover:text-accent-primary transition-colors">{item.title}</h3>
									<div class="flex items-center gap-1.5 mt-1">
										<span class="text-[10px] text-text-muted">{item.year}</span>
										<span class="w-1 h-1 rounded-full bg-text-muted/30"></span>
										<span class="text-[10px] text-text-muted">{item.episodes.length} ep</span>
									</div>
								</div>
							</a>
						{/each}
					</div>
				{:else}
					<div class="flex flex-col items-center justify-center py-20">
						<div class="flex flex-col items-center text-center">
							<div class="relative mb-8 h-20 w-20">
								<div class="absolute inset-0 rounded-xl bg-zinc-900"></div>
								<div class="absolute inset-0 flex items-center justify-center">
									<svg class="h-8 w-8 text-accent-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
										<circle cx="11" cy="11" r="8"/>
										<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.34-4.34"/>
									</svg>
								</div>
							</div>
							<h3 class="mb-2 text-xl font-semibold text-white/90">Search Anime</h3>
							<p class="mb-6 max-w-[280px] text-sm text-text-muted">Type a title, pick a genre, or use filters to discover something new.</p>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
