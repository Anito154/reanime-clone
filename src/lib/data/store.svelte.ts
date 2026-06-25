import type { Anime, Episode, ContinueWatchingItem, LatestEpisodeItem } from './types';
import { getInfo, getDetailsV1, findByRating, searchAll, sortAnime } from './api';
import type { ApiAnimeInfo, ApiAniDataItem } from './api';

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

function determineStatus(status: string | undefined): 'ongoing' | 'completed' | 'upcoming' {
	if (!status) return 'ongoing';
	const s = status.toLowerCase();
	if (s.includes('finish') || s.includes('completed')) return 'completed';
	if (s.includes('upcoming') || s.includes('not yet aired')) return 'upcoming';
	return 'ongoing';
}

function determineType(type: string | undefined): 'TV' | 'TV_SHORT' | 'MOVIE' | 'ONA' | 'OVA' | 'Special' {
	if (!type) return 'TV';
	const t = type.toLowerCase().replace(/\s/g, '_');
	if (t.includes('movie')) return 'MOVIE';
	if (t.includes('tv_short') || t.includes('short')) return 'TV_SHORT';
	if (t.includes('ona')) return 'ONA';
	if (t.includes('ova')) return 'OVA';
	if (t.includes('special')) return 'Special';
	return 'TV';
}

function parseYear(premiered: string | undefined): number {
	if (!premiered) return 0;
	const match = premiered.match(/(\d{4})/);
	return match ? parseInt(match[1], 10) : 0;
}

function parseSeason(premiered: string | undefined): string {
	if (!premiered) return '';
	return premiered.split(' ')[0] || '';
}

function apiInfoToAnime(d: ApiAnimeInfo): Anime {
	const episodes: Episode[] = [];
	const epCount = d.epCount || 0;
	for (let i = 1; i <= Math.min(epCount, 50); i++) {
		episodes.push({
			id: `${d._id}-e${i}`,
			number: i,
			title: `Episode ${i}`,
			thumbnail: d.ImagePath,
			duration: d.Duration || '24m',
			aired: '',
		});
	}
	return {
		id: String(d._id),
		title: d.Name,
		titleJapanese: d.Synonyms || '',
		image: d.ImagePath,
		banner: d.Cover || d.ImagePath,
		description: d.DescripTion || '',
		rating: parseFloat(d.MALScore || '0'),
		ageRating: '',
		year: parseYear(d.Premiered),
		status: determineStatus(d.Status),
		type: determineType(d.Type),
		genres: d.Genres || [],
		totalEpisodes: epCount,
		duration: d.Duration || '24m',
		studio: d.Studios || '',
		season: parseSeason(d.Premiered),
		recommendations: [],
		episodes,
	};
}

function apiAniDataToAnime(d: ApiAniDataItem): Anime {
	const image = d.ImagePath?.startsWith('https://') ? d.ImagePath : `https://anipub.xyz/${d.ImagePath}`;
	return {
		id: String(d._id),
		title: d.Name,
		titleJapanese: '',
		image,
		banner: image,
		description: d.DescripTion || '',
		rating: parseFloat(d.MALScore || '0'),
		ageRating: '',
		year: 0,
		status: 'ongoing',
		type: 'TV',
		genres: d.Genres || [],
		totalEpisodes: 0,
		duration: '',
		studio: '',
		season: '',
		recommendations: [],
		episodes: [],
	};
}

export async function initStore(): Promise<void> {
	if (storeState.initialized) return;

	try {
		const [allData, ratingPage] = await Promise.all([
			sortAnime({ ratefrom: 0, rateto: 10, page: 1 }),
			findByRating(1),
		]);

		const items = allData.data || [];
		animeList.length = 0;
		animeList.push(...items.map(apiAniDataToAnime));

		const rated = ratingPage.AniData || [];
		trending.length = 0;
		trending.push(...rated.map(apiAniDataToAnime));

		ongoing.length = 0;
		ongoing.push(...animeList.filter(a => a.status === 'ongoing').slice(0, 20));

		latestEpisodes.length = 0;
		latestEpisodes.push(...animeList
			.filter(a => a.episodes.length > 0)
			.slice(0, 8)
			.map(a => ({
				anime: a,
				latestEpisode: a.episodes[a.episodes.length - 1],
			})));

		continueWatching.length = 0;

		const genreSet = new Set<string>();
		for (const item of items) {
			for (const g of item.Genres || []) {
				genreSet.add(g);
			}
		}
		genres.length = 0;
		genres.push(...Array.from(genreSet).map(g => ({
			title: g.charAt(0).toUpperCase() + g.slice(1),
			slug: g,
		})));
	} catch (e) {
		console.error('Failed to load anime data from API', e);
	}

	storeState.initialized = true;
}

export async function fetchAnimeDetail(slug: string): Promise<Anime | null> {
	try {
		const info = await getInfo(slug);
		const detail = apiInfoToAnime(info);
		const existing = animeList.findIndex(a => a.id === detail.id);
		if (existing >= 0) {
			animeList[existing] = detail;
		} else {
			animeList.push(detail);
		}
		return detail;
	} catch {
		return null;
	}
}

export async function searchAnime(query: string): Promise<Anime[]> {
	if (!query.trim()) return [];
	try {
		const results = await searchAll(query, 1);
		return (results.AniData || []).map(apiAniDataToAnime);
	} catch {
		return [];
	}
}

export async function fetchSchedule(): Promise<{ day: string; anime_list: { title: string; slug: string; poster: string }[] }[]> {
	try {
		const all = await sortAnime({ ratefrom: 0, rateto: 10, page: 1 });
		const items = all.data || [];
		const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
		const schedule = days.map((day, i) => ({
			day,
			anime_list: items
				.filter((_, idx) => idx % 7 === i)
				.slice(0, 5)
				.map(a => ({
					title: a.Name,
					slug: a.finder,
					poster: a.ImagePath?.startsWith('https://') ? a.ImagePath : `https://anipub.xyz/${a.ImagePath}`,
				})),
		}));
		return schedule;
	} catch {
		return [];
	}
}

export async function fetchStreamUrl(animeId: string): Promise<{ url: string }> {
	try {
		const data = await getDetailsV1(Number(animeId));
		const src = data.local?.link?.replace('src=', '') || '';
		return { url: src };
	} catch {
		return { url: '' };
	}
}

export async function fetchEpisodeDetail(episodeId: string): Promise<{
	servers: { name: string; url: string }[];
	streamUrl?: string;
} | null> {
	const match = episodeId.match(/^(\d+)-e(\d+)$/);
	if (!match) return null;

	const animeId = parseInt(match[1], 10);
	const epNum = parseInt(match[2], 10);

	try {
		const data = await getDetailsV1(animeId);
		let rawUrl = '';
		if (epNum === 1) {
			rawUrl = data.local?.link || '';
		} else {
			const idx = epNum - 2;
			rawUrl = data.local?.ep?.[idx]?.link || '';
		}
		const url = rawUrl.replace('src=', '');
		if (!url) return null;

		return {
			servers: [{ name: 'Server 1', url }],
			streamUrl: url,
		};
	} catch {
		return null;
	}
}
