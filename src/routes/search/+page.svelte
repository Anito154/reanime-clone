<script lang="ts">
	import { animeList } from '$lib/data/store.svelte';
	import { searchAnime } from '$lib/data/store.svelte';

	let query = $state('');
	let results = $state([]) as any[];
	let isSearching = $state(false);
	let hasSearched = $state(false);
	let selectedGenre = $state('');
	let selectedStatus = $state('');
	let selectedSeason = $state('');
	let selectedFormat = $state('');
	let selectedYear = $state('');
	let selectedStudio = $state('');
	let selectedCharacter = $state('');
	let selectedOrigin = $state('');
	let selectedTags = $state('');
	let selectedSort = $state('popularity');

	let mobileFiltersExpanded = $state(false);

	let genreOpen = $state(false);
	let mobileStatusOpen = $state(false);
	let mobileFormatOpen = $state(false);
	let tagsOpen = $state(false);
	let yearOpen = $state(false);
	let studioOpen = $state(false);
	let characterOpen = $state(false);

	const years = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i));
	const statuses = [
		{ value: 'ongoing', label: 'Ongoing' },
		{ value: 'completed', label: 'Completed' },
		{ value: 'upcoming', label: 'Upcoming' },
	];
	const formats = ['TV', 'TV_SHORT', 'MOVIE', 'ONA', 'OVA', 'Special'];
	const seasons = ['Winter', 'Spring', 'Summer', 'Fall'];
	const origins = ['JP', 'CN', 'KR'];
	const sortOptions = [
		{ value: 'popularity', label: 'Popularity' },
		{ value: 'rating', label: 'Rating' },
		{ value: 'year', label: 'Year' },
		{ value: 'title', label: 'Title A-Z' },
	];
	const dropdownBase = 'flex w-full items-center justify-between rounded-lg border border-white/5 bg-[#141414] px-3 py-2.5 text-sm font-medium text-gray-300 transition-colors focus:outline-none hover:bg-[#1a1a1a]';

	function toggleMobileFilters() {
		mobileFiltersExpanded = !mobileFiltersExpanded;
	}

	async function doSearch(_q: string = '') {
		isSearching = true;
		hasSearched = true;
		const q = _q || query;
		try {
			if (q.trim()) {
				const apiResults = await searchAnime(q);
				results = apiResults;
			} else {
				results = animeList;
			}
			if (selectedGenre) {
				results = results.filter((a: any) => a.genres.includes(selectedGenre));
			}
			if (selectedStatus) {
				results = results.filter((a: any) => a.status === selectedStatus);
			}
			if (selectedFormat) {
				results = results.filter((a: any) => a.type === selectedFormat);
			}
			if (selectedYear) {
				results = results.filter((a: any) => String(a.year) === selectedYear);
			}
			if (selectedStudio) {
				results = results.filter((a: any) => a.studio === selectedStudio);
			}
			if (selectedSeason) {
				results = results.filter((a: any) => a.season?.toLowerCase() === selectedSeason.toLowerCase());
			}
			if (selectedOrigin) {
				results = results.filter((a: any) => a.origin === selectedOrigin);
			}
			switch (selectedSort) {
				case 'rating': results.sort((a: any, b: any) => b.rating - a.rating); break;
				case 'year': results.sort((a: any, b: any) => (b.year || 0) - (a.year || 0)); break;
				case 'title': results.sort((a: any, b: any) => a.title.localeCompare(b.title)); break;
				default: results.sort((a: any, b: any) => ((b.totalEpisodes || b.episodes.length || 0) + b.rating * 10) - ((a.totalEpisodes || a.episodes.length || 0) + a.rating * 10)); break;
			}
		} catch {
			results = [];
		}
		isSearching = false;
	}

	function resetFilters() {
		query = '';
		selectedGenre = '';
		selectedStatus = '';
		selectedSeason = '';
		selectedFormat = '';
		selectedYear = '';
		selectedStudio = '';
		selectedCharacter = '';
		selectedOrigin = '';
		selectedTags = '';
		selectedSort = 'popularity';
		hasSearched = false;
		results = [];
	}

	const allGenres = [...new Set(animeList.flatMap(a => a.genres))].sort();
</script>

<main class="min-h-screen bg-black pt-16 text-white">
	<div class="min-h-screen xl:ml-1.5">
		<!-- Mobile Filters -->
		<div class="mt-3 border-b border-gray-800/50 px-4 pt-1 pb-4 lg:hidden">
			<div class="mb-4 flex flex-col gap-4">
				<div class="grid grid-cols-2 gap-x-3 gap-y-4">
					<div class="relative col-span-2 w-full">
						<div class="mb-1.5 pl-1 text-[13px] font-bold tracking-wide text-white">Search Anime</div>
						<form class="relative w-full" onsubmit={(e) => { e.preventDefault(); doSearch(); }}>
							<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
								<svg class="h-[14px] w-[14px] text-gray-500" aria-hidden="true" fill="none" viewBox="0 0 20 20">
									<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
								</svg>
							</div>
							<input
								bind:value={query}
								oninput={() => doSearch(query)}
								class="search-input block w-full rounded-lg border border-white/5 bg-[#141414] px-4 py-2.5 ps-9 text-sm font-medium text-gray-300 placeholder-gray-500 transition-colors focus:border-primary/50 focus:outline-none"
								placeholder="Type to search..."
								autocomplete="off"
								type="search"
							/>
						</form>
					</div>

					<div class="relative w-full">
						<div class="mb-1.5 pl-1 text-[13px] font-bold tracking-wide text-white">Genres</div>
						<button
							onclick={() => genreOpen = !genreOpen}
							class="dropdown-button flex w-full items-center justify-between rounded-lg border border-white/5 bg-[#141414] px-3 py-2.5 text-sm font-medium text-gray-300 transition-colors focus:outline-none hover:bg-[#1a1a1a]"
							type="button"
						>
							<span class="line-clamp-1">{selectedGenre || 'Select Genres'}</span>
							<svg xmlns="http://www.w3.org/2000/svg" class="transition-transform duration-300 {genreOpen ? 'rotate-180' : ''}" width="1em" height="1em" viewBox="0 0 1024 1024">
								<path fill="currentColor" d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496"/>
							</svg>
						</button>
						{#if genreOpen}
							<div class="absolute z-50 mt-1 w-full rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-2 shadow-2xl backdrop-blur-3xl max-h-48 overflow-y-auto">
								<button onclick={() => { selectedGenre = ''; genreOpen = false; doSearch(); }} type="button" class="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-400 hover:bg-white/5 hover:text-white">Any</button>
								{#each allGenres as g}
									<button onclick={() => { selectedGenre = g; genreOpen = false; doSearch(); }} type="button" class="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-400 hover:bg-white/5 hover:text-white">{g}</button>
								{/each}
							</div>
						{/if}
					</div>

					<div class="relative w-full">
						<div class="mb-1.5 pl-1 text-[13px] font-bold tracking-wide text-white">Tags</div>
						<button
							onclick={() => tagsOpen = !tagsOpen}
							class="dropdown-button flex w-full items-center justify-between rounded-lg border border-white/5 bg-[#141414] px-3 py-2.5 text-sm font-medium text-gray-300 transition-colors focus:outline-none hover:bg-[#1a1a1a]"
							type="button"
						>
							<span class="line-clamp-1">{selectedTags || 'Select Tags'}</span>
							<svg xmlns="http://www.w3.org/2000/svg" class="transition-transform duration-300 {tagsOpen ? 'rotate-180' : ''}" width="1em" height="1em" viewBox="0 0 1024 1024">
								<path fill="currentColor" d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496"/>
							</svg>
						</button>
						{#if tagsOpen}
							<div class="absolute z-50 mt-1 w-full rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-2 shadow-2xl backdrop-blur-3xl">
								<div class="px-3 py-4 text-center text-sm text-gray-500">No tags available</div>
							</div>
						{/if}
					</div>

					<div class="relative w-full">
						<div class="mb-1.5 pl-1 text-[13px] font-bold tracking-wide text-white">Year</div>
						<button
							onclick={() => yearOpen = !yearOpen}
							class="dropdown-button flex w-full items-center justify-between rounded-lg border border-white/5 bg-[#141414] px-3 py-2.5 text-sm font-medium text-gray-300 transition-colors focus:outline-none hover:bg-[#1a1a1a]"
							type="button"
						>
							<span class="line-clamp-1">{selectedYear || 'Any year'}</span>
							<svg xmlns="http://www.w3.org/2000/svg" class="transition-transform duration-300 {yearOpen ? 'rotate-180' : ''}" width="1em" height="1em" viewBox="0 0 1024 1024">
								<path fill="currentColor" d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496"/>
							</svg>
						</button>
						{#if yearOpen}
							<div class="absolute z-50 mt-1 w-full rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-2 shadow-2xl backdrop-blur-3xl max-h-48 overflow-y-auto">
								<button onclick={() => { selectedYear = ''; yearOpen = false; doSearch(); }} type="button" class="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-400 hover:bg-white/5 hover:text-white">Any year</button>
								{#each years as y}
									<button onclick={() => { selectedYear = y; yearOpen = false; doSearch(); }} type="button" class="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-400 hover:bg-white/5 hover:text-white">{y}</button>
								{/each}
							</div>
						{/if}
					</div>

					<div class="relative w-full">
						<div class="mb-1.5 pl-1 text-[13px] font-bold tracking-wide text-white">Status</div>
						<button
							onclick={() => mobileStatusOpen = !mobileStatusOpen}
							class="dropdown-button flex w-full items-center justify-between rounded-lg border border-white/5 bg-[#141414] px-3 py-2.5 text-sm font-medium text-gray-300 transition-colors focus:outline-none hover:bg-[#1a1a1a]"
							type="button"
						>
							<span class="line-clamp-1">{selectedStatus ? statuses.find(s => s.value === selectedStatus)?.label || selectedStatus : 'Any Status'}</span>
							<svg xmlns="http://www.w3.org/2000/svg" class="transition-transform duration-300 {mobileStatusOpen ? 'rotate-180' : ''}" width="1em" height="1em" viewBox="0 0 1024 1024">
								<path fill="currentColor" d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496"/>
							</svg>
						</button>
						{#if mobileStatusOpen}
							<div class="absolute z-50 mt-1 w-full rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-2 shadow-2xl backdrop-blur-3xl">
								<button onclick={() => { selectedStatus = ''; mobileStatusOpen = false; doSearch(); }} type="button" class="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-400 hover:bg-white/5 hover:text-white">Any Status</button>
								{#each statuses as s}
									<button onclick={() => { selectedStatus = s.value; mobileStatusOpen = false; doSearch(); }} type="button" class="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-400 hover:bg-white/5 hover:text-white">{s.label}</button>
								{/each}
							</div>
						{/if}
					</div>

					<div class="relative w-full">
						<div class="mb-1.5 pl-1 text-[13px] font-bold tracking-wide text-white">Format</div>
						<button
							onclick={() => mobileFormatOpen = !mobileFormatOpen}
							class="dropdown-button flex w-full items-center justify-between rounded-lg border border-white/5 bg-[#141414] px-3 py-2.5 text-sm font-medium text-gray-300 transition-colors focus:outline-none hover:bg-[#1a1a1a]"
							type="button"
						>
							<span class="line-clamp-1">{selectedFormat || 'Any Format'}</span>
							<svg xmlns="http://www.w3.org/2000/svg" class="transition-transform duration-300 {mobileFormatOpen ? 'rotate-180' : ''}" width="1em" height="1em" viewBox="0 0 1024 1024">
								<path fill="currentColor" d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496"/>
							</svg>
						</button>
						{#if mobileFormatOpen}
							<div class="absolute z-50 mt-1 w-full rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-2 shadow-2xl backdrop-blur-3xl">
								<button onclick={() => { selectedFormat = ''; mobileFormatOpen = false; doSearch(); }} type="button" class="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-400 hover:bg-white/5 hover:text-white">Any Format</button>
								{#each formats as f}
									<button onclick={() => { selectedFormat = f; mobileFormatOpen = false; doSearch(); }} type="button" class="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-400 hover:bg-white/5 hover:text-white">{f}</button>
								{/each}
							</div>
						{/if}
					</div>

					<div class="flex h-full w-full flex-col justify-end col-span-2">
						<div class="grid grid-cols-3 px-1 pb-1.5 text-center text-[11px] font-medium tracking-wide text-gray-400">
							<span>Apply</span>
							<span>Reset</span>
							<span>Expand</span>
						</div>
						<div class="flex h-[42px] w-full items-center divide-x divide-white/5 overflow-hidden rounded-lg border border-white/5 bg-[#111]">
							<button onclick={() => doSearch()} class="flex h-full flex-1 items-center justify-center text-white/70 transition-colors hover:bg-white/5 hover:text-white active:scale-95" aria-label="Apply">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon lucide lucide-funnel size-4"><path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"/></svg>
							</button>
							<button onclick={resetFilters} class="flex h-full flex-1 items-center justify-center text-white/70 transition-colors hover:bg-white/5 hover:text-white active:scale-95" aria-label="Reset">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon lucide lucide-rotate-ccw size-4"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
							</button>
							<button onclick={toggleMobileFilters} class="flex h-full flex-1 items-center justify-center text-white/70 transition-colors hover:bg-white/5 hover:text-white active:scale-95" aria-label="Expand">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon lucide lucide-chevron-down size-4 transition-transform duration-300 {mobileFiltersExpanded ? 'rotate-180' : ''}"><path d="m6 9 6 6 6-6"/></svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="flex h-full w-full flex-col">
			<!-- Desktop Top Filter Bar -->
			<div class="hidden flex-row gap-6 border-b border-gray-800/50 p-4 lg:flex">
				<div>
					<h3 class="mb-1 text-lg font-semibold">Search</h3>
					<form class="relative rounded-xl" onsubmit={(e) => { e.preventDefault(); doSearch(); }}>
						<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
							<svg class="h-4 w-4 text-gray-400" aria-hidden="true" fill="none" viewBox="0 0 20 20">
								<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
							</svg>
						</div>
						<input
							bind:value={query}
							oninput={() => doSearch(query)}
							class="search-input block w-[220px] rounded-xl bg-zinc-900 px-4 py-2.5 ps-10 text-sm font-medium text-white/90 placeholder-gray-400 transition-colors duration-200 outline-none"
							placeholder="Search"
							autocomplete="off"
							type="search"
						/>
					</form>
				</div>

				<div class="relative">
					<div class="mb-1 text-lg font-semibold">Genres</div>
					<button
						onclick={() => genreOpen = !genreOpen}
						class="{dropdownBase} w-[210px]"
						type="button"
					>
						<span class="mr-0.5 line-clamp-1">{selectedGenre || 'Any'}</span>
						<svg xmlns="http://www.w3.org/2000/svg" class="transition-transform duration-300 {genreOpen ? 'rotate-180' : ''}" width="1em" height="1em" viewBox="0 0 1024 1024">
							<path fill="currentColor" d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496"/>
						</svg>
					</button>
					{#if genreOpen}
						<div class="absolute z-50 mt-1 w-full rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-2 shadow-2xl backdrop-blur-3xl max-h-48 overflow-y-auto">
							<button onclick={() => { selectedGenre = ''; genreOpen = false; doSearch(); }} type="button" class="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-400 hover:bg-white/5 hover:text-white">Any</button>
							{#each allGenres as g}
								<button onclick={() => { selectedGenre = g; genreOpen = false; doSearch(); }} type="button" class="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-400 hover:bg-white/5 hover:text-white">{g}</button>
							{/each}
						</div>
					{/if}
				</div>

				<div class="relative">
					<div class="mb-1 text-lg font-semibold">Year</div>
					<button
						onclick={() => yearOpen = !yearOpen}
						class="{dropdownBase} w-[210px]"
						type="button"
					>
						<span class="mr-0.5 line-clamp-1">{selectedYear || 'Any'}</span>
						<svg xmlns="http://www.w3.org/2000/svg" class="transition-transform duration-300 {yearOpen ? 'rotate-180' : ''}" width="1em" height="1em" viewBox="0 0 1024 1024">
							<path fill="currentColor" d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496"/>
						</svg>
					</button>
					{#if yearOpen}
						<div class="absolute z-50 mt-1 w-full rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-2 shadow-2xl backdrop-blur-3xl max-h-48 overflow-y-auto">
							<button onclick={() => { selectedYear = ''; yearOpen = false; doSearch(); }} type="button" class="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-400 hover:bg-white/5 hover:text-white">Any</button>
							{#each years as y}
								<button onclick={() => { selectedYear = y; yearOpen = false; doSearch(); }} type="button" class="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-400 hover:bg-white/5 hover:text-white">{y}</button>
							{/each}
						</div>
					{/if}
				</div>

				<div class="relative">
					<div class="mb-1 text-lg font-semibold">Studio</div>
					<button
						onclick={() => studioOpen = !studioOpen}
						class="{dropdownBase} w-[210px]"
						type="button"
					>
						<span class="mr-0.5 line-clamp-1">{selectedStudio || 'Any'}</span>
						<svg xmlns="http://www.w3.org/2000/svg" class="transition-transform duration-300 {studioOpen ? 'rotate-180' : ''}" width="1em" height="1em" viewBox="0 0 1024 1024">
							<path fill="currentColor" d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496"/>
						</svg>
					</button>
					{#if studioOpen}
						<div class="absolute z-50 mt-1 w-full rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-2 shadow-2xl backdrop-blur-3xl max-h-48 overflow-y-auto">
							<button onclick={() => { selectedStudio = ''; studioOpen = false; doSearch(); }} type="button" class="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-400 hover:bg-white/5 hover:text-white">Any</button>
							{#each [...new Set(animeList.map(a => a.studio).filter(Boolean))] as s}
								<button onclick={() => { selectedStudio = s; studioOpen = false; doSearch(); }} type="button" class="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-400 hover:bg-white/5 hover:text-white">{s}</button>
							{/each}
						</div>
					{/if}
				</div>

				<div class="relative">
					<div class="mb-1 text-lg font-semibold">Character</div>
					<button
						onclick={() => characterOpen = !characterOpen}
						class="{dropdownBase} w-[210px]"
						type="button"
					>
						<span class="mr-0.5 line-clamp-1">{selectedCharacter || 'Any'}</span>
						<svg xmlns="http://www.w3.org/2000/svg" class="transition-transform duration-300 {characterOpen ? 'rotate-180' : ''}" width="1em" height="1em" viewBox="0 0 1024 1024">
							<path fill="currentColor" d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496"/>
						</svg>
					</button>
					{#if characterOpen}
						<div class="absolute z-50 mt-1 w-full rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-2 shadow-2xl backdrop-blur-3xl">
							<div class="px-3 py-4 text-center text-sm text-gray-500">No characters available</div>
						</div>
					{/if}
				</div>

				<div class="relative">
					<div class="mb-1 text-lg font-semibold">Tags</div>
					<button
						onclick={() => tagsOpen = !tagsOpen}
						class="{dropdownBase} w-[210px]"
						type="button"
					>
						<span class="mr-0.5 line-clamp-1">{selectedTags || 'Any'}</span>
						<svg xmlns="http://www.w3.org/2000/svg" class="transition-transform duration-300 {tagsOpen ? 'rotate-180' : ''}" width="1em" height="1em" viewBox="0 0 1024 1024">
							<path fill="currentColor" d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496"/>
						</svg>
					</button>
					{#if tagsOpen}
						<div class="absolute z-50 mt-1 w-full rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-2 shadow-2xl backdrop-blur-3xl">
							<div class="px-3 py-4 text-center text-sm text-gray-500">No tags available</div>
						</div>
					{/if}
				</div>
			</div>

			<div class="mt-6 flex h-full w-full flex-row gap-6 px-4">
				<!-- Desktop Sidebar -->
				<div class="hidden min-w-[220px] flex-col gap-4 lg:flex">
					<div class="sidebar-section rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-white backdrop-blur-sm transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.06] sidebar-expanded">
						<button
							onclick={() => { const el = document.getElementById('season-section'); if (el) el.classList.toggle('hidden'); }}
							class="flex w-full items-center justify-between text-lg font-semibold transition-colors duration-200 focus:outline-none"
							aria-expanded="true"
						>
							Season
							<svg class="transition-transform duration-300 -rotate-90" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 19l-7-7 7-7"/></svg>
						</button>
						<div id="season-section" class="mt-3">
							<ul class="mb-1 space-y-2 pt-0.5">
								{#each seasons as s}
									<li>
										<label class="group flex cursor-pointer items-center space-x-3">
											<input
												type="radio"
												name="radio-season"
												checked={selectedSeason === s}
												onchange={() => { selectedSeason = s; doSearch(); }}
												class="custom-radio h-4 w-4 cursor-pointer border-zinc-700 bg-zinc-800 text-primary"
											/>
											<span class="text-sm font-medium text-gray-300 transition-colors duration-150 group-hover:text-white">{s}</span>
										</label>
									</li>
								{/each}
								<li>
									<label class="group flex cursor-pointer items-center space-x-3">
										<input
											type="radio"
											name="radio-season"
											checked={selectedSeason === ''}
											onchange={() => { selectedSeason = ''; doSearch(); }}
											class="custom-radio h-4 w-4 cursor-pointer border-zinc-700 bg-zinc-800 text-primary"
										/>
										<span class="text-sm font-medium text-gray-300 transition-colors duration-150 group-hover:text-white">Any</span>
									</label>
								</li>
							</ul>
						</div>
					</div>

					<div class="sidebar-section rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-white backdrop-blur-sm transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.06] sidebar-expanded">
						<button
							onclick={() => { const el = document.getElementById('format-section'); if (el) el.classList.toggle('hidden'); }}
							class="flex w-full items-center justify-between text-lg font-semibold transition-colors duration-200 focus:outline-none"
							aria-expanded="true"
						>
							Format
							<svg class="transition-transform duration-300 -rotate-90" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 19l-7-7 7-7"/></svg>
						</button>
						<div id="format-section" class="mt-3">
							<ul class="mb-1 space-y-2 pt-0.5">
								{#each formats as f}
									<li>
										<label class="group flex cursor-pointer items-center space-x-3">
											<input
												type="radio"
												name="radio-format"
												checked={selectedFormat === f}
												onchange={() => { selectedFormat = f; doSearch(); }}
												class="custom-radio h-4 w-4 cursor-pointer border-zinc-700 bg-zinc-800 text-primary"
											/>
											<span class="text-sm font-medium text-gray-300 transition-colors duration-150 group-hover:text-white">{f}</span>
										</label>
									</li>
								{/each}
								<li>
									<label class="group flex cursor-pointer items-center space-x-3">
										<input
											type="radio"
											name="radio-format"
											checked={selectedFormat === ''}
											onchange={() => { selectedFormat = ''; doSearch(); }}
											class="custom-radio h-4 w-4 cursor-pointer border-zinc-700 bg-zinc-800 text-primary"
										/>
										<span class="text-sm font-medium text-gray-300 transition-colors duration-150 group-hover:text-white">Any</span>
									</label>
								</li>
							</ul>
						</div>
					</div>

					<div class="sidebar-section rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-white backdrop-blur-sm transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.06] sidebar-expanded">
						<button
							onclick={() => { const el = document.getElementById('status-section'); if (el) el.classList.toggle('hidden'); }}
							class="flex w-full items-center justify-between text-lg font-semibold transition-colors duration-200 focus:outline-none"
							aria-expanded="true"
						>
							Status
							<svg class="transition-transform duration-300 -rotate-90" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 19l-7-7 7-7"/></svg>
						</button>
						<div id="status-section" class="mt-3">
							<ul class="mb-1 space-y-2 pt-0.5">
								{#each statuses as s}
									<li>
										<label class="group flex cursor-pointer items-center space-x-3">
											<input
												type="radio"
												name="radio-status"
												checked={selectedStatus === s.value}
												onchange={() => { selectedStatus = s.value; doSearch(); }}
												class="custom-radio h-4 w-4 cursor-pointer border-zinc-700 bg-zinc-800 text-primary"
											/>
											<span class="text-sm font-medium text-gray-300 transition-colors duration-150 group-hover:text-white">{s.label}</span>
										</label>
									</li>
								{/each}
								<li>
									<label class="group flex cursor-pointer items-center space-x-3">
										<input
											type="radio"
											name="radio-status"
											checked={selectedStatus === ''}
											onchange={() => { selectedStatus = ''; doSearch(); }}
											class="custom-radio h-4 w-4 cursor-pointer border-zinc-700 bg-zinc-800 text-primary"
										/>
										<span class="text-sm font-medium text-gray-300 transition-colors duration-150 group-hover:text-white">Any</span>
									</label>
								</li>
							</ul>
						</div>
					</div>

					<div class="sidebar-section rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-white backdrop-blur-sm transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.06] sidebar-expanded">
						<button
							onclick={() => { const el = document.getElementById('origin-section'); if (el) el.classList.toggle('hidden'); }}
							class="flex w-full items-center justify-between text-lg font-semibold transition-colors duration-200 focus:outline-none"
							aria-expanded="true"
						>
							Origin
							<svg class="transition-transform duration-300 -rotate-90" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 19l-7-7 7-7"/></svg>
						</button>
						<div id="origin-section" class="mt-3">
							<ul class="mb-1 space-y-2 pt-0.5">
								{#each origins as o}
									<li>
										<label class="group flex cursor-pointer items-center space-x-3">
											<input
												type="radio"
												name="radio-origin"
												checked={selectedOrigin === o}
												onchange={() => { selectedOrigin = o; doSearch(); }}
												class="custom-radio h-4 w-4 cursor-pointer border-zinc-700 bg-zinc-800 text-primary"
											/>
											<span class="text-sm font-medium text-gray-300 transition-colors duration-150 group-hover:text-white">{o}</span>
										</label>
									</li>
								{/each}
								<li>
									<label class="group flex cursor-pointer items-center space-x-3">
										<input
											type="radio"
											name="radio-origin"
											checked={selectedOrigin === ''}
											onchange={() => { selectedOrigin = ''; doSearch(); }}
											class="custom-radio h-4 w-4 cursor-pointer border-zinc-700 bg-zinc-800 text-primary"
										/>
										<span class="text-sm font-medium text-gray-300 transition-colors duration-150 group-hover:text-white">Any</span>
									</label>
								</li>
							</ul>
						</div>
					</div>

					<div class="sidebar-section rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-white backdrop-blur-sm transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.06] sidebar-expanded">
						<button
							onclick={() => { const el = document.getElementById('sort-section'); if (el) el.classList.toggle('hidden'); }}
							class="flex w-full items-center justify-between text-lg font-semibold transition-colors duration-200 focus:outline-none"
							aria-expanded="true"
						>
							Sort by
							<svg class="transition-transform duration-300 -rotate-90" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 19l-7-7 7-7"/></svg>
						</button>
						<div id="sort-section" class="mt-3">
							<ul class="mb-1 space-y-2 pt-0.5">
								{#each sortOptions as opt}
									<li>
										<label class="group flex cursor-pointer items-center space-x-3">
											<input
												type="radio"
												name="radio-sort"
												checked={selectedSort === opt.value}
												onchange={() => { selectedSort = opt.value; doSearch(); }}
												class="custom-radio h-4 w-4 cursor-pointer border-zinc-700 bg-zinc-800 text-primary"
											/>
											<span class="text-sm font-medium text-gray-300 transition-colors duration-150 group-hover:text-white">{opt.label}</span>
										</label>
									</li>
								{/each}
							</ul>
						</div>
					</div>
				</div>

				<!-- Results Area -->
				<div class="mb-5 h-full w-full">
					<div class="flex h-full w-full flex-col">
						<div class="mb-4 text-sm text-gray-400">
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
											<svg class="h-8 w-8 text-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
												<circle cx="11" cy="11" r="8"/>
												<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.34-4.34"/>
											</svg>
										</div>
									</div>
									<h3 class="mb-2 text-xl font-semibold text-white/90">No Results Found</h3>
									<p class="mb-6 max-w-[280px] text-sm text-gray-400">We couldn't find any anime that matches your current filters.</p>
									<button
										onclick={resetFilters}
										class="flex items-center rounded-xl bg-zinc-900 px-4 py-2 text-sm text-gray-300 transition-all duration-200 hover:bg-zinc-800 hover:text-white"
									>
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
												<span class="text-[10px] text-text-muted">{item.totalEpisodes || item.episodes.length} ep</span>
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
											<svg class="h-8 w-8 text-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
												<circle cx="11" cy="11" r="8"/>
												<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.34-4.34"/>
											</svg>
										</div>
									</div>
									<h3 class="mb-2 text-xl font-semibold text-white/90">Search Anime</h3>
									<p class="mb-6 max-w-[280px] text-sm text-gray-400">Type a title, pick a genre, or use filters to discover something new.</p>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
