<script lang="ts">
	let activeSection = $state('account');
	let username = $state('AnimeFan');
	let email = $state('fan@example.com');
	let language = $state('English');

	const sections = [
		{ id: 'account', label: 'Account' },
		{ id: 'appearance', label: 'Appearance' },
		{ id: 'notifications', label: 'Notifications' },
		{ id: 'about', label: 'About' }
	];
</script>

<div class="min-h-screen bg-bg">
	<div class="relative -mt-16 h-56 sm:h-64 overflow-hidden pt-16">
		<div class="absolute inset-0 -bottom-32 overflow-hidden">
			<div class="absolute inset-0 bg-gradient-to-b from-accent-primary/[0.08] via-transparent to-transparent"></div>
			<div class="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent"></div>
		</div>
		<div class="absolute inset-x-0 bottom-0 flex items-end justify-center px-4 pb-8">
			<div class="text-center">
				<h1 class="animate-fade-in mb-2 text-4xl font-extrabold tracking-tight text-white md:text-5xl">Settings</h1>
				<p class="animate-fade-in text-sm font-medium text-text-muted" style="animation-delay: 80ms">Customize your experience</p>
			</div>
		</div>
	</div>

	<div class="max-w-4xl mx-auto px-4 py-8 md:py-12">
		<div class="animate-fade-in flex items-center gap-2 overflow-x-auto scroll-hidden pb-4 mb-8" style="animation-delay: 160ms">
			{#each sections as section}
				<button
					class="relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap {activeSection === section.id ? 'bg-accent-primary text-white' : 'bg-card text-text-muted hover:bg-white/10 hover:text-white'}"
					onclick={() => activeSection = section.id}>
					{section.label}
				</button>
			{/each}
		</div>

		<div class="animate-fade-in space-y-6" style="animation-delay: 200ms">
			{#if activeSection === 'account'}
				<div class="rounded-2xl bg-card p-6 md:p-8 border border-white/[0.06]">
					<h2 class="text-xl font-bold text-white mb-6">Account Settings</h2>
					<div class="space-y-5">
						<div>
							<label class="block text-sm font-medium text-text-muted mb-2" for="settings-username">Username</label>
							<input
								type="text"
								id="settings-username"
								bind:value={username}
								class="w-full px-4 py-2.5 rounded-xl bg-surface border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50 transition-all duration-300"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-text-muted mb-2" for="settings-email">Email</label>
							<input
								type="email"
								id="settings-email"
								bind:value={email}
								class="w-full px-4 py-2.5 rounded-xl bg-surface border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50 transition-all duration-300"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-text-muted mb-2" for="settings-language">Language</label>
							<select
								id="settings-language"
								bind:value={language}
								class="w-full px-4 py-2.5 rounded-xl bg-surface border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50 transition-all duration-300">
								<option>English</option>
								<option>Japanese</option>
								<option>Spanish</option>
								<option>French</option>
								<option>German</option>
							</select>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
