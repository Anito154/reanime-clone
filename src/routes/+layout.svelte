<script lang="ts">
	let { children } = $props();
</script>

<div class="flex min-h-[100dvh] flex-col bg-[#050505]">
	<main class="flex-1">
		{@render children()}
	</main>
</div>
