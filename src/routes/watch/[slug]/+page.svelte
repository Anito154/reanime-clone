<script lang="ts">
	import { fetchAnimeDetail, fetchEpisodeDetail, animeList, getCurrentSource, sourceLabels } from '$lib/data/store.svelte';
	import type { Anime, Episode } from '$lib/data/store.svelte';
	import { page } from '$app/state';
	import { myList, type ListStatus } from '$lib/myList.svelte';
	import { onMount } from 'svelte';

	let slug = $derived(page.params.slug);
	let epParam = $derived(Number(page.url.searchParams.get('ep')) || 1);
	let anime = $state<Anime | null>(null);
	let currentEpisode = $state(1);
	let episodeSearch = $state('');
	let spoilerMode = $state(false);
	let gridView = $state(false);
	let listDropdownOpen = $state(false);
	let isLoaded = $state(false);
	let currentStatus = $derived(anime ? myList.getStatus(anime.id) : null);
	let currentServerUrl = $state<string>('');
	let playerError = $state(false);

	const listOptions: { value: ListStatus; label: string }[] = [
		{ value: 'watching', label: 'Watching' },
		{ value: 'completed', label: 'Completed' },
		{ value: 'plan_to_watch', label: 'Plan to Watch' },
		{ value: 'dropped', label: 'Dropped' },
		{ value: 'on_hold', label: 'On Hold' }
	];

	async function loadEpisodeDetail(episodeId: string) {
		const data = await fetchEpisodeDetail(episodeId);
		if (data) {
			playerError = false;
			if (data.streamUrl) {
				currentServerUrl = data.streamUrl;
			} else if (data.servers?.length > 0) {
				const sv = data.servers[0];
				if (sv.url.startsWith('http://') || sv.url.startsWith('https://')) {
					currentServerUrl = sv.url;
				}
			}
		} else {
			playerError = true;
		}
	}

	onMount(async () => {
		if (slug) {
			const detail = await fetchAnimeDetail(slug);
			if (detail) {
				anime = detail;
				currentEpisode = Math.min(epParam, detail.episodes.length) || 1;
				const ep = detail.episodes[currentEpisode - 1];
				if (ep?.id) {
					await loadEpisodeDetail(ep.id);
				}
			}
			isLoaded = true;
		}
	});

	$effect(() => {
		const ep = epParam;
		if (anime && ep) {
			currentEpisode = Math.min(ep, anime.episodes.length) || 1;
			const found = anime.episodes[currentEpisode - 1];
			if (found?.id) {
				loadEpisodeDetail(found.id);
			}
		}
	});

	let filteredEpisodes = $derived(
		anime ? anime.episodes.filter((ep: Episode) =>
			ep.title.toLowerCase().includes(episodeSearch.toLowerCase()) ||
			`Episode ${ep.number}`.toLowerCase().includes(episodeSearch.toLowerCase())
		) : []
	);

	let relatedAnime = $derived(
		anime ? animeList
			.filter(a => a.id !== anime!.id && a.genres.some(g => anime!.genres.includes(g)))
			.slice(0, 4)
		: []
	);

	function handleAddToList(status: ListStatus) {
		if (!anime) return;
		myList.add(anime.id, status);
		listDropdownOpen = false;
	}

	function handleRemoveFromList() {
		if (!anime) return;
		myList.remove(anime.id);
		listDropdownOpen = false;
	}

	$effect(() => {
		if (listDropdownOpen) {
			function closeOnEscape(e: KeyboardEvent) {
				if (e.key === 'Escape') listDropdownOpen = false;
			}
			function closeOnClickOutside() {
				listDropdownOpen = false;
			}
			window.addEventListener('keydown', closeOnEscape);
			const t = setTimeout(() => window.addEventListener('click', closeOnClickOutside), 0);
			return () => {
				clearTimeout(t);
				window.removeEventListener('keydown', closeOnEscape);
				window.removeEventListener('click', closeOnClickOutside);
			};
		}
	});
</script>

<div class="watch-page-enter mt-4 px-2 lg:px-4 xl:px-8">
	<div class="flex flex-col gap-4 lg:flex-row lg:items-stretch">
		<!-- Left Sidebar - Anime Info (Desktop) -->
		<div class="watch-sidebar-enter relative hidden min-h-0 shrink-0 lg:flex lg:w-[clamp(220px,20vw,320px)] lg:self-stretch">
			<div class="bg-card-background relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/5 shadow-xl lg:absolute lg:inset-0">
				{#if anime}
					<div class="absolute inset-x-0 top-0 z-0 h-[320px] scale-110 bg-cover bg-center bg-no-repeat opacity-40 blur-[16px]" style="background-image: url('{anime.image}')"></div>
					<div class="from-card-background/30 via-card-background/95 to-card-background absolute inset-0 z-0 bg-gradient-to-b"></div>
					<div class="relative z-10 flex h-full min-h-0 w-full flex-col gap-4 p-5">
						<div class="relative z-10 flex flex-col items-center gap-4">
							<div class="relative aspect-[2/3] w-full max-w-[200px] overflow-hidden rounded-lg border border-white/10 shadow-2xl">
								<img src={anime.image} alt={anime.title} class="h-full w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
							</div>
							<div class="w-full text-center">
								<h2 class="line-clamp-2 text-xl leading-tight font-bold text-white" title={anime.title}>{anime.title}</h2>
								{#if anime.titleJapanese}
									<h3 class="mt-1.5 line-clamp-2 text-xs font-medium text-zinc-400">{anime.titleJapanese}</h3>
								{/if}
							</div>
						</div>
						<div class="relative z-10 flex flex-wrap justify-center gap-2 border-b border-white/5 pb-4">
							<span class="relative flex -skew-x-12 items-center justify-center border border-white/10 bg-black/80 px-3 py-1 shadow-sm">
								<div class="absolute top-0 right-0 h-full w-1 bg-white/10"></div>
								<span class="relative z-10 flex skew-x-12 items-center gap-1.5 text-[11px] font-black tracking-wider text-primary uppercase">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-3.5"><rect width="18" height="14" x="3" y="5" rx="2" ry="2"></rect><path d="M7 15h4M15 15h2M7 11h2M13 11h4"></path></svg>
									<span>{anime.episodes.filter((e2: Episode) => e2.title).length}</span>
								</span>
							</span>
							<span class="relative flex -skew-x-12 items-center justify-center border border-white/10 bg-black/80 px-3 py-1 shadow-sm">
								<div class="absolute top-0 right-0 h-full w-1 bg-white/10"></div>
								<span class="relative z-10 flex skew-x-12 items-center gap-1.5 text-[11px] font-black tracking-wider text-primary uppercase">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-3.5"><path d="M12 19v3"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><rect x="9" y="2" width="6" height="13" rx="3"></rect></svg>
									<span>{Math.min(anime.totalEpisodes || anime.episodes.length, anime.episodes.length)}</span>
								</span>
							</span>
							<span class="relative flex -skew-x-12 items-center justify-center border border-white/10 bg-black/80 px-3 py-1 shadow-sm">
								<div class="absolute top-0 right-0 h-full w-1 bg-white/10"></div>
								<span class="relative z-10 flex skew-x-12 items-center justify-center text-[11px] font-black tracking-wider text-primary uppercase">
									{anime.status === 'completed' ? 'FINISHED' : anime.status === 'ongoing' ? 'RELEASING' : 'UPCOMING'}
								</span>
							</span>
						</div>
						<div class="relative z-10 no-scrollbar min-h-0 flex-1 overflow-y-auto text-[13px] leading-relaxed font-medium tracking-wide text-zinc-200/90">
							<div class="pb-2">{anime.description}</div>
						</div>
						<div class="relative z-10 mt-auto flex flex-col gap-2.5 border-t border-white/5 pt-4 text-[13px]">
							<div class="flex gap-2"><span class="w-[70px] shrink-0 font-medium text-zinc-500">Start Date:</span><span class="truncate text-zinc-200">{anime.episodes[0]?.aired || 'Unknown'}</span></div>
							<div class="flex gap-2"><span class="w-[70px] shrink-0 font-medium text-zinc-500">Country:</span><span class="truncate text-zinc-200">JP</span></div>
							<div class="flex gap-2"><span class="w-[70px] shrink-0 font-medium text-zinc-500">Genres:</span>
								<span class="line-clamp-2 text-zinc-200">{#each anime.genres as genre, i}<a href="/search?genre={genre}" class="transition-colors hover:text-primary">{genre}{i < anime.genres.length - 1 ? ', ' : ''}</a>{/each}</span>
							</div>
							<div class="flex gap-2"><span class="w-[70px] shrink-0 font-medium text-zinc-500">Premiered:</span><span class="text-zinc-200 capitalize">{anime.season}</span></div>
							<div class="flex gap-2"><span class="w-[70px] shrink-0 font-medium text-zinc-500">Duration:</span><span class="text-zinc-200">{anime.duration}</span></div>
							<div class="flex gap-2"><span class="w-[70px] shrink-0 font-medium text-zinc-500">Score:</span><span class="text-zinc-200">{anime.rating > 0 ? anime.rating : 'N/A'}</span></div>
							<div class="flex gap-2"><span class="w-[70px] shrink-0 font-medium text-zinc-500">Studios:</span><span class="truncate text-zinc-200">{anime.studio || 'Unknown'}</span></div>
						</div>
						<a href="/anime/{anime.id}" class="group relative z-10 mx-auto mt-3 flex h-10 w-[98%] items-center justify-center overflow-hidden border border-white/10 bg-white/5 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95" style="transform: skew(-10deg);">
							<div class="flex flex-row items-center justify-center gap-2" style="transform: skew(10deg);">
								<span class="relative z-10 text-[11px] font-bold tracking-widest text-zinc-300 uppercase transition-colors group-hover:text-white">View Details</span>
								<svg class="relative z-10 h-3.5 w-3.5 text-zinc-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
							</div>
							<div class="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-[150%]"></div>
						</a>
					</div>
				{/if}
			</div>
		</div>

		<!-- Center: Video Player + Controls + Mobile Info -->
		<div class="flex w-full min-w-0 flex-1 flex-col">
			{#if anime}
				<div class="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
					<div class="absolute inset-0 overflow-hidden rounded-lg bg-black">
						{#if currentServerUrl}
							<iframe
								src={currentServerUrl}
								class="h-full w-full"
								allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
								allowfullscreen
								sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
							></iframe>
						{:else if playerError}
							<div class="relative flex h-full w-full items-center justify-center overflow-hidden select-none" style="background: black url('{anime.banner}') center/cover no-repeat;">
								<div class="pointer-events-none absolute -inset-4 scale-110 blur-md brightness-[0.3]" style="background: url('{anime.banner}') center/cover no-repeat;"></div>
								<div class="pointer-events-none relative z-10 flex flex-col items-center gap-3 px-4 text-center select-none">
									<svg class="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"></path></svg>
									<p class="text-sm font-medium text-zinc-300">Failed to load episode</p>
									<p class="text-xs text-zinc-500">The server may be down or the episode ID is invalid</p>
								</div>
							</div>
						{:else}
							<div class="relative flex h-full w-full items-center justify-center overflow-hidden select-none" style="background: black url('{anime.banner}') center/cover no-repeat;">
								<div class="pointer-events-none absolute -inset-4 scale-110 blur-md brightness-[0.3]" style="background: url('{anime.banner}') center/cover no-repeat;"></div>
								<div class="pointer-events-none relative z-10 flex flex-col items-center gap-3 px-4 text-center select-none">
									<svg class="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
									<p class="text-sm font-medium text-zinc-300">No streaming servers available</p>
									<p class="text-xs text-zinc-500">This episode doesn't have any sources yet</p>
								</div>
							</div>
						{/if}
					</div>
				</div>
				<div class="mt-1.5 flex flex-col">
					<div class="mt-1 mb-2.5 flex items-center gap-2 rounded-md bg-primary/30 px-3 py-2 text-xs opacity-90 lg:text-sm">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"></path></svg>
						<p>If episode is not working, please report it, and we will fix it as soon as possible.</p>
					</div>
					<div class="flex w-full flex-row items-center justify-between">
						<div class="bg-card-background flex animate-pulse items-center gap-2 rounded-full px-3 py-1.5">
							<svg class="h-3 w-3 animate-spin text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25"></circle><path d="M4 12a8 8 0 018-8" stroke-linecap="round"></path></svg>
							<span class="text-xs sm:text-sm">Syncing...</span>
						</div>
						<div class="watch-controls-enter flex flex-row flex-wrap items-center justify-end gap-1 sm:gap-1.5 md:gap-2 xl:flex-nowrap xl:gap-1.5 2xl:gap-3">
							<div class="group relative hidden xl:block">
								<button type="button" class="bg-card-background flex items-center justify-center gap-1 rounded-md px-2 py-1 transition-colors sm:px-2.5 xl:px-2.5 2xl:px-3 hover:bg-card-background/80" aria-label="Theater Mode">
									<svg height="14" viewBox="0 -960 960 960" width="14" fill="currentColor" class="sm:h-4 sm:w-4"><path d="M560-280h200v-200h-80v120H560v80ZM200-480h80v-120h120v-80H200v200Zm-40 320q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z"></path></svg>
									<span class="hidden text-[11px] leading-none font-semibold tracking-tight uppercase 2xl:inline 2xl:text-[0.75rem]">Theater</span>
								</button>
								<div class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 transform rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:block">Enable Theater Mode<div class="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-4 border-r-4 border-l-4 border-transparent border-t-zinc-700"></div></div>
							</div>
							<div class="group relative">
								<button type="button" class="bg-card-background flex items-center justify-center gap-1 rounded-md px-2 py-1 transition-colors sm:px-2.5 xl:px-2.5 2xl:px-3 text-primary" aria-label="Auto Play">
									<svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3.5 w-3.5 sm:size-4"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 0 1 0 1.971l-11.54 6.347a1.125 1.125 0 0 1-1.667-.985V5.653z"></path></svg>
									<span class="hidden text-[11px] leading-none font-semibold tracking-tight uppercase 2xl:inline 2xl:text-[0.75rem]">Auto Play</span>
								</button>
								<div class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 transform rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:block">Disable Auto Play<div class="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-4 border-r-4 border-l-4 border-transparent border-t-zinc-700"></div></div>
							</div>
							<div class="group relative">
								<button type="button" class="bg-card-background flex items-center justify-center gap-1 rounded-md px-2 py-1 transition-colors sm:px-2.5 xl:px-2.5 2xl:px-3 text-primary" aria-label="Auto Next">
									<svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3.5 w-3.5 sm:size-4"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5v14l12-7L3 5zM21 5v14"></path></svg>
									<span class="hidden text-[11px] leading-none font-semibold tracking-tight uppercase 2xl:inline 2xl:text-[0.75rem]">Auto Next</span>
								</button>
								<div class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 transform rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:block">Disable Auto Next<div class="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-4 border-r-4 border-l-4 border-transparent border-t-zinc-700"></div></div>
							</div>
							<div class="group relative">
								<button type="button" class="bg-card-background flex items-center justify-center gap-1 rounded-md px-2 py-1 transition-colors sm:px-2.5 xl:px-2.5 2xl:px-3 hover:bg-card-background/80" aria-label="Auto Skip Intro & Outro">
									<svg height="24" viewBox="0 -960 960 960" width="24" fill="currentColor" class="h-3.5 w-3.5 sm:size-4"><path d="M760-120 480-400l-94 94q8 15 11 32t3 34q0 66-47 113T240-80q-66 0-113-47T80-240q0-66 47-113t113-47q17 0 34 3t32 11l94-94-94-94q-15 8-32 11t-34 3q-66 0-113-47T80-720q0-66 47-113t113-47q66 0 113 47t47 113q0 17-3 34t-11 32l494 494v40H760ZM600-520l-80-80 240-240h120v40L600-520ZM240-640q33 0 56.5-23.5T320-720q0-33-23.5-56.5T240-800q-33 0-56.5 23.5T160-720q0 33 23.5 56.5T240-640Zm240 180q8 0 14-6t6-14q0-8-6-14t-14-6q-8 0-14 6t-6 14q0 8 6 14t14 6ZM240-160q33 0 56.5-23.5T320-240q0-33-23.5-56.5T240-320q-33 0-56.5 23.5T160-240q0 33 23.5 56.5T240-160Z"></path></svg>
									<span class="hidden text-[11px] leading-none font-semibold tracking-tight uppercase 2xl:inline 2xl:text-[0.75rem]">Auto Skip</span>
								</button>
								<div class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 transform rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:block">Enable Auto Skip<div class="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-4 border-r-4 border-l-4 border-transparent border-t-zinc-700"></div></div>
							</div>
							<div class="relative inline-block">
								<button onclick={() => listDropdownOpen = !listDropdownOpen} class="bg-card-background flex items-center justify-center gap-1 rounded-md px-2 py-1 transition-colors sm:px-2.5 xl:px-2.5 2xl:px-3 hover:bg-card-background/80" aria-label="Add to Watchlist">
									<svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3.5 w-3.5 sm:size-4"><path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z"></path></svg>
									<span class="hidden text-[11px] leading-none font-semibold tracking-tight uppercase 2xl:inline 2xl:text-[0.75rem]">{currentStatus ? 'In List' : 'Add to List'}</span>
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="hidden h-3 w-3 transition-transform 2xl:block"><path d="m6 9 6 6 6-6"></path></svg>
								</button>
								{#if listDropdownOpen}
									<div onclick={(e) => e.stopPropagation()} class="absolute right-0 z-50 mt-1 w-44 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl">
										{#each listOptions as option}
											<button onclick={() => handleAddToList(option.value)} class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white {currentStatus === option.value ? 'bg-zinc-800/50 text-primary' : ''}">
												{#if currentStatus === option.value}<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>{:else}<span class="w-3.5"></span>{/if}{option.label}
											</button>
										{/each}
										{#if currentStatus}
											<div class="border-t border-zinc-800">
												<button onclick={handleRemoveFromList} class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-400 transition-all hover:bg-zinc-800 hover:text-red-300">
													<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>Remove</button>
											</div>
										{/if}
									</div>
								{/if}
							</div>
						</div>
					</div>
					<div class="my-3 border-t border-solid border-gray-300/10"></div>
					<div class="watch-servers-enter lg:hidden">
						<div class="bg-card-background flex w-full flex-col items-center justify-center gap-2.5 rounded-lg px-4 py-3">
							<div class="flex flex-col items-center gap-1 pb-0.5">
								<span class="text-sm font-bold text-white">You are watching <span class="text-primary">Episode {currentEpisode}</span></span>
								<span class="text-center text-[11px] leading-relaxed text-zinc-500">If the current server is not working, please try switching to other servers.</span>
							</div>
						</div>
					</div>
					<div class="watch-servers-enter hidden h-auto lg:block">
						<div class="flex h-full flex-col items-start gap-3 rounded-lg xl:flex-row xl:items-center xl:gap-2">
							<div class="bg-card-background hidden h-full flex-col items-center justify-center rounded-lg p-4 xl:flex xl:w-2/6">
								<span class="text-xs text-zinc-400 xl:text-sm">You are Watching</span>
								<span class="mt-0.5 text-sm font-medium md:text-white">Episode {currentEpisode}</span>
								<span class="mt-1 flex flex-col items-center justify-center text-center text-xs !leading-tight text-zinc-500 xl:text-sm">If current server doesn't work please try other servers beside.</span>
							</div>
						</div>
					</div>
				</div>
				<div class="mt-0.5 lg:hidden">
					<div class="mb-3 flex items-center justify-between">
						<h3 class="text-[10px] font-bold tracking-[0.22em] text-zinc-500 uppercase">Watch more seasons of this anime</h3>
						<span class="text-[9px] font-semibold text-zinc-500">{relatedAnime.length} ENTRIES</span>
					</div>
					<div class="flex flex-wrap gap-2.5">
						{#each relatedAnime as item}
							<a href="/anime/{item.id}" class="group relative flex h-[75px] w-[calc(50%-5px)] items-center justify-center overflow-hidden rounded-[10px] transition-all duration-300 hover:scale-[1.02] focus:scale-[1.02] focus:ring-2 focus:ring-primary focus:outline-none focus:z-10 border border-zinc-800">
								<div class="absolute inset-0 z-0"><img src={item.image} alt={item.title} class="h-full w-full object-cover blur-[2px] brightness-[0.45] transition-all duration-300 group-hover:brightness-[0.55]" loading="lazy" referrerpolicy="no-referrer" /></div>
								<div class="pointer-events-none absolute inset-0 z-10 opacity-40" style="background-image: radial-gradient(circle, #ffffff33 1.2px, transparent 1.2px); background-size: 6px 6px;"></div>
								<div class="relative z-20 w-full max-w-full overflow-hidden px-2.5 text-center pointer-events-none">
									<span class="block text-[8px] font-bold tracking-widest text-primary truncate drop-shadow-lg" style="text-shadow: 0 1px 3px rgba(0,0,0,0.9);">{item.type.replace('_', ' ').toUpperCase()}</span>
									<h4 class="mt-0.5 text-[10px] font-semibold tracking-wide text-zinc-100 group-hover:text-white line-clamp-1 drop-shadow-lg" style="text-shadow: 0 1px 3px rgba(0,0,0,0.8);">{item.title}</h4>
									<div class="mt-0.5 flex items-center justify-center gap-1 text-[8px] font-medium text-zinc-400" style="text-shadow: 0 1px 2px rgba(0,0,0,0.9);">
										<span>{item.type.replace('_', ' ')}</span><span>•</span><span>{item.year}</span>
									</div>
								</div>
							</a>
						{/each}
					</div>
				</div>
			{/if}
			{#if anime}
				<div class="watch-info-enter mt-8 flex flex-col lg:hidden">
					<div class="mb-3 flex items-center gap-2 px-1"><h2 class="text-lg font-medium text-white">About Anime</h2></div>
					<div class="flex w-full flex-col gap-4 rounded-lg border border-white/5 bg-zinc-900/40 p-4">
						<div class="flex flex-row items-start gap-4">
							<div class="aspect-[2/3] w-24 shrink-0 overflow-hidden rounded-md border border-white/10"><img src={anime.image} alt={anime.title} class="h-full w-full object-cover" loading="lazy" /></div>
							<div class="flex flex-1 flex-col">
								<h3 class="line-clamp-2 text-base leading-tight font-bold text-white">{anime.title}</h3>
								{#if anime.titleJapanese}<p class="mt-1 line-clamp-2 text-xs text-zinc-400">{anime.titleJapanese}</p>{/if}
								<div class="mt-3 flex flex-wrap gap-1.5">
									<span class="relative flex -skew-x-12 items-center justify-center border border-white/10 bg-black/80 px-2 py-0.5 shadow-sm">
										<div class="absolute top-0 right-0 h-full w-1 bg-white/10"></div>
										<span class="relative z-10 flex skew-x-12 items-center gap-1.5 text-[10px] font-black tracking-wider text-primary uppercase">
											<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-3"><rect width="18" height="14" x="3" y="5" rx="2" ry="2"></rect><path d="M7 15h4M15 15h2M7 11h2M13 11h4"></path></svg><span>{anime.episodes.length}</span>
										</span>
									</span>
									<span class="relative flex -skew-x-12 items-center justify-center border border-white/10 bg-black/80 px-2 py-0.5 shadow-sm">
										<div class="absolute top-0 right-0 h-full w-1 bg-white/10"></div>
										<span class="relative z-10 flex skew-x-12 items-center gap-1.5 text-[10px] font-black tracking-wider text-primary uppercase">
											<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-3"><path d="M12 19v3"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><rect x="9" y="2" width="6" height="13" rx="3"></rect></svg><span>{Math.min(anime.totalEpisodes || anime.episodes.length, anime.episodes.length)}</span>
										</span>
									</span>
									<span class="relative flex -skew-x-12 items-center justify-center border border-white/10 bg-black/80 px-2 py-0.5 shadow-sm">
										<div class="absolute top-0 right-0 h-full w-1 bg-white/10"></div>
										<span class="relative z-10 flex skew-x-12 items-center justify-center text-[10px] font-black tracking-wider text-primary uppercase">{anime.status === 'completed' ? 'FINISHED' : anime.status === 'ongoing' ? 'RELEASING' : 'UPCOMING'}</span>
									</span>
								</div>
								<div class="mt-3 line-clamp-4 text-[11.5px] leading-relaxed text-zinc-400">{anime.description}</div>
							</div>
						</div>
						<div class="flex flex-col gap-2.5 border-t border-white/5 pt-4 text-[13px]">
							<div class="flex gap-2"><span class="w-[70px] shrink-0 font-medium text-zinc-500">Start Date:</span><span class="truncate text-zinc-200">{anime.episodes[0]?.aired || 'Unknown'}</span></div>
							<div class="flex gap-2"><span class="w-[70px] shrink-0 font-medium text-zinc-500">Country:</span><span class="truncate text-zinc-200">JP</span></div>
							<div class="flex gap-2"><span class="w-[70px] shrink-0 font-medium text-zinc-500">Genres:</span><span class="line-clamp-2 text-zinc-200">{anime.genres.join(', ')}</span></div>
							<div class="flex gap-2"><span class="w-[70px] shrink-0 font-medium text-zinc-500">Premiered:</span><span class="text-zinc-200 capitalize">{anime.season}</span></div>
							<div class="flex gap-2"><span class="w-[70px] shrink-0 font-medium text-zinc-500">Duration:</span><span class="text-zinc-200">{anime.duration}</span></div>
							<div class="flex gap-2"><span class="w-[70px] shrink-0 font-medium text-zinc-500">Score:</span><span class="text-zinc-200">{anime.rating > 0 ? anime.rating : 'N/A'}</span></div>
							<div class="flex gap-2"><span class="w-[70px] shrink-0 font-medium text-zinc-500">Studios:</span><span class="truncate text-zinc-200">{anime.studio || 'Unknown'}</span></div>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Right Sidebar - Episodes List (Desktop) -->
		<div class="watch-episodes-enter relative w-full shrink-0 lg:w-[clamp(300px,28vw,420px)] lg:self-stretch">
			<div class="mr-2 flex h-full flex-col lg:absolute lg:inset-x-0 lg:top-0 lg:max-h-full">
				{#if anime}
					<div class="mb-3 flex flex-col gap-3">
						<div class="flex flex-row items-center justify-between">
							<div class="flex items-center gap-2">
								<h1 class="text-lg font-medium text-white xl:text-xl">Episodes</h1>
								<span class="rounded-md bg-white/10 px-2 py-0.5 text-xs font-semibold text-white/70">{anime.episodes.length}</span>
							</div>
							<div class="flex flex-row items-center justify-center gap-2">
								<button onclick={() => gridView = !gridView} class="text-zinc-400 transition-colors hover:text-white" aria-label="Toggle episode view">
									{#if gridView}
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="h-5 w-5"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
									{:else}
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="h-5 w-5"><path d="M12 3v18"></path><path d="M3 12h18"></path><rect x="3" y="3" width="18" height="18" rx="2"></rect></svg>
									{/if}
								</button>
								<button onclick={() => spoilerMode = !spoilerMode} class="text-zinc-400 transition-colors hover:text-white" aria-label="Toggle spoiler shield" title={spoilerMode ? 'Disable spoiler shield' : 'Enable spoiler shield'}>
									{#if spoilerMode}
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="h-5 w-5"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"></path><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"></path><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"></path><path d="m2 2 20 20"></path></svg>
									{:else}
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="h-5 w-5"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
									{/if}
								</button>
							</div>
						</div>
						<div class="relative w-full">
							<input bind:value={episodeSearch} placeholder="Search episodes..." class="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/60 px-3 py-2 pr-10 text-xs font-medium text-white placeholder-zinc-400 transition-all duration-200 outline-none focus:border-primary/50 focus:bg-zinc-800/80 focus:ring-2 focus:ring-primary/20" type="text" />
							<div class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform">
								<svg class="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
							</div>
						</div>
					</div>
					<div class="relative flex min-h-0 min-h-[200px] w-full flex-1 flex-col">
						<div class="no-scrollbar h-full max-h-[26rem] !w-full !max-w-full overflow-y-auto lg:max-h-full lg:flex-1 flex flex-col lg:gap-0 transition-all duration-300" style="width: 100%;">
							{#if filteredEpisodes.length === 0}
								<div class="flex items-center justify-center py-8 text-sm text-zinc-500">No episodes found</div>
							{:else if gridView}
								<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(44px, 1fr)); gap: 8px;">
									{#each filteredEpisodes as ep}
										<a href="/watch/{slug}?ep={ep.number}" class="episode-grid-btn {ep.number === currentEpisode ? 'episode-grid-active' : ''}" style="display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 6px; font-size: 13px; font-weight: 600; transition: background-color 0.2s; text-decoration: none; {ep.number === currentEpisode ? 'background-color: #ccff00; color: #171717;' : 'background-color: #16181d; color: #ffffff;'}">{ep.number}</a>
									{/each}
								</div>
							{:else}
								{#each filteredEpisodes as ep}
									<a href="/watch/{slug}?ep={ep.number}" class="episode-stagger episode-card-enhanced group relative mb-1 flex h-16 !w-full shrink-0 flex-row items-center overflow-hidden rounded-md border transition-all duration-200 ease-out {ep.number === currentEpisode ? 'episode-playing pointer-events-none border-white bg-white/5' : 'border-white/5 bg-transparent hover:bg-white/5'}" style="width: 100%;" data-episode={ep.number}>
										<div class="relative h-full w-[114px] min-w-[114px] flex-shrink-0 overflow-hidden border-r border-white/5 bg-zinc-900">
											<img alt={ep.title} class="h-full w-full object-cover transition-all duration-300 opacity-70 group-hover:opacity-100 {ep.number === currentEpisode ? 'opacity-40' : ''} {spoilerMode ? 'blur-xl' : ''}" src={anime.image} loading="lazy" />
											{#if ep.number === currentEpisode}
												<div class="absolute inset-0 flex items-center justify-center">
													<div class="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm"><svg class="h-4 w-4 translate-x-[1px] text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg></div>
												</div>
											{/if}
										</div>
										<div class="flex flex-1 flex-col justify-center gap-0.5 overflow-hidden px-3 py-1">
											<div class="text-[13px] font-bold tracking-wide transition-colors {ep.number === currentEpisode ? 'text-white' : 'text-white group-hover:text-primary'} flex items-start justify-between gap-2">
												<span class="line-clamp-2 leading-tight">{ep.title}</span>
											</div>
											<div class="line-clamp-2 text-[10px] leading-snug font-medium tracking-wide text-zinc-500 md:text-[11px]">
												{#if ep.duration}{ep.duration}{/if}
											</div>
										</div>
									</a>
								{/each}
							{/if}
						</div>
					</div>
				{/if}
				{#if anime}
					<div class="watch-episodes-enter hidden shrink-0 flex-col lg:flex">
						<div class="scrollbar-hide flex-col overflow-hidden rounded-lg mt-5">
							<div class="mb-3 flex items-center gap-2 leading-tight">
								<span class="ml-0.5 h-6 w-[.35rem] rounded-md bg-white md:w-[.3rem]"></span>
								<h2 class="text-lg font-medium text-white xl:text-xl">Related Anime</h2>
							</div>
							<div class="relative min-h-[100px] w-full">
								<div class="space-y-2 transition-all duration-300">
									{#each relatedAnime as item}
										<a href="/anime/{item.id}">
											<div class="bg-card-background mb-3 flex h-[5.4rem] gap-2 overflow-hidden rounded-lg pr-1 transition-all duration-300 ease-out md:gap-3 hover:scale-[0.975] hover:bg-[#27272c]">
												<div class="h-full w-[65px] flex-shrink-0 rounded-lg"><img width="70" height="90" alt={item.title} class="h-full w-full rounded-lg object-cover" src={item.image} referrerpolicy="no-referrer" /></div>
												<div class="flex h-full min-w-0 flex-grow flex-col justify-center gap-0.5">
													<p class="line-clamp-2 text-sm font-medium text-white opacity-90">{item.title}</p>
													<p class="mt-1 flex items-center text-[10px] font-medium text-zinc-400"><span class="tracking-widest text-primary uppercase drop-shadow-sm line-clamp-1">{item.type.replace('_', ' ').toUpperCase()}</span><span class="mx-1.5 opacity-40">•</span><span class="shrink-0">{item.type.replace('_', ' ')} {#if item.year}• {item.year}{/if}</span></p>
												</div>
											</div>
										</a>
									{/each}
								</div>
							</div>
						</div>
						<div class="scrollbar-hide flex-col overflow-y-hidden rounded-lg mt-5">
							<div class="mb-3 flex items-center gap-2 leading-tight">
								<span class="ml-0.5 h-6 w-[.35rem] rounded-md bg-white md:w-[.3rem]"></span>
								<h2 class="text-lg font-medium text-white xl:text-xl">Recommendations</h2>
							</div>
							<div class="relative min-h-[100px] w-full">
								<div class="no-scrollbar flex max-h-[18rem] w-full flex-col overflow-y-scroll transition-all duration-300 lg:max-h-[25rem]">
									{#each Array(5) as _}
										<div class="bg-card-background mb-3 flex h-[5.4rem] animate-pulse gap-2 overflow-hidden rounded-lg pr-1 md:gap-3">
											<div class="h-full w-[65px] flex-shrink-0 rounded-lg bg-zinc-700"></div>
											<div class="flex h-full flex-grow flex-col justify-center gap-1.5"><div class="h-3 w-3/4 rounded bg-zinc-700"></div><div class="h-2.5 w-1/2 rounded bg-zinc-700"></div></div>
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
@keyframes watch-page-enter { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes watch-sidebar-enter { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
@keyframes watch-episodes-enter { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
@keyframes watch-controls-enter { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
@keyframes watch-info-enter { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
@keyframes watch-servers-enter { from { opacity:0; transform:scale(0.97); } to { opacity:1; transform:scale(1); } }
@keyframes episode-stagger { from { opacity:0; transform:translateX(8px); } to { opacity:1; transform:translateX(0); } }
.watch-page-enter { animation: watch-page-enter 0.5s ease-out forwards; }
.watch-sidebar-enter { animation: watch-sidebar-enter 0.4s ease-out forwards; }
.watch-episodes-enter { animation: watch-episodes-enter 0.4s ease-out forwards; }
.watch-controls-enter { animation: watch-controls-enter 0.5s ease-out 0.2s both; }
.watch-info-enter { animation: watch-info-enter 0.5s ease-out 0.3s both; }
.watch-servers-enter { animation: watch-servers-enter 0.4s ease-out 0.15s both; }
.episode-stagger { animation: episode-stagger 0.3s ease-out both; }
.episode-stagger:nth-child(1) { animation-delay: 0.02s; }
.episode-stagger:nth-child(2) { animation-delay: 0.04s; }
.episode-stagger:nth-child(3) { animation-delay: 0.06s; }
.episode-stagger:nth-child(4) { animation-delay: 0.08s; }
.episode-stagger:nth-child(5) { animation-delay: 0.10s; }
.episode-stagger:nth-child(6) { animation-delay: 0.12s; }
.episode-stagger:nth-child(7) { animation-delay: 0.14s; }
.episode-stagger:nth-child(8) { animation-delay: 0.16s; }
.episode-stagger:nth-child(9) { animation-delay: 0.18s; }
.episode-stagger:nth-child(10) { animation-delay: 0.20s; }
.episode-grid-btn:not(.episode-grid-active):hover { background-color: #2a2d35 !important; }
</style>