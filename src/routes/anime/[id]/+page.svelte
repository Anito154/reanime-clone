<script lang="ts">
	import { page } from '$app/state';
	import ShareDialog from '$lib/components/ShareDialog.svelte';
	import { myList, type ListStatus } from '$lib/myList.svelte';
	import { fetchAnimeDetail, animeList } from '$lib/data/store.svelte';
	import type { Anime } from '$lib/data/store.svelte';
	import { onMount } from 'svelte';

	let anime = $state<Anime | null>(null);
	let isLoaded = $state(false);
	let descExpanded = $state(false);

	onMount(async () => {
		if (page.params.id) {
			const detail = await fetchAnimeDetail(page.params.id);
			anime = detail;
			isLoaded = true;
		}
	});
	let showShareDialog = $state(false);
	let listDropdownOpen = $state(false);

	let currentStatus = $derived(anime ? myList.getStatus(anime.id) : null);

	const listOptions: { value: ListStatus; label: string }[] = [
		{ value: 'watching', label: 'Watching' },
		{ value: 'completed', label: 'Completed' },
		{ value: 'plan_to_watch', label: 'Plan to Watch' },
		{ value: 'dropped', label: 'Dropped' },
		{ value: 'on_hold', label: 'On Hold' }
	];

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

	function handleListButtonClick(e: MouseEvent) {
		e.stopPropagation();
		listDropdownOpen = !listDropdownOpen;
	}

	function handleListButtonKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') listDropdownOpen = false;
	}

	function handleDropdownClick(e: MouseEvent) {
		e.stopPropagation();
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

	$effect(() => {
		if (anime) {
			const t = setTimeout(() => isLoaded = true, 500);
			return () => clearTimeout(t);
		}
	});

	let relatedAnime = $derived.by(() => {
		const a = anime;
		if (!a) return [];
		return animeList.filter(b => b.id !== a.id && b.genres.some(g => a.genres.includes(g))).slice(0, 6);
	});

</script>

{#if !isLoaded || !anime}
	<div class="flex min-h-screen items-center justify-center bg-[#050505]">
		<div class="skeleton size-12 rounded-full"></div>
	</div>
{:else}
	<div class="min-h-screen bg-[#050505] text-white">
		<div class="relative -mt-16 flex min-h-screen w-full flex-col items-center gap-5 px-4 pt-16 md:px-12">
			<!-- Banner Background -->
			<div class="animate-fade-in absolute top-0 left-0 w-full">
				<div class="absolute inset-0 z-10 h-[280px] w-full bg-gradient-to-t from-black from-10% to-transparent"></div>
				<img src={anime.banner} alt="banner" class="absolute top-0 left-0 z-0 h-[250px] w-screen object-cover blur-[2px] brightness-[80%]" />
			</div>

			<div class="z-30 flex w-full flex-col gap-5 lg:max-w-screen-xl xl:max-w-screen-2xl">
				<div class="mt-[60px] flex w-full flex-col gap-6 md:mt-[120px] md:flex-row md:items-stretch">
					<!-- Left Column: Cover + Desktop Info Card -->
					<div class="animate-fade-in-up flex flex-col gap-6 md:w-[250px] md:flex-shrink-0" style="animation-delay: 100ms;">
						<div class="flex flex-shrink-0 justify-center md:block">
							<img src={anime.image} alt={anime.title} class="h-[350px] w-[250px] rounded-lg object-cover shadow-lg" />
						</div>
						<div class="hidden flex-1 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-white shadow md:block">
							<div class="flex h-max flex-col gap-4 select-none">
								<div class="flex flex-col gap-1">
									<p class="text-xs font-medium text-gray-500">Type</p>
									<span class="text-sm text-gray-300">ANIME</span>
								</div>
								<div class="flex flex-col gap-1">
									<p class="text-xs font-medium text-gray-500">Episodes</p>
									<span class="text-sm text-gray-300">{anime.totalEpisodes || anime.episodes.length || 'N/A'}</span>
								</div>
								<div class="flex flex-col gap-1">
									<p class="text-xs font-medium text-gray-500">Duration</p>
									<span class="text-sm text-gray-300">{anime.duration}</span>
								</div>
								<div class="flex flex-col gap-1">
									<p class="text-xs font-medium text-gray-500">Status</p>
									<span class="text-sm text-gray-300">{anime.status === 'ongoing' ? 'Releasing' : anime.status === 'completed' ? 'Finished' : anime.status}</span>
								</div>
								<div class="flex flex-col gap-1">
									<p class="text-xs font-medium text-gray-500">Start Date</p>
									<span class="text-sm text-gray-300">{anime.episodes[0]?.aired || 'Unknown'}</span>
								</div>
								<div class="flex flex-col gap-1">
									<p class="text-xs font-medium text-gray-500">Season</p>
									<span class="text-sm text-gray-300">{anime.season}</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Right Column -->
					<div class="mt-4 flex min-w-0 flex-grow flex-col gap-6 md:mt-0">
						<!-- Title, Description, Genres, Buttons, Badges -->
						<div class="animate-fade-in-up relative z-10 flex flex-col gap-4" style="animation-delay: 200ms;">
							<div class="flex flex-col gap-2">
								<h1 class="text-center text-lg font-bold text-white md:text-left md:text-2xl">{anime.title}</h1>
								{#if anime.titleJapanese}
									<h2 class="mx-auto w-3/4 text-center text-sm font-bold italic md:w-full md:text-left md:text-lg text-primary">{anime.titleJapanese}</h2>
								{/if}
							</div>

							<!-- Description with Read More -->
							<div class="relative">
								<div class="absolute top-0 z-30 flex h-full w-full items-end justify-center bg-gradient-to-b from-transparent to-black to-95% transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] {descExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}" style="transition-property: opacity;">
									<button type="button" onclick={() => descExpanded = true} class="w-full py-1 text-center font-bold text-gray-200">Read More</button>
								</div>
								<div class="relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]" style={descExpanded ? 'max-height: 2000px' : 'max-height: 150px'}>
									<div class="pb-1">
										<p class="mx-2 text-center text-sm leading-6 font-light text-white md:mx-0 md:text-start md:text-base">{anime.description}</p>
									</div>
								</div>
							</div>

							<!-- Genres -->
							<div class="flex flex-wrap justify-center gap-2 md:justify-start">
								{#each anime.genres as genre}
									<a href="/search?genre={genre}" class="rounded-full px-2 py-1 text-sm text-zinc-400 transition-all hover:text-white" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);">{genre}</a>
								{/each}
							</div>

							<!-- Action Buttons -->
							<div class="flex flex-wrap items-center justify-center gap-3 md:justify-start">
								<a href="/watch/{anime.id}?ep=1" class="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-black shadow transition-all hover:brightness-110">
									<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
									Watch Now
								</a>
								<div class="relative">
									<button
										onclick={handleListButtonClick}
										onkeydown={handleListButtonKeydown}
										class="inline-flex h-9 items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium text-white transition-all {currentStatus ? 'border-primary bg-primary/10 hover:bg-primary/20' : 'border-zinc-700 bg-transparent hover:bg-zinc-800'}"
									>
										{#if currentStatus}
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
											<span>{listOptions.find(o => o.value === currentStatus)?.label ?? 'In List'}</span>
										{:else}
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>
											<span>Add to List</span>
										{/if}
										<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform {listDropdownOpen ? 'rotate-180' : ''}"><path d="m6 9 6 6 6-6"/></svg>
									</button>
									{#if listDropdownOpen}
										<div
											class="absolute right-0 z-50 mt-1 w-44 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl"
											onclick={handleDropdownClick}
										>
											{#each listOptions as option}
												<button
													onclick={() => handleAddToList(option.value)}
													class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white {currentStatus === option.value ? 'bg-zinc-800/50 text-primary' : ''}"
												>
													{#if currentStatus === option.value}
														<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
													{:else}
														<span class="w-3.5"></span>
													{/if}
													{option.label}
												</button>
											{/each}
											{#if currentStatus}
												<div class="border-t border-zinc-800">
													<button
														onclick={handleRemoveFromList}
														class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-400 transition-all hover:bg-zinc-800 hover:text-red-300"
													>
														<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
														Remove
													</button>
												</div>
											{/if}
										</div>
									{/if}
								</div>
								<button onclick={() => showShareDialog = true} class="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-700 bg-transparent px-3 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-800">
									<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16,6 12,2 8,6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
									Share
								</button>
							</div>

							<!-- Info Badges -->
							<div class="flex flex-wrap justify-center gap-2 md:justify-start">
								<div class="rounded-md border border-zinc-700 bg-zinc-800/30 px-2 py-1 text-xs font-medium text-white">{anime.type.replace('_', ' ')}</div>
								<div class="rounded-md border border-zinc-700 bg-zinc-800/30 px-2 py-1 text-xs font-medium text-white">{anime.totalEpisodes || anime.episodes.length || 'N/A'} episodes</div>
								<div class="rounded-md border border-zinc-700 bg-zinc-800/30 px-2 py-1 text-xs font-medium text-white">{anime.duration}</div>
								<div class="rounded-md border border-zinc-700 bg-zinc-800/30 px-2 py-1 text-xs font-medium text-white">{anime.status === 'ongoing' ? 'Releasing' : anime.status === 'completed' ? 'Finished' : anime.status}</div>
								<div class="rounded-md border border-zinc-700 bg-zinc-800/30 px-2 py-1 text-xs font-medium text-white">{anime.season}</div>
							</div>
						</div>

						<!-- Mobile Info Card -->
						<div class="animate-fade-in-up w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-white shadow md:hidden" style="animation-delay: 300ms;">
							<div class="flex gap-x-6 overflow-x-auto pb-2 select-none">
								<div class="flex flex-col gap-1">
									<p class="text-xs font-medium text-gray-500">Type</p>
									<span class="text-sm whitespace-nowrap text-gray-300">ANIME</span>
								</div>
								<div class="flex flex-col gap-1">
									<p class="text-xs font-medium text-gray-500">Episodes</p>
									<span class="text-sm whitespace-nowrap text-gray-300">{anime.totalEpisodes || anime.episodes.length || 'N/A'}</span>
								</div>
								<div class="flex flex-col gap-1">
									<p class="text-xs font-medium text-gray-500">Duration</p>
									<span class="text-sm whitespace-nowrap text-gray-300">{anime.duration}</span>
								</div>
								<div class="flex flex-col gap-1">
									<p class="text-xs font-medium text-gray-500">Status</p>
									<span class="text-sm whitespace-nowrap text-gray-300">{anime.status === 'ongoing' ? 'Releasing' : anime.status === 'completed' ? 'Finished' : anime.status}</span>
								</div>
								<div class="flex flex-col gap-1">
									<p class="text-xs font-medium text-gray-500">Start Date</p>
									<span class="text-sm whitespace-nowrap text-gray-300">{anime.episodes[0]?.aired || 'Unknown'}</span>
								</div>
								<div class="flex flex-col gap-1">
									<p class="text-xs font-medium text-gray-500">Season</p>
									<span class="text-sm whitespace-nowrap text-gray-300">{anime.season}</span>
								</div>
							</div>
						</div>

						<!-- Main Content Card -->
						<div class="animate-fade-in-up w-full rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 shadow" style="animation-delay: 400ms;">
							<!-- Alternative Titles -->
							<div class="mb-6">
								<h2 class="mb-2 text-lg font-semibold text-white">Alternative Titles</h2>
								<div class="flex flex-wrap gap-2">
									{#if anime.titleJapanese}
										<span class="rounded bg-zinc-800/50 px-2 py-1 text-sm text-gray-400">{anime.titleJapanese}</span>
									{/if}
								</div>
							</div>

							<!-- Studios -->
							<div class="mb-6">
								<h2 class="mb-2 text-lg font-semibold text-white">Studios</h2>
								<div class="flex flex-wrap gap-2">
									{#if anime.studio}
										<a href="/search?studio={anime.studio}" class="rounded bg-zinc-800/50 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-zinc-700/50 hover:text-white">{anime.studio}</a>
									{:else}
										<span class="rounded bg-zinc-800/50 px-3 py-1.5 text-sm text-gray-500">Unknown</span>
									{/if}
								</div>
							</div>

							<!-- Stats -->
							<div class="mb-6">
								<h2 class="mb-4 text-lg font-semibold text-white">Stats</h2>
								<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
									<div class="flex flex-col items-center rounded-lg bg-zinc-800/50 p-3">
										<span class="text-xs text-gray-400">Episodes</span>
										<span class="text-xl font-bold text-white">{anime.totalEpisodes || anime.episodes.length || 'N/A'}</span>
									</div>
									<div class="flex flex-col items-center rounded-lg bg-zinc-800/50 p-3">
										<span class="text-xs text-gray-400">Duration</span>
										<span class="text-xl font-bold text-white">{anime.duration}</span>
									</div>
									<div class="flex flex-col items-center rounded-lg bg-zinc-800/50 p-3">
										<span class="text-xs text-gray-400">Subbed</span>
										<span class="text-xl font-bold text-white">{anime.episodes.length || 0}</span>
									</div>
									<div class="flex flex-col items-center rounded-lg bg-zinc-800/50 p-3">
										<span class="text-xs text-gray-400">Dubbed</span>
										<span class="text-xl font-bold text-white">{Math.floor((anime.episodes.length || 0) / 2)}</span>
									</div>
								</div>
							</div>

							<!-- Related Seasons & Series -->
							{#if relatedAnime.length > 0}
								<div class="mt-6 border-t border-zinc-800/80 pt-6">
									<div class="mb-4 flex items-center justify-between">
										<div class="flex items-center">
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="mr-2 h-5 w-5 text-primary" fill="currentColor"><path d="M21 3H3c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2H3V5h18v8h2V5a2 2 0 0 0-2-2zm-8 7V7h-2v3H8v2h3v3h2v-3h3v-2h-3zm11 8-4.5 4.5L18 21l3-3-3-3 1.5-1.5L24 18z"/></svg>
											<h3 class="text-sm font-semibold uppercase tracking-wider text-white">RELATED SEASONS & SERIES</h3>
										</div>
										<span class="text-xs font-semibold text-zinc-500">{relatedAnime.length} ENTRIES</span>
									</div>
									<div class="flex gap-3 overflow-x-auto pb-2">
										{#each relatedAnime as item}
											<a
												href="/anime/{item.id}"
												class="group relative flex h-[80px] w-[186px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] border-2 border-zinc-700 transition-all duration-300 hover:scale-[1.02]"
											>
												<div class="absolute inset-0 z-0">
													<img src={item.image} alt={item.title} class="h-full w-full object-cover blur-[2px] brightness-[0.45] transition-all duration-300 group-hover:brightness-[0.55]" loading="lazy" />
												</div>
												<div class="pointer-events-none absolute inset-0 z-10 opacity-40" style="background-image: radial-gradient(circle, #ffffff33 1.2px, transparent 1.2px); background-size: 6px 6px;"></div>
												<div class="relative z-20 w-full max-w-full overflow-hidden px-3 text-center">
													<span class="block text-[9px] font-bold tracking-widest text-primary truncate drop-shadow-lg" style="text-shadow: 0 1px 3px rgba(0,0,0,0.9);">{item.type.replace('_', ' ')}</span>
													<h4 class="mt-0.5 text-xs font-semibold tracking-wide text-zinc-100 group-hover:text-white line-clamp-1 drop-shadow-lg" style="text-shadow: 0 1px 3px rgba(0,0,0,0.8);">{item.title}</h4>
													<div class="mt-0.5 flex items-center justify-center gap-1.5 text-[9px] font-medium text-zinc-400" style="text-shadow: 0 1px 2px rgba(0,0,0,0.9);">
														<span>{item.type.replace('_', ' ')}</span>
														<span>•</span>
														<span>{item.year}</span>
													</div>
												</div>
											</a>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

{#if anime}
	<ShareDialog {anime} open={showShareDialog} onclose={() => showShareDialog = false} />
{/if}
