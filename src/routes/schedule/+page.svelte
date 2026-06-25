<script lang="ts">
	import { fetchSchedule } from '$lib/data/store.svelte';
	import { onMount } from 'svelte';

	let schedule = $state<{ day: string; anime_list: { title: string; slug: string; poster: string }[] }[]>([]);
	let selectedDay = $state(-1);
	let loading = $state(true);

	const dayNames: Record<string, string> = {
		Senin: 'MON', Selasa: 'TUE', Rabu: 'WED', Kamis: 'THU', Jumat: 'FRI', Sabtu: 'SAT', Minggu: 'SUN', Random: 'RDM'
	};

	const today = new Date();
	const monday = new Date(today);
	monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

	const weekDays = Array.from({ length: 7 }, (_, i) => {
		const date = new Date(monday);
		date.setDate(monday.getDate() + i);
		return {
			dayName: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][date.getDay()],
			date: date.getDate(),
			fullDate: date,
			isToday: date.toDateString() === today.toDateString()
		};
	});

	let filteredSchedule = $derived(
		selectedDay === -1 ? schedule : schedule.filter(s => {
			const idx = Object.values(dayNames).indexOf(weekDays[selectedDay]?.dayName || '');
			const dayKey = Object.keys(dayNames)[idx];
			return s.day === dayKey;
		})
	);

	onMount(async () => {
		try {
			const data = await fetchSchedule();
			schedule = data;
		} catch {}
		loading = false;
	});
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

				{#if loading}
					<div class="flex items-center justify-center py-16 text-zinc-500">
						<svg class="h-8 w-8 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25" stroke-width="2"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-linecap="round" stroke-width="2"/></svg>
						<span class="ml-3 text-sm">Loading schedule...</span>
					</div>
				{:else if filteredSchedule.length === 0 || filteredSchedule.every(s => s.anime_list.length === 0)}
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
					{#each filteredSchedule as daySection}
						{#each daySection.anime_list as item, i}
							<div class="relative z-10 flex flex-col md:flex-row md:items-start gap-4 animate-fade-in group" style="animation-delay: {i * 60}ms">
								<div class="hidden md:flex md:w-1/2 md:justify-end md:pr-8 md:text-right {i % 2 === 1 ? 'md:order-2' : ''}">
									{#if i % 2 === 0}
										<div class="pt-2">
											<span class="text-xs font-bold text-accent-primary tracking-wider uppercase">{daySection.day}</span>
										</div>
									{/if}
								</div>
								<div class="hidden md:flex md:items-center md:justify-center md:w-8 md:flex-shrink-0 {i % 2 === 1 ? 'md:order-1' : ''}">
									<div class="w-3 h-3 rounded-full bg-accent-primary/30 border-2 border-accent-primary shadow-lg shadow-accent-primary/20"></div>
								</div>
								<div class="hidden md:block md:w-1/2 md:pl-8 {i % 2 === 1 ? 'md:order-3 md:pl-0 md:pr-8 md:text-right' : ''}">
									{#if i % 2 === 1}
										<div class="pt-2">
											<span class="text-xs font-bold text-accent-primary tracking-wider uppercase">{daySection.day}</span>
										</div>
									{/if}
								</div>
								<div class="flex md:hidden items-center gap-3 pl-12">
									<div class="w-2.5 h-2.5 rounded-full bg-accent-primary/30 border-2 border-accent-primary flex-shrink-0"></div>
									<span class="text-xs font-bold text-accent-primary tracking-wider uppercase">{daySection.day}</span>
								</div>
								<a href="/anime/{item.slug}" class="ml-12 md:ml-0 flex items-center gap-4 p-3 rounded-xl bg-card {i % 2 === 1 ? 'md:order-2 md:mr-auto md:flex-row-reverse' : 'md:ml-auto'} md:w-[480px] group/card hover:bg-white/[0.03] transition-colors">
									<div class="w-14 h-20 md:w-16 md:h-22 flex-shrink-0 rounded-lg overflow-hidden">
										<img src={item.poster} alt={item.title} class="w-full h-full object-cover" loading="lazy" />
									</div>
									<div class="flex-1 min-w-0">
										<h3 class="text-sm font-semibold text-text-primary truncate">{item.title}</h3>
										<div class="flex items-center gap-2 mt-1.5">
											<span class="flex items-center gap-1 text-primary text-xs">
												<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
												Watch
											</span>
										</div>
									</div>
									<div class="w-9 h-9 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0">
										<svg class="w-4 h-4 text-accent-primary ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
									</div>
								</a>
							</div>
						{/each}
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>