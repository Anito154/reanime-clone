<script lang="ts">
	import {
	animeList,
	ongoing,
	latestEpisodes,
	continueWatching as cwItems,
	getAnimeById,
	trending
} from '$lib/data/store.svelte';

	interface HeroSlide {
		title: string;
		desc: string;
		bg: string;
		mobileBg: string;
		rating: string;
		format: string;
		year: string;
		link: string;
	}

	interface ScheduleItem {
		title: string;
		id: string;
		ep: number;
		time: string;
		duration: string;
		image: string;
	}

	interface ContinueWatchingItem {
		anime: (typeof animeList)[number];
		episode: string;
		progress: number;
	}

	const heroSlides: HeroSlide[] = $derived.by(() => {
		const top = animeList
			.filter(a => a.image && a.title)
			.sort((a, b) => b.rating - a.rating)
			.slice(0, 4);
		if (top.length === 0) return [];
		return top.map(a => ({
			title: a.title,
			desc: a.description || `${a.title} — ${a.type} anime from ${a.year || 'Unknown'}. Genres: ${a.genres.join(', ') || 'Various'}.`,
			bg: a.image,
			mobileBg: a.image,
			rating: a.rating > 0 ? a.rating.toFixed(1) : 'N/A',
			format: a.type.replace('_', ' '),
			year: String(a.year || ''),
			link: `/anime/${a.id}`
		}));
	});

	const trendingDisplay = $derived(
		(trending.length > 0 ? trending : animeList).slice(0, 10)
	);
	const latest = $derived(latestEpisodes.slice(0, 12));
	const filteredOngoing = $derived(ongoing.filter((item): item is (typeof animeList)[number] => item !== undefined));
	const continueWatchingList = $derived<ContinueWatchingItem[]>(
		cwItems
			.map((cw) => ({
				anime: getAnimeById(cw.animeId),
				episode: `Episode ${getAnimeById(cw.animeId)?.totalEpisodes || getAnimeById(cw.animeId)?.episodes.length || '?'}`,
				progress: cw.progress
			}))
			.filter((item): item is ContinueWatchingItem => item.anime !== undefined)
	);

	const scheduleDays = [
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday'
	];

	const scheduleTimes = [
		'06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
		'09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
		'12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
		'15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
		'18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
		'21:00', '21:30', '22:00'
	];

	const scheduleData = $derived.by((): Record<string, ScheduleItem[]> => {
		const data: Record<string, ScheduleItem[]> = {};
		scheduleDays.forEach((day, i) => {
			const startIdx = (i * 3) % animeList.length;
			const timeOffset = i * 2;
			data[day] = animeList.slice(startIdx, startIdx + 10).map((a, j) => ({
				title: a.title,
				id: a.id,
				ep: a.totalEpisodes,
				time:
					scheduleTimes[(timeOffset + j) % scheduleTimes.length] ||
					`${String(6 + (j % 12)).padStart(2, '0')}:00`,
				duration: a.duration,
				image: a.image
			}));
		});
		return data;
	});

	let currentSlide = $state(0);
	let activeScheduleDay = $state('Monday');
	let scheduleOffset = $state(0);
	let showAllSchedule = $state(false);
	let hiddenContinueWatching = $state<string[]>([]);
	let trendingTab = $state<'Day' | 'Week' | 'Month'>('Day');
	let latestFilter = $state<'All' | 'Sub' | 'Dub'>('All');

	let latestOffset = $state(0);
	const latestPageSize = 12;
	const latestPage = $derived(latest.slice(latestOffset, latestOffset + latestPageSize));

	function goToPrevLatest() {
		latestOffset = Math.max(0, latestOffset - latestPageSize);
	}

	function goToNextLatest() {
		latestOffset = Math.min(
			(latest.length - 1) - ((latest.length - 1) % latestPageSize),
			latestOffset + latestPageSize
		);
	}

	let ongoingOffset = $state(0);
	const ongoingPageSize = 12;
	const ongoingPage = $derived(filteredOngoing.slice(ongoingOffset, ongoingOffset + ongoingPageSize));

	function goToPrevOngoing() {
		ongoingOffset = Math.max(0, ongoingOffset - ongoingPageSize);
	}

	function goToNextOngoing() {
		ongoingOffset = Math.min(
			(filteredOngoing.length - 1) - ((filteredOngoing.length - 1) % ongoingPageSize),
			ongoingOffset + ongoingPageSize
		);
	}

	let filteredContinueWatching = $derived(
		continueWatchingList.filter((item) => !hiddenContinueWatching.includes(item.anime.id))
	);

	let visibleScheduleDays = $derived(scheduleDays.slice(scheduleOffset, scheduleOffset + 3));

	$effect(() => {
		const interval = setInterval(() => {
			currentSlide = (currentSlide + 1) % heroSlides.length;
		}, 5000);
		return () => clearInterval(interval);
	});

	function goToPrevSlide() {
		currentSlide = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
	}

	function goToNextSlide() {
		currentSlide = (currentSlide + 1) % heroSlides.length;
	}

	function goToSlide(index: number) {
		currentSlide = index;
	}

	function removeFromContinueWatching(id: string) {
		hiddenContinueWatching = [...hiddenContinueWatching, id];
	}

	function prevScheduleOffset() {
		const dayIndex = scheduleDays.indexOf(activeScheduleDay);
		if (dayIndex > 0) {
			activeScheduleDay = scheduleDays[dayIndex - 1];
			if (dayIndex - 1 < scheduleOffset) {
				scheduleOffset = Math.max(0, dayIndex - 1);
			}
		}
	}

	function nextScheduleOffset() {
		const dayIndex = scheduleDays.indexOf(activeScheduleDay);
		if (dayIndex < scheduleDays.length - 1) {
			activeScheduleDay = scheduleDays[dayIndex + 1];
			if (dayIndex + 1 >= scheduleOffset + 3) {
				scheduleOffset = Math.min(scheduleDays.length - 3, dayIndex + 1 - 2);
			}
		}
	}

	function setActiveDay(day: string) {
		activeScheduleDay = day;
	}
</script>

<div class="flex min-h-[100dvh] flex-col">
	<header
		class="fixed top-0 right-0 left-0 z-[10000] border-b"
		style="border-color: rgba(255, 255, 255, 0)"
	>
		<div class="absolute inset-0 z-[-1] bg-black/80 backdrop-blur-2xl" style="opacity: 0;"></div>
		<div
			class="pointer-events-none absolute inset-y-0 left-0 z-[-2] w-64 bg-gradient-to-r from-black/80 to-transparent md:w-[400px]"
			style="opacity: 1; -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%); mask-image: linear-gradient(to bottom, black 50%, transparent 100%);"
		></div>
		<div
			class="pointer-events-none absolute inset-y-0 right-0 z-[-2] w-48 bg-gradient-to-l from-black/80 to-transparent md:w-64"
			style="opacity: 1; -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%); mask-image: linear-gradient(to bottom, black 50%, transparent 100%);"
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

	<main class="flex-1 pt-16 pb-0">
		<div class="-mt-16 text-white">
			<section class="mb-8">
				<div
					class="relative h-[70vh] w-full overflow-hidden select-none sm:h-[60vh] lg:h-[70vh]"
					role="region"
					aria-label="Hero carousel"
					style="cursor: grab"
				>
					{#each heroSlides as slide, i}
						<div
							class="absolute inset-0 transition-opacity duration-700 ease-out"
							class:opacity-100={i === currentSlide}
							class:opacity-0={i !== currentSlide}
						>
							<div
								class="absolute inset-0 hidden bg-cover bg-center transition-transform duration-[6000ms] ease-out sm:block"
								style="background-image: url({slide.bg}); transform: scale({i === currentSlide ? 1.1 : 1})"
							>
								<div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
								<div class="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
							</div>
							<div
								class="absolute inset-0 bg-cover bg-top transition-transform duration-[6000ms] ease-out sm:hidden"
								style="background-image: url({slide.mobileBg}); transform: scale({i === currentSlide ? 1.1 : 1})"
							>
								<div class="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
							</div>
						</div>
					{/each}

					{#if heroSlides.length > 0}
					<div class="absolute right-0 bottom-0 left-0 z-20 p-6 sm:p-10 lg:p-16">
						<div class="max-w-2xl text-center sm:text-left">
							<div class="mb-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
								<span class="rounded bg-black/80 px-2 py-1 text-sm font-semibold text-primary"
									>★ {heroSlides[currentSlide].rating}</span
								>
								<span class="rounded bg-black/80 px-2 py-1 text-sm font-semibold text-primary"
									>{heroSlides[currentSlide].format}</span
								>
								<span class="rounded bg-black/80 px-2 py-1 text-sm font-semibold text-primary"
									>{heroSlides[currentSlide].year}</span
								>
							</div>
							<h1
								class="mb-4 line-clamp-1 text-2xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl"
							>
								{heroSlides[currentSlide].title}
							</h1>
							<p class="mx-auto mb-4 line-clamp-3 max-w-xl text-sm text-gray-300 sm:mx-0 sm:text-base">
								{heroSlides[currentSlide].desc}
							</p>
							<div class="mt-4 flex items-center justify-center gap-3 sm:justify-start sm:gap-4 lg:gap-6">
								<a
									href={heroSlides[currentSlide].link}
									class="group relative flex -skew-x-12 items-center justify-center overflow-hidden bg-primary px-5 py-2 transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-primary/50 sm:px-8 sm:py-3"
								>
									<div class="absolute -top-1.5 -left-1.5 flex size-5 items-center justify-center bg-black/20"></div>
									<div class="absolute -right-1.5 -bottom-1.5 flex size-5 items-center justify-center bg-white/20"></div>
									<div
										class="pointer-events-none absolute inset-0 flex h-full w-full [transform:translateX(-150%)] justify-center group-hover:[transform:translateX(150%)] group-hover:duration-1000"
									>
										<div class="relative h-full w-12 bg-white/40 blur-[2px]"></div>
									</div>
									<div class="relative z-10 flex skew-x-12 items-center gap-2 text-xs font-black tracking-[0.2em] text-black uppercase sm:text-sm">
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
											class="size-4 fill-current sm:size-5"
										><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"></path></svg>
										<span>Watch Now</span>
									</div>
								</a>
								<a
									href={heroSlides[currentSlide].link}
									class="group relative flex -skew-x-12 items-center justify-center overflow-hidden border border-white/20 bg-black/60 px-5 py-2 transition-all duration-300 hover:scale-105 hover:border-primary/80 hover:bg-black/80 sm:px-8 sm:py-3"
								>
									<div class="absolute top-0 right-0 h-full w-1 bg-white/10 transition-colors group-hover:bg-primary/50"></div>
									<div class="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
									<div class="relative z-10 flex skew-x-12 items-center gap-2 text-xs font-bold tracking-[0.2em] text-white uppercase sm:text-sm">
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
											class="size-4 transition-transform group-hover:rotate-12 sm:size-5"
										><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
										<span>Details</span>
									</div>
								</a>
							</div>
						</div>
					</div>

					<div class="absolute top-20 right-4 z-40 flex gap-2">
						<button
							onclick={goToPrevSlide}
							class="rounded border border-white/10 bg-black/60 p-2 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/80"
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
								class="size-5"
							><path d="m15 18-6-6 6-6"></path></svg>
						</button>
						<button
							onclick={goToNextSlide}
							class="rounded border border-white/10 bg-black/60 p-2 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/80"
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
								class="size-5"
							><path d="m9 18 6-6-6-6"></path></svg>
						</button>
					</div>
					{/if}

					<div class="absolute right-6 bottom-6 hidden items-center gap-2 sm:right-10 sm:bottom-10 sm:flex">
						{#each heroSlides as slide, i}
							<button
								onclick={() => goToSlide(i)}
								aria-label="Go to {slide.title}"
								class="h-1.5 rounded-full transition-all duration-500 {i === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-white/30 hover:bg-white/50'}"
							></button>
						{/each}
					</div>
				</div>
			</section>

			<div class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
				<div class="grid grid-cols-1 gap-6 lg:grid-cols-12 xl:gap-8">
					<div class="lg:col-span-8 xl:col-span-9">
						{#if filteredContinueWatching.length > 0}
							<section class="mb-8">
								<div class="mb-4 flex items-center justify-between">
									<div class="flex items-center gap-3">
										<div class="h-6 w-1 rounded-full bg-primary"></div>
										<h2 class="text-lg font-bold sm:text-xl">Continue Watching</h2>
									</div>
									<a
										href="/continue-watching"
										class="text-xs font-medium text-primary transition-colors hover:text-primary/80 sm:text-sm"
									>
										View All
									</a>
								</div>
								<div class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
									{#each filteredContinueWatching as { anime: item, episode, progress }}
										<div class="group relative transition-all duration-300 hover:-translate-y-1">
											<a href="/anime/{item.id}">
												<div
													class="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#141414]"
													style="background: url({item.image}) center/cover no-repeat #141414"
												>
													<div
														class="absolute top-2 left-2 z-10 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold text-primary sm:text-xs"
													>
														{progress}%
													</div>
													<div class="absolute left-0 right-0 bottom-0 h-1 bg-white/10">
														<div class="h-full bg-primary transition-all" style="width: {progress}%"></div>
													</div>
													<div
														class="absolute inset-0 z-10 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
													>
														<div
															class="flex size-10 items-center justify-center rounded-full bg-primary shadow-[0_0_20px_rgba(0,0,0,0.5)] sm:size-12"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="24"
																height="24"
																viewBox="0 0 24 24"
																fill="currentColor"
																stroke="none"
																class="ml-0.5 size-4 text-black sm:size-5"
															><path d="M8 5v14l11-7z"></path></svg>
														</div>
													</div>
												</div>
											</a>
											<button
												onclick={() => removeFromContinueWatching(item.id)}
												class="absolute -top-2 -right-2 z-20 flex size-5 items-center justify-center rounded-full bg-black/80 text-gray-400 transition-all hover:bg-red-500 hover:text-white sm:size-6"
												aria-label="Remove from continue watching"
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
													class="size-3 sm:size-3.5"
												><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
											</button>
											<div class="mt-1.5 px-0.5">
												<h3 class="line-clamp-1 text-xs font-semibold sm:text-sm">{item.title}</h3>
												<p class="mt-0.5 text-[10px] text-gray-500 sm:text-xs">{episode}</p>
											</div>
										</div>
									{/each}
								</div>
							</section>
						{/if}

						<section class="mb-8">
							<div class="mb-4 flex items-center justify-between">
								<div class="flex items-center gap-3">
									<div class="h-6 w-1 rounded-full bg-primary"></div>
									<h2 class="text-lg font-bold sm:text-xl">Latest Episodes</h2>
								</div>
								<div class="flex items-center gap-2">
									<div class="flex items-center gap-1 rounded-lg bg-white/[0.04] p-0.5">
										<button
											onclick={() => (latestFilter = 'All')}
											class="rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-300 {latestFilter === 'All' ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white'}"
										>
											All
										</button>
										<button
											onclick={() => (latestFilter = 'Sub')}
											class="rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-300 {latestFilter === 'Sub' ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white'}"
										>
											Sub
										</button>
										<button
											onclick={() => (latestFilter = 'Dub')}
											class="rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-300 {latestFilter === 'Dub' ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white'}"
										>
											Dub
										</button>
									</div>
									<button
										onclick={goToPrevLatest}
										disabled={latestOffset === 0}
										class="rounded border border-white/10 bg-black/40 p-1.5 text-gray-400 transition-all hover:bg-black/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
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
											class="size-4"
										><path d="m15 18-6-6 6-6"></path></svg>
									</button>
									<button
										onclick={goToNextLatest}
										disabled={latestOffset + latestPageSize >= latest.length}
										class="rounded border border-white/10 bg-black/40 p-1.5 text-gray-400 transition-all hover:bg-black/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
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
											class="size-4"
										><path d="m9 18 6-6-6-6"></path></svg>
									</button>
								</div>
							</div>
							<div class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
								{#each latestPage as { anime: item }}
									<a
										href="/anime/{item.id}"
										class="group transition-all duration-300 hover:-translate-y-1"
									>
										<div
											class="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#141414]"
											style="background: url({item.image}) center/cover no-repeat #141414"
										>
											<div
												class="absolute top-2 left-2 z-10 flex items-center gap-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold text-primary sm:text-xs"
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
													class="size-3"
												><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"></path></svg>
												<span>{item.totalEpisodes || item.episodes.length || '?'}</span>
											</div>
											<div
												class="absolute top-2 right-2 z-10 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold text-primary sm:text-xs"
											>
												★ {item.rating > 0 ? item.rating.toFixed(1) : '?'}
											</div>
											<div
												class="absolute inset-0 z-10 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
											>
												<div
													class="flex size-10 items-center justify-center rounded-full bg-primary shadow-[0_0_20px_rgba(0,0,0,0.5)] sm:size-12"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="24"
														height="24"
														viewBox="0 0 24 24"
														fill="currentColor"
														stroke="none"
														class="ml-0.5 size-4 text-black sm:size-5"
													><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"></path></svg>
												</div>
											</div>
										</div>
										<div class="mt-1.5 px-0.5">
											<h3 class="line-clamp-1 text-xs font-semibold sm:text-sm">{item.title}</h3>
											<p class="mt-0.5 text-[10px] text-gray-500 sm:text-xs">
												{item.type.replace('_', ' ')} • EP {item.totalEpisodes || item.episodes.length || '?'}
											</p>
										</div>
									</a>
								{/each}
							</div>
						</section>

						<section class="mb-8">
							<div class="mb-4 flex items-center gap-3">
								<div class="flex items-center gap-3">
									<div class="h-6 w-1 rounded-full bg-primary"></div>
									<h2 class="text-lg font-bold sm:text-xl">Ongoing</h2>
								</div>
								<div class="ml-auto flex items-center gap-2">
									<button
										onclick={goToPrevOngoing}
										disabled={ongoingOffset === 0}
										class="rounded border border-white/10 bg-black/40 p-1.5 text-gray-400 transition-all hover:bg-black/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
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
											class="size-4"
										><path d="m15 18-6-6 6-6"></path></svg>
									</button>
									<button
										onclick={goToNextOngoing}
										disabled={ongoingOffset + ongoingPageSize >= filteredOngoing.length}
										class="rounded border border-white/10 bg-black/40 p-1.5 text-gray-400 transition-all hover:bg-black/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
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
											class="size-4"
										><path d="m9 18 6-6-6-6"></path></svg>
									</button>
								</div>
							</div>
							<div class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
								{#each ongoingPage as item}
									<a
										href="/anime/{item.id}"
										class="group transition-all duration-300 hover:-translate-y-1"
									>
										<div
											class="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#141414]"
											style="background: url({item.image}) center/cover no-repeat #141414"
										>
											<div
												class="absolute top-2 right-2 z-10 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold text-primary sm:text-xs"
											>
												★ {item.rating > 0 ? item.rating.toFixed(1) : '?'}
											</div>
											<div
												class="absolute inset-0 z-10 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
											>
												<div
													class="flex size-10 items-center justify-center rounded-full bg-primary shadow-[0_0_20px_rgba(0,0,0,0.5)] sm:size-12"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="24"
														height="24"
														viewBox="0 0 24 24"
														fill="currentColor"
														stroke="none"
														class="ml-0.5 size-4 text-black sm:size-5"
													><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"></path></svg>
												</div>
											</div>
										</div>
										<div class="mt-1.5 px-0.5">
											<h3 class="line-clamp-1 text-xs font-semibold sm:text-sm">{item.title}</h3>
											<p class="mt-0.5 text-[10px] text-gray-500 sm:text-xs">
												{item.type.replace('_', ' ')} • {item.year}
											</p>
										</div>
									</a>
								{/each}
							</div>
						</section>
					</div>

					<aside class="lg:col-span-4 xl:col-span-3">
						<section class="mb-6">
							<div class="mb-5 flex items-center justify-between">
								<h2 class="text-xl font-bold tracking-tight text-white/90">Top Trending</h2>
								<div class="flex rounded-lg border border-white/5 bg-[#141414] p-1">
									<button
										onclick={() => (trendingTab = 'Day')}
										class="relative rounded-md px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-all duration-300 ease-out {trendingTab === 'Day' ? 'text-white shadow-lg' : 'text-white/40 hover:text-white/70'}"
									>
										{#if trendingTab === 'Day'}
											<div
												class="absolute inset-0 rounded-md border border-white/10 bg-white/10"
											></div>
										{/if}
										<span class="relative z-10">Day</span>
									</button>
									<button
										onclick={() => (trendingTab = 'Week')}
										class="relative rounded-md px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-all duration-300 ease-out {trendingTab === 'Week' ? 'text-white shadow-lg' : 'text-white/40 hover:text-white/70'}"
									>
										{#if trendingTab === 'Week'}
											<div
												class="absolute inset-0 rounded-md border border-white/10 bg-white/10"
											></div>
										{/if}
										<span class="relative z-10">Week</span>
									</button>
									<button
										onclick={() => (trendingTab = 'Month')}
										class="relative rounded-md px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-all duration-300 ease-out {trendingTab === 'Month' ? 'text-white shadow-lg' : 'text-white/40 hover:text-white/70'}"
									>
										{#if trendingTab === 'Month'}
											<div
												class="absolute inset-0 rounded-md border border-white/10 bg-white/10"
											></div>
										{/if}
										<span class="relative z-10">Month</span>
									</button>
								</div>
							</div>
							<div class="space-y-3">
								{#each trendingDisplay as item, i}
									<a
										href="/anime/{item.id}"
										class="group relative flex h-[100px] overflow-hidden rounded-xl border border-white/5 bg-[#0a0a0a] transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
										style="animation-delay: {i * 50}ms;"
									>
										<div
											class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
											style="background-image: url({item.image.replace('/medium/', '/large/')})"
										></div>
										<div class="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/85 to-transparent"></div>
										<div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
										<div
											class="relative z-10 flex h-full w-full items-center px-4 transition-transform duration-300 group-hover:scale-[1.02]"
										>
											<div class="relative flex w-12 shrink-0 items-center justify-center">
												<div
													class="absolute flex h-8 w-8 items-center justify-center rounded-md bg-zinc-800/90 text-xs font-bold text-white/80"
												>
													{i + 1}
												</div>
											</div>
											<div class="ml-5 flex min-w-0 flex-1 flex-col justify-center gap-1.5">
												<p
													class="truncate text-sm font-semibold text-white group-hover:text-primary/90 transition-colors duration-300"
												>
													{item.title}
												</p>
												<div class="flex items-center gap-2.5">
													<span class="text-xs text-primary"
														>★ {item.rating > 0 ? item.rating.toFixed(1) : '?'}</span
													>
													<span class="text-xs text-gray-500">{item.type.replace('_', ' ')}</span>
													<span class="rounded bg-white/5 px-2 py-0.5 text-[10px] text-gray-400"
														>{item.totalEpisodes || item.episodes.length} EP</span
													>
												</div>
											</div>
											<div
												class="ml-4 flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-all duration-300 hover:border-primary/50 hover:text-primary hover:bg-primary/10 group-hover:scale-110"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="24"
													height="24"
													viewBox="0 0 24 24"
													fill="currentColor"
													class="size-5 ml-0.5 transition-transform duration-300 group-hover:scale-110"
												><path d="M8 5v14l11-7z"></path></svg>
											</div>
										</div>
									</a>
								{/each}
							</div>
						</section>

						<section>
							<div class="relative min-h-[580px] overflow-hidden rounded-xl border border-white/10 bg-zinc-900/80 p-4 transition-all duration-300">
								<div class="mb-4 flex items-center justify-between border-b border-white/5 pb-4">
									<button
										onclick={prevScheduleOffset}
										class="flex size-9 items-center justify-center rounded-full bg-zinc-800/80 transition-all duration-300 hover:bg-zinc-700/80"
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
											class="size-4 text-gray-400"
										><path d="m15 18-6-6 6-6"></path></svg>
									</button>
									<div class="flex items-center gap-6">
										{#each visibleScheduleDays as day}
											<button
												onclick={() => setActiveDay(day)}
												class="flex flex-col items-center gap-1.5"
											>
												<span
													class="rounded-md text-xs font-medium transition-colors duration-300 {activeScheduleDay === day ? 'text-primary' : 'text-gray-500'}"
												>
													{day.slice(0, 3)}
												</span>
												<div
													class="flex h-8 w-16 items-center justify-center rounded-lg transition-all duration-300 {activeScheduleDay === day ? 'bg-primary shadow-sm shadow-primary/30' : 'bg-zinc-800'}"
												>
													<span
														class="text-xs font-bold {activeScheduleDay === day ? 'text-black' : 'text-gray-400'}"
													>
														{String(scheduleData[day].length).padStart(2, '0')}
													</span>
												</div>
											</button>
										{/each}
									</div>
									<button
										onclick={nextScheduleOffset}
										class="flex size-9 items-center justify-center rounded-full bg-zinc-800/80 transition-all duration-300 hover:bg-zinc-700/80"
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
											class="size-4 text-gray-400"
										><path d="m9 18 6-6-6-6"></path></svg>
									</button>
								</div>
								<div class="space-y-1">
									{#each scheduleData[activeScheduleDay].slice(0, showAllSchedule ? undefined : 10) as item}
										<a
											href="/anime/{item.id}"
											class="group flex h-10 items-center justify-between rounded-lg px-4 transition-all duration-200 hover:bg-white/[0.03]"
										>
											<div class="flex min-w-0 flex-1 items-center gap-0">
												<div class="w-12 shrink-0 text-right">
													<span class="text-xs font-medium text-gray-500">{item.time}</span>
												</div>
												<div class="relative flex h-full w-8 shrink-0 items-center justify-center">
													<div class="absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.02]"></div>
													<div
														class="absolute left-1/2 top-1/2 -mt-px -ml-[2.5px] h-px w-[5px] bg-white/10 transition-all duration-300 group-hover:bg-primary/50"
													></div>
												</div>
												<span
													class="ml-3 truncate text-xs font-medium text-white/80 group-hover:text-white transition-colors duration-200"
												>
													{item.title}
												</span>
											</div>
											<div class="ml-4 flex shrink-0 items-center gap-2">
												<span
													class="inline-flex h-4 items-center rounded bg-primary/20 px-1.5 text-[10px] font-medium text-primary"
												>
													{item.ep} EP
												</span>
												<span class="text-[10px] font-medium text-gray-500">{item.duration}</span>
											</div>
										</a>
									{/each}
								</div>
								<div class="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
									<span class="text-xs text-gray-500"
										>{activeScheduleDay} • {scheduleData[activeScheduleDay].length} shows</span
									>
									<button
										onclick={() => (showAllSchedule = !showAllSchedule)}
										class="text-xs font-medium text-primary transition-colors hover:text-primary/80"
									>
										{showAllSchedule ? 'Less' : 'More'}
									</button>
								</div>
							</div>
						</section>
					</aside>
				</div>
			</div>

			<footer class="mt-12 border-t border-white/[0.06]">
				<div class="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8 xl:px-12">
					<div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
						<div class="max-w-md">
							<div class="mb-3 flex items-center gap-2">
								<div
									class="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-extrabold text-black sm:size-9 sm:text-base"
								>
									A
								</div>
								<h3 class="text-base font-bold sm:text-lg">Re:ANIME</h3>
							</div>
							<p class="text-xs leading-relaxed text-gray-400 sm:text-sm">
								Your ultimate destination for streaming anime. Watch the latest episodes, discover
								new series, and connect with fellow anime enthusiasts.
							</p>
							<div class="mt-4 flex gap-3 sm:mt-6 sm:gap-4">
								<a
									href="https://twitter.com"
									target="_blank"
									rel="noopener noreferrer"
									class="group rounded-lg p-1.5 text-gray-400 transition-all duration-300 hover:bg-primary/10 hover:text-primary sm:p-2"
									aria-label="Twitter"
								>
									<svg
										class="size-4 transition-transform duration-300 group-hover:scale-110 sm:size-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg>
								</a>
								<a
									href="https://discord.com/invite/QsqcnsryyK"
									target="_blank"
									rel="noopener noreferrer"
									class="group rounded-lg p-1.5 text-gray-400 transition-all duration-300 hover:bg-primary/10 hover:text-primary sm:p-2"
									aria-label="Discord"
								>
									<svg
										class="size-4 transition-transform duration-300 group-hover:scale-110 sm:size-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.076.076 0 00-.0416.1057c.3604.7.772 1.3648 1.226 1.9942a.076.076 0 00.0842.0276c1.961-.6097 3.9495-1.5248 5.9929-3.0294a.077.077 0 00.0312-.0561c.5004-5.053-.838-9.551-3.549-12.9879zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"></path></svg>
								</a>
								<a
									href="https://www.reddit.com/r/reanime"
									target="_blank"
									rel="noopener noreferrer"
									class="group rounded-lg p-1.5 text-gray-400 transition-all duration-300 hover:bg-primary/10 hover:text-primary sm:p-2"
									aria-label="Reddit"
								>
									<svg
										class="size-4 transition-transform duration-300 group-hover:scale-110 sm:size-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.66 7.082c-.798 0-1.44.644-1.44 1.44s.642 1.44 1.44 1.44 1.44-.644 1.44-1.44-.642-1.44-1.44-1.44zm5.76 0c-.798 0-1.44.644-1.44 1.44s.642 1.44 1.44 1.44 1.44-.644 1.44-1.44-.642-1.44-1.44-1.44z"></path></svg>
								</a>
							</div>
						</div>
						<div class="flex flex-wrap gap-6 sm:gap-10">
							<div>
								<h4 class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-300 sm:text-sm">
									Links
								</h4>
								<div class="flex flex-col gap-2">
									<button
										class="cursor-pointer border-0 bg-transparent p-0 text-left text-xs text-gray-400 transition-colors duration-300 hover:text-primary sm:text-sm"
									>
										Privacy
									</button>
									<button
										class="cursor-pointer border-0 bg-transparent p-0 text-left text-xs text-gray-400 transition-colors duration-300 hover:text-primary sm:text-sm"
									>
										Terms
									</button>
									<button
										class="cursor-pointer border-0 bg-transparent p-0 text-left text-xs text-gray-400 transition-colors duration-300 hover:text-primary sm:text-sm"
									>
										Contact
									</button>
									<button
										class="cursor-pointer border-0 bg-transparent p-0 text-left text-xs text-gray-400 transition-colors duration-300 hover:text-primary sm:text-sm"
									>
										Status
									</button>
								</div>
							</div>
						</div>
					</div>
					<div class="mt-4 border-t border-white/10 pt-3 sm:mt-6 sm:pt-4">
						<div class="flex flex-col gap-2 text-xs text-gray-400 sm:text-sm">
							<p>© 2026 Re:ANIME. All rights reserved.</p>
							<p class="text-[10px] leading-relaxed text-gray-500 sm:text-xs">
								Re:ANIME does not store any files on our server, we only link to media hosted on
								3rd party services.
							</p>
							<div class="flex flex-wrap gap-3 sm:gap-6">
								<button
									class="cursor-pointer border-0 bg-transparent p-0 text-xs text-gray-400 transition-colors duration-300 hover:text-primary sm:text-sm"
								>
									Privacy
								</button>
								<button
									class="cursor-pointer border-0 bg-transparent p-0 text-xs text-gray-400 transition-colors duration-300 hover:text-primary sm:text-sm"
								>
									Terms
								</button>
								<button
									class="cursor-pointer border-0 bg-transparent p-0 text-xs text-gray-400 transition-colors duration-300 hover:text-primary sm:text-sm"
								>
									Contact
								</button>
								<button
									class="cursor-pointer border-0 bg-transparent p-0 text-xs text-gray-400 transition-colors duration-300 hover:text-primary sm:text-sm"
								>
									Status
								</button>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	</main>
</div>
