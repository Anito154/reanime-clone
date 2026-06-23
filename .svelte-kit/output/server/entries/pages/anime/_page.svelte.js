import { b as attr, i as ensure_array_like, o as stringify, r as derived, t as attr_class, x as escape_html } from "../../../chunks/server.js";
import { t as animeList } from "../../../chunks/mock.js";
//#region src/routes/anime/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let sortBy = "popularity";
		let selectedGenres = [];
		const allGenres = derived(() => [...new Set(animeList.flatMap((a) => a.genres))].sort());
		const sortedAnime = derived(() => () => {
			let list = [...animeList];
			if (selectedGenres.length > 0) list = list.filter((a) => selectedGenres.some((g) => a.genres.includes(g)));
			switch (sortBy) {
				case "popularity": return list.sort((a, b) => b.episodes.length + b.rating * 10 - (a.episodes.length + a.rating * 10));
				case "rating": return list.sort((a, b) => b.rating - a.rating);
				case "year": return list.sort((a, b) => b.year - a.year);
				case "title": return list.sort((a, b) => a.title.localeCompare(b.title));
				default: return list;
			}
		});
		$$renderer.push(`<div class="min-h-screen bg-[#050505] text-white"><div class="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 xl:px-12"><div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-2xl font-light text-white lg:text-3xl">Anime <span class="font-medium text-primary">Catalog</span></h1> <p class="mt-1 text-sm text-zinc-500">${escape_html(animeList.length)} titles available</p></div> <div class="flex items-center gap-3"><div class="flex rounded-lg border border-white/10 bg-[#0a0a0a] p-0.5"><button${attr_class(`rounded-md px-3 py-1.5 text-xs font-medium transition-all bg-primary text-black`)}><svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg></button> <button${attr_class(`rounded-md px-3 py-1.5 text-xs font-medium transition-all text-zinc-400 hover:text-white`)}><svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg></button></div> `);
		$$renderer.select({
			value: sortBy,
			class: "rounded-lg border border-white/10 bg-[#0a0a0a] px-3 py-2 text-xs font-medium text-zinc-400 focus:outline-none"
		}, ($$renderer) => {
			$$renderer.option({ value: "popularity" }, ($$renderer) => {
				$$renderer.push(`Popularity`);
			});
			$$renderer.option({ value: "rating" }, ($$renderer) => {
				$$renderer.push(`Rating`);
			});
			$$renderer.option({ value: "year" }, ($$renderer) => {
				$$renderer.push(`Year`);
			});
			$$renderer.option({ value: "title" }, ($$renderer) => {
				$$renderer.push(`Title A-Z`);
			});
		});
		$$renderer.push(`</div></div> <div class="flex gap-8"><aside class="hidden w-[200px] shrink-0 lg:block"><div class="sticky top-20"><h3 class="mb-3 text-xs font-black tracking-[0.2em] text-primary uppercase">Genres</h3> <div class="flex flex-col gap-1"><button${attr_class(`rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-all ${selectedGenres.length === 0 ? "bg-primary/10 text-primary" : "text-zinc-500 hover:text-white hover:bg-white/5"}`)}>All</button> <!--[-->`);
		const each_array = ensure_array_like(allGenres());
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let genre = each_array[$$index];
			$$renderer.push(`<button${attr_class(`rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-all ${selectedGenres.includes(genre) ? "bg-primary/10 text-primary" : "text-zinc-500 hover:text-white hover:bg-white/5"}`)}>${escape_html(genre)}</button>`);
		}
		$$renderer.push(`<!--]--></div></div></aside> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex-1"><div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5"><!--[-->`);
			const each_array_1 = ensure_array_like(sortedAnime()());
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let item = each_array_1[$$index_1];
				$$renderer.push(`<a${attr("href", `/anime/${stringify(item.id)}`)} class="group block"><div class="relative aspect-[5/7] overflow-hidden rounded-xl bg-zinc-900"><img${attr("src", item.image)}${attr("alt", item.title)} class="h-full w-full object-cover transition-all duration-500 group-hover:scale-110" loading="lazy"/> <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> <div class="absolute top-2 left-2"><span class="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">${escape_html(item.type.replace("_", " "))}</span></div> <div class="absolute top-2 right-2"><span class="flex items-center gap-0.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-yellow-400 backdrop-blur-sm"><svg class="size-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> ${escape_html(item.rating || "?")}</span></div> <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"><div class="flex size-12 items-center justify-center rounded-full bg-primary shadow-[0_0_20px_rgba(0,0,0,0.5)]"><svg class="ml-0.5 size-5 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg></div></div></div> <div class="mt-2 px-0.5"><h3 class="truncate text-xs font-semibold text-white group-hover:text-primary transition-colors">${escape_html(item.title)}</h3> <p class="mt-0.5 text-[10px] text-zinc-500">${escape_html(item.year)} · ${escape_html(item.episodes.length)} ep</p></div></a>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		}
		$$renderer.push(`<!--]--></div></div></div>`);
	});
}
//#endregion
export { _page as default };
