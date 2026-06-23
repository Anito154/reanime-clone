import { b as attr, c as html, i as ensure_array_like, n as attr_style, o as stringify, r as derived, t as attr_class, x as escape_html } from "../../../../chunks/server.js";
import { t as page } from "../../../../chunks/state.js";
import { t as animeList } from "../../../../chunks/mock.js";
import { t as myList } from "../../../../chunks/myList.svelte.js";
//#region src/lib/components/ShareDialog.svelte
function ShareDialog($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { anime, open, onclose } = $$props;
		const shareTargets = [
			{
				name: "Twitter",
				color: "bg-[#1da1f2]",
				shadow: "shadow-[#1da1f2]/40",
				icon: `<svg viewBox="0 0 24 24" fill="currentColor" class="size-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
				url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(anime.title)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`
			},
			{
				name: "Facebook",
				color: "bg-[#1877f2]",
				shadow: "shadow-[#1877f2]/40",
				icon: `<svg viewBox="0 0 24 24" fill="currentColor" class="size-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
				url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`
			},
			{
				name: "Reddit",
				color: "bg-[#ff4500]",
				shadow: "shadow-[#ff4500]/40",
				icon: `<svg viewBox="0 0 24 24" fill="currentColor" class="size-5"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.66 7.082c-.798 0-1.44.644-1.44 1.44s.642 1.44 1.44 1.44 1.44-.644 1.44-1.44-.642-1.44-1.44-1.44zm5.76 0c-.798 0-1.44.644-1.44 1.44s.642 1.44 1.44 1.44 1.44-.644 1.44-1.44-.642-1.44-1.44-1.44z"/></svg>`,
				url: `https://reddit.com/submit?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&title=${encodeURIComponent(anime.title)}`
			},
			{
				name: "Telegram",
				color: "bg-[#0088cc]",
				shadow: "shadow-[#0088cc]/40",
				icon: `<svg viewBox="0 0 24 24" fill="currentColor" class="size-5"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
				url: `https://t.me/share/url?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&text=${encodeURIComponent(anime.title)}`
			},
			{
				name: "WhatsApp",
				color: "bg-[#25d366]",
				shadow: "shadow-[#25d366]/40",
				icon: `<svg viewBox="0 0 24 24" fill="currentColor" class="size-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
				url: `https://wa.me/?text=${encodeURIComponent(anime.title + " " + (typeof window !== "undefined" ? window.location.href : ""))}`
			}
		];
		if (open) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true"><div class="absolute inset-0 bg-black/70 backdrop-blur-md"></div> <div class="relative w-full max-w-sm rounded-t-2xl border border-zinc-700/50 bg-gradient-to-b from-[#111] to-[#0a0a0a] p-0 shadow-2xl sm:rounded-2xl"><div class="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div> <div class="flex items-center gap-4 p-5 pb-4"><div class="relative size-14 shrink-0 overflow-hidden rounded-xl ring-2 ring-primary/30" style="box-shadow: 0 0 20px color-mix(in srgb, var(--primary-rgb) 35%, transparent);"><img${attr("src", anime.image)}${attr("alt", anime.title)} class="h-full w-full object-cover"/></div> <div class="min-w-0 flex-1"><h3 class="truncate text-sm font-bold text-white">Share</h3> <p class="mt-0.5 truncate text-xs text-zinc-500">${escape_html(anime.title)}</p></div> <button class="flex size-8 shrink-0 items-center justify-center rounded-full text-zinc-500 transition-all hover:bg-zinc-800 hover:text-white" aria-label="Close"><svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button></div> <div class="px-5 pb-3"><div class="grid grid-cols-5 gap-1"><!--[-->`);
			const each_array = ensure_array_like(shareTargets);
			for (let i = 0, $$length = each_array.length; i < $$length; i++) {
				let target = each_array[i];
				$$renderer.push(`<a${attr("href", target.url)} target="_blank" rel="noopener noreferrer" class="group flex flex-col items-center gap-1.5 rounded-xl px-1 py-2.5 transition-all hover:bg-zinc-800/50"><div${attr_class(`flex size-11 items-center justify-center rounded-full ${stringify(target.color)} text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:${stringify(target.shadow)}`)} style="box-shadow: 0 4px 16px color-mix(in srgb, var(--primary-rgb) 8%, transparent);">${html(target.icon)}</div> <span class="text-[10px] text-zinc-500 transition-colors group-hover:text-zinc-300">${escape_html(target.name)}</span></a>`);
			}
			$$renderer.push(`<!--]--></div></div> <div class="border-t border-zinc-800 px-5 py-4"><button class="group flex w-full items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-left text-sm text-zinc-300 transition-all hover:border-primary/30 hover:bg-zinc-900"${attr_style("")}><div class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 transition-colors group-hover:bg-primary/10 group-hover:text-primary"><svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></div> <div class="flex-1"><div class="text-sm font-medium text-zinc-300 transition-colors group-hover:text-white">Copy Link</div> <div class="mt-0.5 truncate text-xs text-zinc-600">${escape_html(typeof window !== "undefined" ? window.location.href : "")}</div></div> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></button></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/routes/anime/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let anime = derived(() => animeList.find((a) => a.id === page.params.id));
		let showShareDialog = false;
		derived(() => anime() ? myList.getStatus(anime().id) : null);
		derived(() => anime() ? animeList.filter((a) => a.id !== anime().id && a.genres.some((g) => anime().genres.includes(g))).slice(0, 6) : []);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex min-h-screen items-center justify-center bg-[#050505]"><div class="skeleton size-12 rounded-full"></div></div>`);
		$$renderer.push(`<!--]--> `);
		if (anime()) {
			$$renderer.push("<!--[0-->");
			ShareDialog($$renderer, {
				anime: anime(),
				open: showShareDialog,
				onclose: () => showShareDialog = false
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
