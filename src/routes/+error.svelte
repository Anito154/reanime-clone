<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-[#050505] pt-16 text-white">
	<h1 class="text-6xl font-bold text-primary">{page.status}</h1>
	<p class="mt-4 text-lg text-zinc-400">{page.error?.message}</p>
	<a href="/home" class="mt-8 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-black transition-all hover:brightness-110">
		Go Home
	</a>
</div>
