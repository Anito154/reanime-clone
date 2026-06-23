<script lang="ts">
	import { getAnimeById } from '$lib/data/mock';
	import { page } from '$app/state';

	let anime = $derived(getAnimeById(page.params.slug ?? ''));
	let epNum = $state(Number(page.url.searchParams.get('ep')) || 1);
	let currentEpisode = $derived(anime?.episodes.find(ep => ep.number === epNum) || anime?.episodes[0]);

	$effect(() => {
		epNum = Number(page.url.searchParams.get('ep')) || 1;
	});

	function switchEpisode(n: number) {
		const url = new URL(page.url);
		url.searchParams.set('ep', String(n));
		window.history.replaceState({}, '', url);
		epNum = n;
	}

	let epFilter = $state('1-100');
	let epSearch = $state('');
	let selectedSub = $state(1);
	let selectedDub = $state(0);
	let theaterMode = $state(false);
	let autoplay = $state(true);
	let autonext = $state(true);
	let autoskip = $state(true);
	let isExpanded = $state(false);

	let filteredEpisodes = $derived(
		anime?.episodes.filter(ep => {
			const matchesSearch = epSearch === '' ||
				ep.title.toLowerCase().includes(epSearch.toLowerCase()) ||
				String(ep.number).includes(epSearch);
			if (epSearch) return matchesSearch;
			if (epFilter === 'all') return true;
			const [min, max] = epFilter.split('-').map(Number);
			return ep.number >= min && ep.number <= max;
		}) || []
	);

	let filterRanges = $derived(() => {
		if (!anime) return [];
		const total = anime.episodes.length;
		const ranges: string[] = [];
		for (let i = 1; i <= total; i += 100) {
			const end = Math.min(i + 99, total);
			ranges.push(`${i}-${end}`);
		}
		ranges.push('all');
		return ranges;
	});

	let seasons = $derived(
		animeList.filter(a => a.id !== anime?.id && a.genres.some(g => anime?.genres.includes(g))).slice(0, 2)
	);

	import { animeList } from '$lib/data/mock';

	let relatedAnime = $derived(
		animeList.filter(a => a.id !== anime?.id).slice(0, 4)
	);
</script>

{#if !anime}
	<div class="flex min-h-screen items-center justify-center bg-[#0f0f0f]">
		<div class="skeleton size-12 rounded-full"></div>
	</div>
{:else}
	<div class="min-h-screen bg-[#0f0f0f] text-white">
		<!-- Header -->
		<header class="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-white/[0.06] bg-[#0f0f0f] px-4">
			<div class="flex items-center gap-2">
				<a href="/home" class="flex items-center">
					<img src="/logo.png" alt="AniTo" class="h-7" />
				</a>
				<div class="ml-4 flex items-center gap-3">
					<a href="/home" class="text-[13px] font-medium text-zinc-400 transition-colors hover:text-white">Home</a>
					<a href="/search" class="text-[13px] font-medium text-zinc-400 transition-colors hover:text-white">Search</a>
					<a href="/schedule" class="text-[13px] font-medium text-zinc-400 transition-colors hover:text-white">Schedule</a>
					<a href="/my-list" class="text-[13px] font-medium text-zinc-400 transition-colors hover:text-white">My List</a>
					<a href="/settings" class="text-[13px] font-medium text-zinc-400 transition-colors hover:text-white">Settings</a>
				</div>
			</div>
			<div class="flex items-center gap-4">
				<div class="relative">
					<svg class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35"/></svg>
					<input
						type="text"
						placeholder="Search anime..."
						class="w-56 rounded-lg border border-white/[0.06] bg-[#1a1a1a] py-1.5 pl-9 pr-3 text-[13px] text-zinc-300 placeholder:text-zinc-600 focus:border-white/[0.12] focus:outline-none"
					/>
					<span class="absolute right-2.5 top-1/2 -translate-y-1/2 rounded bg-white/[0.04] px-1.5 py-0.5 text-[11px] text-zinc-600">⌘ S</span>
				</div>
				<button class="rounded-lg bg-primary px-4 py-1.5 text-[13px] font-semibold text-black transition-all hover:brightness-110">Sign In</button>
			</div>
		</header>

		<div class="mx-auto max-w-[1400px] px-4 py-6">
			<!-- Anime Info + Player Row -->
			<div class="flex gap-6">
				<!-- Main Content -->
				<div class="min-w-0 flex-1">
					<!-- Anime Info Banner -->
					<div class="mb-4 flex gap-4">
						<div class="w-[80px] shrink-0">
							<img src={anime.image} alt={anime.title} class="w-full rounded-lg" />
						</div>
						<div class="min-w-0 flex-1">
							<h1 class="text-lg font-bold leading-tight">{anime.title}</h1>
							<div class="mt-1.5 flex flex-wrap items-center gap-2 text-[13px]">
								<span class="font-semibold text-yellow-400">{anime.rating}</span>
								<span class="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">{anime.type.replace('_', ' ')}</span>
								<span class="text-zinc-500">{anime.year}</span>
							</div>
							<div class="mt-4 grid grid-cols-3 gap-x-6 gap-y-1 text-[13px]">
								<div class="flex items-center gap-2">
									<span class="text-zinc-500">Score:</span>
									<span class="font-semibold text-yellow-400">{anime.rating}</span>
								</div>
								<div class="flex items-center gap-2">
									<span class="text-zinc-500">Episodes:</span>
									<span>{anime.totalEpisodes || anime.episodes.length || '?'}</span>
								</div>
								<div class="flex items-center gap-2">
									<span class="text-zinc-500">Status:</span>
									<span class="capitalize">{anime.status}</span>
								</div>
								<div class="flex items-center gap-2">
									<span class="text-zinc-500">Duration:</span>
									<span>{anime.duration}</span>
								</div>
								<div class="flex items-center gap-2">
									<span class="text-zinc-500">Season:</span>
									<span>{anime.season}</span>
								</div>
								<div class="flex items-center gap-2">
									<span class="text-zinc-500">Studio:</span>
									<span>{anime.studio || 'Unknown'}</span>
								</div>
							</div>
							<p class="mt-3 text-[13px] leading-relaxed text-zinc-400 {isExpanded ? '' : 'line-clamp-2'}">{anime.description}</p>
							<button
								onclick={() => isExpanded = !isExpanded}
								class="mt-1 text-[12px] text-primary transition-colors hover:brightness-110"
							>
								{isExpanded ? 'Show less' : 'View Details'}
							</button>
						</div>
					</div>

					<!-- Player -->
					<div class="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
						<div class="flex h-full items-center justify-center bg-zinc-900/50">
							<div class="text-center">
								<div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/15">
									<svg class="ml-1 size-8 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
								</div>
								<p class="text-sm text-zinc-500">No streaming servers available</p>
								<p class="mt-1 text-xs text-zinc-600">This episode doesn't have any sources yet</p>
								<p class="mt-4 text-[11px] text-zinc-600">If episode is not working, please report it, and we will fix it as soon as possible.</p>
							</div>
						</div>
					</div>

					<!-- Controls Bar -->
					<div class="mt-3 flex flex-wrap items-center gap-2">
						<button
							onclick={() => theaterMode = !theaterMode}
							class="flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-[#1a1a1a] px-3 py-1.5 text-[12px] text-zinc-400 transition-all hover:border-white/[0.12] hover:text-white"
						>
							<svg class="size-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M8 21h8M12 17v4"/></svg>
							{theaterMode ? 'Disable' : 'Enable'} Theater Mode
						</button>
						<span class="text-zinc-700">|</span>
						<button
							onclick={() => autoplay = !autoplay}
							class="flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-[#1a1a1a] px-3 py-1.5 text-[12px] text-zinc-400 transition-all hover:border-white/[0.12] hover:text-white"
						>
							<svg class="size-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
							{autoplay ? 'Disable' : 'Enable'} Auto Play
						</button>
						<button
							onclick={() => autonext = !autonext}
							class="flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-[#1a1a1a] px-3 py-1.5 text-[12px] text-zinc-400 transition-all hover:border-white/[0.12] hover:text-white"
						>
							<svg class="size-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 17v-5a3 3 0 013-3h11.5M9 14l3 3m0 0l3-3m-3 3V4"/></svg>
							{autonext ? 'Disable' : 'Enable'} Auto Next
						</button>
						<button
							onclick={() => autoskip = !autoskip}
							class="flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-[#1a1a1a] px-3 py-1.5 text-[12px] text-zinc-400 transition-all hover:border-white/[0.12] hover:text-white"
						>
							<svg class="size-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
							{autoskip ? 'Disable' : 'Enable'} Auto Skip
						</button>
						<span class="text-zinc-700">|</span>
						<button class="flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-[#1a1a1a] px-3 py-1.5 text-[12px] text-zinc-400 transition-all hover:border-white/[0.12] hover:text-white">
							<svg class="size-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
							Add to List
						</button>
					</div>

					<!-- Server Info -->
					<div class="mt-3 text-[13px] text-zinc-500">
						You are watching Episode {currentEpisode?.number || 1}. If the current server is not working, please try switching to other servers.
					</div>

					<!-- Server Selection -->
					<div class="mt-3 space-y-3">
						<div>
							<div class="flex items-center gap-2">
								<span class="flex h-5 w-10 items-center justify-center rounded bg-primary/15 text-[10px] font-bold text-primary">SUB</span>
								<span class="text-[13px] text-zinc-300">Server</span>
							</div>
							<div class="mt-1.5 flex flex-wrap gap-1.5">
								<button
									onclick={() => selectedSub = 1}
									class="rounded-md border px-3 py-1 text-[12px] transition-all {selectedSub === 1 ? 'border-primary/30 bg-primary/5 text-primary' : 'border-white/[0.06] bg-[#1a1a1a] text-zinc-400 hover:border-white/[0.12] hover:text-white'}"
								>
									Server #1
								</button>
								<button
									onclick={() => selectedSub = 2}
									class="rounded-md border px-3 py-1 text-[12px] transition-all {selectedSub === 2 ? 'border-primary/30 bg-primary/5 text-primary' : 'border-white/[0.06] bg-[#1a1a1a] text-zinc-400 hover:border-white/[0.12] hover:text-white'}"
								>
									Server #2
								</button>
								<button
									onclick={() => selectedSub = 3}
									class="rounded-md border px-3 py-1 text-[12px] transition-all {selectedSub === 3 ? 'border-primary/30 bg-primary/5 text-primary' : 'border-white/[0.06] bg-[#1a1a1a] text-zinc-400 hover:border-white/[0.12] hover:text-white'}"
								>
									Server #3
								</button>
							</div>
						</div>
						<div>
							<div class="flex items-center gap-2">
								<span class="flex h-5 w-10 items-center justify-center rounded bg-blue-500/15 text-[10px] font-bold text-blue-400">DUB</span>
								<span class="text-[13px] text-zinc-300">Server</span>
							</div>
							<div class="mt-1.5 flex flex-wrap gap-1.5">
								<button
									onclick={() => selectedDub = 1}
									class="rounded-md border px-3 py-1 text-[12px] transition-all {selectedDub === 1 ? 'border-blue-500/30 bg-blue-500/5 text-blue-400' : 'border-white/[0.06] bg-[#1a1a1a] text-zinc-400 hover:border-white/[0.12] hover:text-white'}"
								>
									Server #1
								</button>
								<button
									onclick={() => selectedDub = 2}
									class="rounded-md border px-3 py-1 text-[12px] transition-all {selectedDub === 2 ? 'border-blue-500/30 bg-blue-500/5 text-blue-400' : 'border-white/[0.06] bg-[#1a1a1a] text-zinc-400 hover:border-white/[0.12] hover:text-white'}"
								>
									Server #2
								</button>
							</div>
						</div>
					</div>

					<!-- Watch More Seasons -->
					{#if seasons.length > 0}
						<div class="mt-6">
							<h3 class="mb-3 text-[13px] font-semibold">Watch more seasons of this anime</h3>
							<div class="flex gap-3">
								{#each seasons as season}
									<a href="/anime/{season.id}" class="group flex w-[240px] gap-3 rounded-lg border border-white/[0.06] bg-[#1a1a1a] p-2.5 transition-all hover:border-white/[0.12]">
										<img src={season.image} alt={season.title} class="h-16 w-12 rounded object-cover" />
										<div class="min-w-0 flex-1">
											<div class="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary uppercase">Season 1</div>
											<p class="mt-1 text-[13px] font-medium leading-tight">{season.title}</p>
											<p class="text-[11px] text-zinc-500">{season.type.replace('_', ' ')} &middot; {season.year}</p>
										</div>
									</a>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Episode List -->
					<div class="mt-6">
						<div class="mb-3 flex items-center gap-2">
							<h2 class="text-[13px] font-semibold">Episodes</h2>
							<span class="text-[12px] text-zinc-500">{anime.episodes.length}</span>
						</div>

						<!-- Filters -->
						<div class="mb-3 flex flex-wrap items-center gap-2">
							{#each filterRanges() as range}
								<button
									onclick={() => epFilter = range}
									class="rounded-md border px-2.5 py-1 text-[12px] transition-all {epFilter === range ? 'border-primary/30 bg-primary/5 text-primary' : 'border-white/[0.06] bg-[#1a1a1a] text-zinc-400 hover:border-white/[0.12] hover:text-white'}"
								>
									{range === 'all' ? 'Show All' : range}
								</button>
							{/each}
							<div class="ml-auto relative">
								<svg class="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-zinc-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35"/></svg>
								<input
									type="text"
									bind:value={epSearch}
									placeholder="Search episodes..."
									class="w-48 rounded-lg border border-white/[0.06] bg-[#1a1a1a] py-1.5 pl-8 pr-2.5 text-[12px] text-zinc-300 placeholder:text-zinc-600 focus:border-white/[0.12] focus:outline-none"
								/>
							</div>
						</div>

						<!-- Episode Items -->
						<div class="space-y-1">
							{#each filteredEpisodes as ep}
								<button
									onclick={() => switchEpisode(ep.number)}
									class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-all {ep.number === epNum ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}"
								>
									<div class="relative size-[120px] shrink-0 overflow-hidden rounded bg-zinc-800">
										<img src={ep.thumbnail} alt={ep.title} class="h-full w-full object-cover" loading="lazy" />
										<div class="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-[1px] text-[10px] text-zinc-300">{ep.duration}</div>
									</div>
									<div class="min-w-0 flex-1">
										<div class="text-[13px] font-medium {ep.number === epNum ? 'text-primary' : 'text-white'}">{ep.number}. {ep.title}</div>
										<div class="mt-0.5 text-[12px] text-zinc-500">Aired: {ep.aired}</div>
									</div>
									{#if ep.number === epNum}
										<div class="size-2 shrink-0 rounded-full bg-primary"></div>
									{/if}
								</button>
							{/each}
							{#if filteredEpisodes.length === 0}
								<div class="py-8 text-center text-[13px] text-zinc-500">No episodes found</div>
							{/if}
						</div>
					</div>

					<!-- About Anime -->
					<div class="mt-8">
						<h3 class="mb-3 text-[13px] font-semibold">About Anime</h3>
						<div class="flex gap-4 rounded-lg border border-white/[0.06] bg-[#1a1a1a] p-4">
							<div class="w-[80px] shrink-0">
								<img src={anime.image} alt={anime.title} class="w-full rounded" />
							</div>
							<div class="min-w-0 flex-1">
								<h4 class="text-[15px] font-bold">{anime.title}</h4>
								<div class="mt-1 flex flex-wrap items-center gap-2 text-[12px]">
									<span class="font-semibold text-yellow-400">{anime.rating}</span>
									<span class="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">{anime.type.replace('_', ' ')}</span>
									<span class="text-zinc-500">Episodes: {anime.totalEpisodes || anime.episodes.length || '?'}</span>
									<span class="text-zinc-500">&middot;</span>
									<span class="text-zinc-500">{anime.status}</span>
								</div>
								<p class="mt-2 text-[13px] leading-relaxed text-zinc-400">{anime.description}</p>
								<div class="mt-2 flex flex-wrap gap-1.5">
									{#each anime.genres as genre}
										<span class="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[11px] text-zinc-400">{genre}</span>
									{/each}
								</div>
								<div class="mt-2 text-[12px] text-zinc-500">
									Studio: {anime.studio || 'Unknown'} &middot; Aired: {anime.year}
								</div>
							</div>
						</div>
					</div>

					<!-- Comments -->
					<div class="mt-6">
						<div class="mb-3 flex items-center gap-3">
							<span class="text-[13px] font-semibold">Comments</span>
							<span class="text-[12px] text-zinc-500">0</span>
							<div class="ml-auto flex gap-2">
								<button class="text-[12px] text-primary">Best</button>
								<button class="text-[12px] text-zinc-500 hover:text-white">Newest</button>
								<button class="text-[12px] text-zinc-500 hover:text-white">Oldest</button>
							</div>
						</div>
						<div class="rounded-lg border border-white/[0.06] bg-[#1a1a1a] p-4">
							<div class="text-center text-zinc-500">
								<img src="/rover.jpg" alt="Profile" class="mx-auto mb-2 size-12 rounded-full" onerror={(e) => e.currentTarget.style.display = 'none'} />
								<p class="text-[13px]">No comments yet. Be the first to comment!</p>
								<p class="mt-1 text-[12px] text-zinc-600">If you don't mind, please leave a comment and share your thoughts with everyone—it will make the website even more lively! Many people are eager to read your comments!</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Sidebar -->
				<aside class="w-[280px] shrink-0 space-y-5">
					<div class="overflow-hidden rounded-lg">
						<img src={anime.image} alt={anime.title} class="w-full" />
					</div>

					<!-- Related Anime -->
					{#if relatedAnime.length > 0}
						<div>
							<h3 class="mb-3 text-[13px] font-semibold">Related Anime</h3>
							<div class="space-y-2.5">
								{#each relatedAnime as rel}
									<a
										href="/anime/{rel.id}"
										class="flex gap-3 rounded-lg border border-white/[0.06] p-2 transition-all hover:border-white/[0.12]"
									>
										<img src={rel.image} alt={rel.title} class="h-16 w-12 rounded object-cover" />
										<div class="min-w-0 flex-1">
											<p class="text-[13px] font-medium leading-tight">{rel.title}</p>
											<p class="text-[11px] text-zinc-500">{rel.type.replace('_', ' ')} &middot; {rel.year}</p>
										</div>
									</a>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Anime Details -->
					<div class="space-y-2 text-[13px]">
						<h3 class="font-semibold">Details</h3>
						<div class="space-y-1.5">
							<div class="flex justify-between">
								<span class="text-zinc-500">Score</span>
								<span class="font-semibold text-yellow-400">{anime.rating}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-zinc-500">Episodes</span>
								<span>{anime.totalEpisodes || anime.episodes.length || '?'}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-zinc-500">Status</span>
								<span class="capitalize">{anime.status}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-zinc-500">Aired</span>
								<span>{anime.year}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-zinc-500">Duration</span>
								<span>{anime.duration}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-zinc-500">Season</span>
								<span>{anime.season}</span>
							</div>
							{#if anime.studio}
								<div class="flex justify-between">
									<span class="text-zinc-500">Studio</span>
									<span>{anime.studio}</span>
								</div>
							{/if}
						</div>
					</div>

					<div class="flex flex-wrap gap-1.5">
						{#each anime.genres as genre}
							<span class="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[11px] text-zinc-400">{genre}</span>
						{/each}
					</div>

					<a
						href="/anime/{anime.id}"
						class="flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-[#1a1a1a] px-4 py-2.5 text-[13px] text-zinc-300 transition-all hover:border-white/[0.12] hover:text-white"
					>
						<svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
						View Details
					</a>
				</aside>
			</div>
		</div>

		<!-- Footer -->
		<footer class="mt-8 border-t border-white/[0.06] px-4 py-8">
			<div class="mx-auto max-w-[1400px]">
				<div class="flex items-center justify-between text-[12px] text-zinc-600">
					<div class="flex items-center gap-4">
						<img src="/logo.png" alt="AniTo" class="h-6" />
						<span>Your ultimate destination for anime streaming.</span>
					</div>
					<div class="flex items-center gap-4">
						<a href="/home" class="hover:text-zinc-400">Home</a>
						<a href="/search" class="hover:text-zinc-400">Search</a>
						<a href="/schedule" class="hover:text-zinc-400">Schedule</a>
						<a href="/my-list" class="hover:text-zinc-400">My List</a>
						<a href="/settings" class="hover:text-zinc-400">Settings</a>
					</div>
				</div>
				<div class="mt-4 text-[11px] text-zinc-700">
					AniTo does not store any files on our server, we only link to media hosted on 3rd party services.
				</div>
			</div>
		</footer>
	</div>
{/if}