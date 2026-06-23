<script lang="ts">
	import { animeList } from '$lib/data/mock';

	let selectedDay = $state(-1);
	const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
	const today = new Date();
	const currentDay = today.getDay();
	const monday = new Date(today);
	monday.setDate(today.getDate() - ((currentDay + 6) % 7));

	const weekDays = Array.from({ length: 7 }, (_, i) => {
		const date = new Date(monday);
		date.setDate(monday.getDate() + i);
		return {
			dayName: dayNames[date.getDay()],
			date: date.getDate(),
			fullDate: date,
			isToday: date.toDateString() === today.toDateString()
		};
	});

	const ongoingAnime = $derived(animeList.filter(a => a.status === 'ongoing'));

	function getDaySchedule(dayOffset: number) {
		return ongoingAnime.map(anime => ({
			anime,
			episode: anime.episodes[anime.episodes.length - 1]
		})).filter((_, i) => i % 7 === (dayOffset % 7 + 7) % 7);
	}

	let currentSchedule = $derived(
		selectedDay === -1
			? ongoingAnime.map(a => ({ anime: a, episode: a.episodes[a.episodes.length - 1] }))
				.filter(item => item.episode !== undefined)
			: getDaySchedule(selectedDay)
	);
</script>

<div class="min-h-screen bg-bg">
	<div class="relative -mt-16 h-56 sm:h-64 overflow-hidden pt-16">
		<div class="absolute inset-0 -bottom-32 overflow-hidden">
			<div class="absolute inset-0 bg-gradient-to-b from-accent-primary/[0.08] via-transparent to-transparent"></div>
			<div class="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent"></div>
		</div>
		<div class="absolute inset-x-0 bottom-0 flex items-end justify-center px-4 pb-8">
			<div class="text-center">
				<h1 class="animate-fade-in mb-2 text-4xl font-extrabold tracking-tight text-white md:text-5xl">Weekly Schedule</h1>
				<p class="animate-fade-in text-sm font-medium text-text-muted" style="animation-delay: 80ms">Keep track of your favorite anime airing times</p>
			</div>
		</div>
	</div>

	<div class="px-4 py-8 md:py-12">
		<div class="animate-fade-in flex items-center gap-2 overflow-x-auto scroll-hidden pb-4 mb-8 md:justify-center" style="animation-delay: 160ms">
			{#each weekDays as day, i}
				<button
					class="relative flex h-[70px] min-w-[70px] flex-shrink-0 flex-col items-center justify-center rounded-2xl border transition-all duration-300 {selectedDay === i ? 'border-accent-primary/40 bg-accent-primary/10 text-white' : 'border-transparent bg-[#18181b]/50 text-text-muted hover:bg-[#18181b] hover:text-white'}"
					aria-label={day.fullDate.toDateString()}
					onclick={() => selectedDay = i}>
					{#if day.isToday}
						<span class="absolute -top-1 -right-1 flex h-2.5 w-2.5">
							<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-primary opacity-60"></span>
							<span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-primary shadow-[0_0_8px_rgba(124,58,237,0.8)]"></span>
						</span>
					{/if}
					<span class="mb-0.5 text-[10px] font-bold tracking-widest uppercase opacity-70">{day.dayName}</span>
					<span class="text-xl font-bold">{day.date}</span>
				</button>
			{/each}
		</div>

		<div class="animate-fade-in relative mx-auto w-full max-w-7xl md:px-10" style="animation-delay: 100ms">
			<div class="relative flex flex-col gap-6 pb-20">
				<div class="absolute top-4 bottom-0 left-[28px] z-0 w-px bg-white/[0.08] md:left-1/2 md:-translate-x-1/2"></div>

				{#if currentSchedule.length === 0}
					<div class="relative z-10 flex flex-col items-center justify-center py-16 text-center">
						<div class="w-16 h-16 rounded-2xl bg-card flex items-center justify-center mb-4">
							<svg class="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
							</svg>
						</div>
						<p class="text-text-muted text-sm">No episodes scheduled for this day</p>
						<p class="text-text-muted/50 text-xs mt-1">Check another day for upcoming releases</p>
					</div>
				{:else}
					{#each currentSchedule as { anime, episode }, i}
						<div class="relative z-10 flex flex-col md:flex-row md:items-start gap-4 animate-fade-in group" style="animation-delay: {i * 60}ms">
							<div class="hidden md:flex md:w-1/2 md:justify-end md:pr-8 md:text-right {i % 2 === 1 ? 'md:order-2' : ''}">
								{#if i % 2 === 0}
									<div class="pt-2">
										<span class="text-xs font-bold text-accent-primary tracking-wider uppercase">Episode {episode?.number}</span>
										<p class="text-xs text-text-muted mt-0.5">{episode?.duration} &middot; {episode?.aired}</p>
									</div>
								{/if}
							</div>
							<div class="hidden md:flex md:items-center md:justify-center md:w-8 md:flex-shrink-0 {i % 2 === 1 ? 'md:order-1' : ''}">
								<div class="w-3 h-3 rounded-full bg-accent-primary/30 border-2 border-accent-primary shadow-lg shadow-accent-primary/20"></div>
							</div>
							<div class="hidden md:block md:w-1/2 md:pl-8 {i % 2 === 1 ? 'md:order-3 md:pl-0 md:pr-8 md:text-right' : ''}">
								{#if i % 2 === 1}
									<div class="pt-2">
										<span class="text-xs font-bold text-accent-primary tracking-wider uppercase">Episode {episode?.number}</span>
										<p class="text-xs text-text-muted mt-0.5">{episode?.duration} &middot; {episode?.aired}</p>
									</div>
								{/if}
							</div>
							<div class="flex md:hidden items-center gap-3 pl-12">
								<div class="w-2.5 h-2.5 rounded-full bg-accent-primary/30 border-2 border-accent-primary flex-shrink-0"></div>
								<span class="text-xs font-bold text-accent-primary tracking-wider uppercase">Episode {episode?.number}</span>
								<span class="text-xs text-text-muted">&middot; {episode?.duration}</span>
							</div>
							<a href="/anime/{anime.id}/watch?ep={episode?.number}"
								class="ml-12 md:ml-0 flex items-center gap-4 p-3 rounded-xl bg-card hover:bg-white/[0.06] transition-all duration-300 {i % 2 === 1 ? 'md:order-2 md:mr-auto md:flex-row-reverse' : 'md:ml-auto'} md:w-[480px]">
								<div class="w-14 h-20 md:w-16 md:h-22 flex-shrink-0 rounded-lg overflow-hidden">
									<img src={anime.image} alt={anime.title} class="w-full h-full object-cover" loading="lazy" />
								</div>
								<div class="flex-1 min-w-0">
									<h3 class="text-sm font-semibold text-text-primary truncate group-hover:text-accent-primary transition-colors">{anime.title}</h3>
									<p class="text-xs text-text-muted truncate mt-0.5">Ep {episode?.number}: {episode?.title}</p>
									<div class="flex items-center gap-2 mt-1.5">
										{#each anime.genres.slice(0, 2) as genre}
											<span class="px-2 py-0.5 rounded-full text-[10px] bg-accent-primary/10 text-accent-primary">{genre}</span>
										{/each}
										<span class="flex items-center gap-1 text-yellow-400 text-[10px] ml-auto">
											<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
											{anime.rating}
										</span>
									</div>
								</div>
								<div class="w-9 h-9 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-primary/30 transition-all">
									<svg class="w-4 h-4 text-accent-primary ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
								</div>
							</a>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>
