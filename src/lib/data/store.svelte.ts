import type { Anime, Episode, ContinueWatchingItem, LatestEpisodeItem } from './types';

export type { Anime, Episode, ContinueWatchingItem, LatestEpisodeItem };

export const sources: string[] = [];
export const sourceLabels: Record<string, string> = {};
let _currentSource = $state('');

export function getCurrentSource(): string {
	return _currentSource;
}

export function setSource(key: string) {
	_currentSource = key;
}

export const animeList: Anime[] = $state([]);
export const latestEpisodes: LatestEpisodeItem[] = $state([]);
export const ongoing: Anime[] = $state([]);
export const trending: Anime[] = $state([]);
export const continueWatching: ContinueWatchingItem[] = $state([]);
export const genres: { title: string; slug: string }[] = $state([]);
const storeState = $state({ initialized: false });
export function isStoreInitialized() {
	return storeState.initialized;
}

export function getAnimeById(id: string): Anime | undefined {
	return animeList.find((a) => a.id === id);
}

export async function initStore(): Promise<void> {
	storeState.initialized = true;
}

export async function fetchAnimeDetail(_slug: string): Promise<Anime | null> {
	return null;
}

export async function searchAnime(_query: string): Promise<Anime[]> {
	return [];
}

export async function fetchSchedule(): Promise<{ day: string; anime_list: { title: string; slug: string; poster: string }[] }[]> {
	return [];
}

export async function fetchStreamUrl(_serverId: string): Promise<{ url: string }> {
	return { url: '' };
}

export async function fetchEpisodeDetail(_episodeId: string): Promise<{
	servers: { name: string; url: string }[];
	streamUrl?: string;
} | null> {
	return null;
}
