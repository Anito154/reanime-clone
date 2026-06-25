import type { Anime, Episode, ContinueWatchingItem, LatestEpisodeItem } from './types';
import {
	mockAnimeList, mockOngoing, mockTrending, mockLatestEpisodes,
	mockContinueWatching, mockGenres, mockSchedule,
	getMockDetail, searchMockAnime, getMockEpisodeDetail,
} from './mock';

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
	if (storeState.initialized) return;

	animeList.length = 0;
	animeList.push(...mockAnimeList);

	ongoing.length = 0;
	ongoing.push(...mockOngoing);

	trending.length = 0;
	trending.push(...mockTrending);

	latestEpisodes.length = 0;
	latestEpisodes.push(...mockLatestEpisodes);

	continueWatching.length = 0;
	continueWatching.push(...mockContinueWatching);

	genres.length = 0;
	genres.push(...mockGenres);

	storeState.initialized = true;
}

export async function fetchAnimeDetail(slug: string): Promise<Anime | null> {
	const detail = getMockDetail(slug);
	if (!detail) return null;

	const existing = animeList.findIndex(a => a.id === detail.id);
	if (existing >= 0) {
		animeList[existing] = detail;
	} else {
		animeList.push(detail);
	}
	return detail;
}

export async function searchAnime(query: string): Promise<Anime[]> {
	return searchMockAnime(query);
}

export async function fetchSchedule(): Promise<{ day: string; anime_list: { title: string; slug: string; poster: string }[] }[]> {
	return mockSchedule;
}

export async function fetchStreamUrl(_serverId: string): Promise<{ url: string }> {
	return { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' };
}

export async function fetchEpisodeDetail(episodeId: string): Promise<{
	servers: { name: string; url: string }[];
	streamUrl?: string;
} | null> {
	return getMockEpisodeDetail(episodeId);
}
