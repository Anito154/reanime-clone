export type ListStatus = 'watching' | 'completed' | 'plan_to_watch' | 'dropped' | 'on_hold';

export interface MyListItem {
	animeId: string;
	status: ListStatus;
	addedAt: number;
	updatedAt: number;
}

const STORAGE_KEY = 'anito_my_list';

function loadList(): MyListItem[] {
	if (typeof localStorage === 'undefined') return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		return JSON.parse(raw) as MyListItem[];
	} catch {
		return [];
	}
}

function saveList(items: MyListItem[]) {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	} catch {
		// storage full or unavailable
	}
}

let items = $state(loadList());

export const myList = {
	get items() {
		return items;
	},
	add(animeId: string, status: ListStatus = 'plan_to_watch') {
		const existing = items.find((i) => i.animeId === animeId);
		if (existing) {
			existing.status = status;
			existing.updatedAt = Date.now();
		} else {
			items.push({ animeId, status, addedAt: Date.now(), updatedAt: Date.now() });
		}
		saveList(items);
	},
	remove(animeId: string) {
		items = items.filter((i) => i.animeId !== animeId);
		saveList(items);
	},
	getStatus(animeId: string): ListStatus | null {
		return items.find((i) => i.animeId === animeId)?.status ?? null;
	},
	isInList(animeId: string): boolean {
		return items.some((i) => i.animeId === animeId);
	},
	updateStatus(animeId: string, status: ListStatus) {
		const existing = items.find((i) => i.animeId === animeId);
		if (existing) {
			existing.status = status;
			existing.updatedAt = Date.now();
			saveList(items);
		}
	}
};
