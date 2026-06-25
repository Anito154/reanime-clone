<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	let dockOpen = $state(false);
	let dockLocked = $state(false);
	let lastScrollY = $state(0);
	let idleTimer: ReturnType<typeof setTimeout> | undefined = $state();

	const IDLE_TIMEOUT = 3000;
	const SCROLL_THRESHOLD = 5;

	function handleScroll() {
		const currentY = window.scrollY;
		const delta = currentY - lastScrollY;

		if (dockLocked) {
			lastScrollY = currentY;
			return;
		}

		if (Math.abs(delta) > SCROLL_THRESHOLD) {
			if (delta > 0) {
				dockOpen = false;
			} else {
				dockOpen = true;
			}

			if (idleTimer) clearTimeout(idleTimer);
			idleTimer = setTimeout(() => {
				dockOpen = false;
			}, IDLE_TIMEOUT);
		}

		lastScrollY = currentY;
	}

	function toggleDock() {
		if (dockLocked) return;
		dockOpen = !dockOpen;
		if (idleTimer) clearTimeout(idleTimer);
		if (dockOpen) {
			idleTimer = setTimeout(() => {
				dockOpen = false;
			}, IDLE_TIMEOUT);
		}
	}

	function toggleLock() {
		dockLocked = !dockLocked;
		if (dockLocked && idleTimer) {
			clearTimeout(idleTimer);
		}
	}

	let currentPath = $derived($page.url.pathname);

	$effect(() => {
		if (!browser) return;
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', handleScroll);
			if (idleTimer) clearTimeout(idleTimer);
		};
	});

	const navItems = [
		{ href: '/home', label: 'Home', icon: 'house' },
		{ href: '/search', label: 'Search', icon: 'search' },
		{ href: '/schedule', label: 'Schedule', icon: 'calendar' },
		{ href: '/my-list', label: 'My List', icon: 'bookmark' },
	];

	const bottomItems = [
		{ href: '/home', label: 'Home', icon: 'house' },
		{ href: '/search', label: 'Search', icon: 'search' },
		{ href: '/schedule', label: 'Schedule', icon: 'calendar' },
		{ href: '/my-list', label: 'My List', icon: 'bookmark' },
		{ href: '/settings', label: 'Settings', icon: 'settings' },
	];

	function isActive(href: string) {
		return currentPath.startsWith(href) && href !== '/' ? true : currentPath === href;
	}
</script>

<div class="fixed top-1/2 left-0 z-40 hidden -translate-y-1/2 flex-col items-start gap-0.5 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] lg:flex {dockOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}">
	<button
		onclick={toggleDock}
		class="flex h-20 w-8 items-center justify-center rounded-r-lg border-y border-r border-white/[0.08] bg-[#0a0a0a]/90 text-gray-400 shadow-lg backdrop-blur-3xl transition-all duration-500 ease-out hover:w-10 hover:bg-[#0a0a0a]/98 hover:text-white"
		aria-label={dockOpen ? 'Hide dock' : 'Show dock'}
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
		><path d={dockOpen ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'}></path></svg>
	</button>
	<button
		onclick={toggleLock}
		class="flex h-8 w-8 items-center justify-center rounded-r-lg border-y border-r border-white/[0.08] bg-[#0a0a0a]/90 shadow-lg backdrop-blur-3xl transition-all duration-300 hover:w-10 hover:bg-[#0a0a0a]/98 hover:text-white {dockLocked ? 'text-primary' : 'text-gray-400'}"
		title={dockLocked ? 'Unlock dock' : 'Lock dock open'}
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
			class="size-3.5"
		>{#if dockLocked}
			<rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v1"></path>
		{:else}
			<rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
		{/if}</svg>
	</button>
</div>

<aside
	class="fixed z-40 hidden lg:block left-4 top-1/2 -translate-y-1/2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
	style="transform: translateY(-50%) translateX({dockOpen ? '0' : 'calc(-100% - 2rem)'})"
>
	<div
		role="toolbar"
		aria-label="Navigation dock"
		tabindex="-1"
		class="relative flex flex-col items-center gap-3 rounded-full border border-white/[0.08] bg-[#0a0a0a]/90 p-3 shadow-2xl backdrop-blur-3xl"
	>
		{#each navItems as item}
			<a
				href={item.href}
				class="group relative z-10 flex size-[42px] items-center justify-center rounded-full transition-all duration-300 {isActive(item.href) ? 'text-white' : 'text-white/40 hover:bg-white/5 hover:text-white/90'}"
				title={item.label}
			>
				<div class="relative z-10 flex items-center justify-center" style="transform:rotate(0deg)">
					{#if item.icon === 'house'}
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-[20px] transition-transform duration-300 group-hover:scale-110"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
					{:else if item.icon === 'search'}
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-[20px] transition-transform duration-300 group-hover:scale-110"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>
					{:else if item.icon === 'calendar'}
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-[20px] transition-transform duration-300 group-hover:scale-110"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
					{:else if item.icon === 'bookmark'}
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-[20px] transition-transform duration-300 group-hover:scale-110"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
					{/if}
				</div>
				<div
					style="transform:rotate(0deg)"
					class="pointer-events-none absolute left-full z-50 ml-4 rounded-lg border border-white/[0.08] bg-[#0a0a0a]/90 px-3 py-1.5 text-[11px] font-semibold tracking-wide whitespace-nowrap text-white opacity-0 shadow-2xl backdrop-blur-3xl transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1 group-hover:opacity-100"
				>
					{item.label}
				</div>
			</a>
		{/each}

		<div class="h-px w-6 bg-white/[0.08]"></div>

		<a
			href="/settings"
			class="group relative z-10 flex size-[42px] items-center justify-center rounded-full transition-all duration-300 {isActive('/settings') ? 'text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}"
			title="Settings"
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
				class="size-[18px]"
				style="transform:rotate(0deg)"
			><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path><circle cx="12" cy="12" r="3"></circle></svg>
			<div
				style="transform:rotate(0deg)"
				class="pointer-events-none absolute left-full z-50 ml-3 rounded-lg border border-white/[0.08] bg-[#0a0a0a]/90 px-2.5 py-1.5 text-xs whitespace-nowrap text-white opacity-0 shadow-lg backdrop-blur-3xl transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
			>
				Settings
			</div>
		</a>

		<div class="h-px w-6 bg-white/[0.08]"></div>

		<button
			onclick={toggleDock}
			class="group relative flex size-11 items-center justify-center rounded-lg text-gray-400 transition-all duration-300 hover:bg-white/10 hover:text-white"
			title="Hide dock"
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
			<div
				style="transform:rotate(0deg)"
				class="pointer-events-none absolute left-full z-50 ml-3 rounded-lg border border-white/[0.08] bg-[#0a0a0a]/90 px-2.5 py-1.5 text-xs whitespace-nowrap text-white opacity-0 shadow-lg backdrop-blur-3xl transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
			>
				Hide
			</div>
		</button>
	</div>
</aside>

<nav class="fixed right-0 bottom-0 left-0 z-[5000] border-t border-white/[0.08] bg-[#0a0a0a]/90 backdrop-blur-3xl lg:hidden">
	<div class="flex items-center justify-around px-2 pt-2 pb-[env(safe-area-inset-bottom)] md:pb-2">
		{#each bottomItems as item}
			<a
				href={item.href}
				class="group relative flex flex-col items-center gap-1 rounded-2xl px-3 pt-2.5 pb-2 transition-all duration-300 {isActive(item.href) ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-white/10 hover:text-white'}"
			>
				<div class="relative transition-all duration-300 group-hover:scale-110 {isActive(item.href) ? 'scale-110' : ''}">
					{#if item.icon === 'house'}
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-5"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
					{:else if item.icon === 'search'}
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-5"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>
					{:else if item.icon === 'calendar'}
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-5"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
					{:else if item.icon === 'bookmark'}
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
					{:else if item.icon === 'settings'}
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-5"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path><circle cx="12" cy="12" r="3"></circle></svg>
					{/if}
				</div>
				<span class="text-xs font-medium transition-colors duration-300">{item.label}</span>
				{#if isActive(item.href)}
					<div class="absolute top-0 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-primary"></div>
				{/if}
			</a>
		{/each}
	</div>
</nav>
