import "./server.js";
//#region src/lib/myList.svelte.ts
var STORAGE_KEY = "anito_my_list";
function loadList() {
	if (typeof localStorage === "undefined") return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		return JSON.parse(raw);
	} catch {
		return [];
	}
}
function saveList(items) {
	if (typeof localStorage === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	} catch {}
}
var items = loadList();
var myList = {
	get items() {
		return items;
	},
	add(animeId, status = "plan_to_watch") {
		const existing = items.find((i) => i.animeId === animeId);
		if (existing) {
			existing.status = status;
			existing.updatedAt = Date.now();
		} else items.push({
			animeId,
			status,
			addedAt: Date.now(),
			updatedAt: Date.now()
		});
		saveList(items);
	},
	remove(animeId) {
		items = items.filter((i) => i.animeId !== animeId);
		saveList(items);
	},
	getStatus(animeId) {
		return items.find((i) => i.animeId === animeId)?.status ?? null;
	},
	isInList(animeId) {
		return items.some((i) => i.animeId === animeId);
	},
	updateStatus(animeId, status) {
		const existing = items.find((i) => i.animeId === animeId);
		if (existing) {
			existing.status = status;
			existing.updatedAt = Date.now();
			saveList(items);
		}
	}
};
//#endregion
export { myList as t };
