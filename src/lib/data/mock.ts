import type { Anime, Episode, LatestEpisodeItem, ContinueWatchingItem } from './types';

const episode = (id: string, n: number, title?: string): Episode => ({
	id, number: n, title: title || `Episode ${n}`, thumbnail: '', duration: '24m', aired: `2025-${String(n).padStart(2, '0')}-15`,
});

function makeAnime(data: Record<string, any>, episodeCount: number): Anime {
	const episodes: Episode[] = [];
	for (let i = 1; i <= episodeCount; i++) {
		episodes.push(episode(`${data.id}-e${i}`, i));
	}
	return {
		id: data.id,
		title: data.title,
		titleJapanese: data.titleJapanese || '',
		image: data.image,
		banner: data.banner || data.image,
		description: data.description || '',
		rating: data.rating || 0,
		ageRating: '',
		year: data.year || 2025,
		status: data.status || 'ongoing',
		type: data.type || 'TV',
		genres: data.genres || [],
		totalEpisodes: episodeCount,
		duration: data.duration || '24m',
		studio: data.studio || '',
		season: data.season || '',
		recommendations: [],
		episodes,
	};
}

const raw = [
	{
		id: 'solo-leveling-s2', title: 'Solo Leveling Season 2', titleJapanese: 'Ore dake Level Up na Ken Season 2',
		image: 'https://cdn.myanimelist.net/images/anime/1200/142820.jpg',
		description: 'Sung Jin-Woo continues his journey as the Shadow Monarch, facing increasingly powerful enemies while unraveling the mysteries of the System.',
		rating: 8.7, year: 2025, status: 'ongoing', type: 'TV', genres: ['Action', 'Fantasy', 'Adventure'],
		studio: 'A-1 Pictures', season: 'Winter',
	},
	{
		id: 'dandadan', title: 'Dandadan', titleJapanese: 'Dan Da Dan',
		image: 'https://cdn.myanimelist.net/images/anime/1541/143525.jpg',
		description: 'After a bet about aliens and ghosts, Momo and Okarun find themselves embroiled in a bizarre world of supernatural beings.',
		rating: 8.9, year: 2024, status: 'completed', type: 'TV', genres: ['Action', 'Comedy', 'Supernatural', 'Romance'],
		studio: 'Science SARU', season: 'Fall',
	},
	{
		id: 'jujutsu-kaisen-s3', title: 'Jujutsu Kaisen Season 3', titleJapanese: 'Jujutsu Kaisen 3rd Season',
		image: 'https://cdn.myanimelist.net/images/anime/1207/142524.jpg',
		description: 'The Culling Game arc continues as Yuji, Megumi, and the remaining sorcerers face off against Kenjaku.',
		rating: 9.0, year: 2025, status: 'ongoing', type: 'TV', genres: ['Action', 'Supernatural', 'Dark Fantasy'],
		studio: 'MAPPA', season: 'Spring',
	},
	{
		id: 'kaiju-no-8-s2', title: 'Kaiju No. 8 Season 2', titleJapanese: 'Kaijuu 8-gou Season 2',
		image: 'https://cdn.myanimelist.net/images/anime/1980/141324.jpg',
		description: 'Kafka Hibino continues his double life as a member of the Defense Force while hiding his ability to transform into a kaiju.',
		rating: 8.4, year: 2025, status: 'ongoing', type: 'TV', genres: ['Action', 'Sci-Fi', 'Monster'],
		studio: 'Production I.G', season: 'Summer',
	},
	{
		id: 'frieren-s2', title: 'Frieren: Beyond Journey\'s End Season 2', titleJapanese: 'Sousou no Frieren Season 2',
		image: 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg',
		description: 'Frieren continues her journey northward to the resting place of souls, accompanied by her new companions.',
		rating: 9.1, year: 2025, status: 'ongoing', type: 'TV', genres: ['Adventure', 'Fantasy', 'Drama'],
		studio: 'Madhouse', season: 'Winter',
	},
	{
		id: 'one-piece', title: 'One Piece', titleJapanese: 'One Piece',
		image: 'https://cdn.myanimelist.net/images/anime/1244/138851.jpg',
		description: 'Monkey D. Luffy and his pirate crew continue their journey to find the legendary One Piece treasure.',
		rating: 9.2, year: 1999, status: 'ongoing', type: 'TV', genres: ['Action', 'Adventure', 'Comedy', 'Drama'],
		studio: 'Toei Animation', season: '',
	},
	{
		id: 'demon-slayer-hashira', title: 'Demon Slayer: Hashira Training Arc', titleJapanese: 'Kimetsu no Yaiba: Hashira Geiko-hen',
		image: 'https://cdn.myanimelist.net/images/anime/1769/143548.jpg',
		description: 'In preparation for the final battle against Muzan Kibutsuji, the Demon Slayer Corps initiates an intensive training program.',
		rating: 8.6, year: 2024, status: 'completed', type: 'TV', genres: ['Action', 'Supernatural', 'Historical'],
		studio: 'ufotable', season: 'Spring',
	},
	{
		id: 'spy-family-s3', title: 'Spy x Family Season 3', titleJapanese: 'Spy x Family Season 3',
		image: 'https://cdn.myanimelist.net/images/anime/1996/142520.jpg',
		description: 'The Forger family returns for more thrilling and heartwarming adventures.',
		rating: 8.5, year: 2025, status: 'ongoing', type: 'TV', genres: ['Comedy', 'Action', 'Slice of Life'],
		studio: 'WIT Studio', season: 'Fall',
	},
	{
		id: 'attack-on-titan', title: 'Attack on Titan', titleJapanese: 'Shingeki no Kyojin',
		image: 'https://cdn.myanimelist.net/images/anime/1035/136089.jpg',
		description: 'Humanity\'s last stand against the Titans reaches its epic conclusion.',
		rating: 9.5, year: 2013, status: 'completed', type: 'TV', genres: ['Action', 'Drama', 'Dark Fantasy'],
		studio: 'MAPPA', season: '',
	},
	{
		id: 'chainsaw-man-movie', title: 'Chainsaw Man: Reze Arc (Movie)', titleJapanese: 'Chainsaw Man: Reze-hen',
		image: 'https://cdn.myanimelist.net/images/anime/1100/141712.jpg',
		description: 'Denji\'s relatively peaceful life at Public Safety is disrupted when he meets the mysterious Reze.',
		rating: 8.8, year: 2025, status: 'upcoming', type: 'MOVIE', genres: ['Action', 'Dark Fantasy', 'Comedy'],
		studio: 'MAPPA', season: 'Summer',
	},
	{
		id: 'dr-stone-s4', title: 'Dr. Stone: Science Future Part 3', titleJapanese: 'Dr. Stone: Science Future Part 3',
		image: 'https://cdn.myanimelist.net/images/anime/1724/142157.jpg',
		description: 'Senku and the Kingdom of Science continue their quest to reach the moon.',
		rating: 8.3, year: 2025, status: 'ongoing', type: 'TV', genres: ['Adventure', 'Sci-Fi', 'Comedy'],
		studio: 'TMS Entertainment', season: 'Spring',
	},
	{
		id: 'mob-psycho-100', title: 'Mob Psycho 100', titleJapanese: 'Mob Psycho 100',
		image: 'https://cdn.myanimelist.net/images/anime/1077/140473.jpg',
		description: 'Shigeo Kageyama, a powerful psychic, navigates the challenges of adolescence while learning to control his powers.',
		rating: 9.4, year: 2016, status: 'completed', type: 'TV', genres: ['Action', 'Comedy', 'Supernatural'],
		studio: 'Bones', season: '',
	},
];

const epCounts: Record<string, number> = {
	'solo-leveling-s2': 4,
	'dandadan': 5,
	'jujutsu-kaisen-s3': 3,
	'kaiju-no-8-s2': 2,
	'frieren-s2': 4,
	'one-piece': 3,
	'demon-slayer-hashira': 3,
	'spy-family-s3': 2,
	'attack-on-titan': 2,
	'chainsaw-man-movie': 1,
	'dr-stone-s4': 2,
	'mob-psycho-100': 0,
};

export const mockAnimeList: Anime[] = raw.map(r => makeAnime(r, epCounts[r.id]));
export const mockOngoing: Anime[] = mockAnimeList.filter(a => a.status === 'ongoing');
export const mockTrending: Anime[] = [...mockAnimeList].sort((a, b) => b.rating - a.rating);

export const mockLatestEpisodes: LatestEpisodeItem[] = mockAnimeList
	.filter(a => a.episodes.length > 0)
	.slice(0, 8)
	.map(a => ({
		anime: a,
		latestEpisode: a.episodes[a.episodes.length - 1],
	}));

export const mockContinueWatching: ContinueWatchingItem[] = [
	{ animeId: 'solo-leveling-s2', episodeId: 'solo-leveling-s2-e3', progress: 60, timestamp: Date.now() - 3600000 },
	{ animeId: 'jujutsu-kaisen-s3', episodeId: 'jjk-s3-e2', progress: 35, timestamp: Date.now() - 86400000 },
	{ animeId: 'kaiju-no-8-s2', episodeId: 'kaiju-s2-e1', progress: 80, timestamp: Date.now() - 7200000 },
];

export const mockGenres: { title: string; slug: string }[] = [
	{ title: 'Action', slug: 'action' },
	{ title: 'Adventure', slug: 'adventure' },
	{ title: 'Comedy', slug: 'comedy' },
	{ title: 'Drama', slug: 'drama' },
	{ title: 'Fantasy', slug: 'fantasy' },
	{ title: 'Sci-Fi', slug: 'sci-fi' },
	{ title: 'Supernatural', slug: 'supernatural' },
	{ title: 'Romance', slug: 'romance' },
	{ title: 'Dark Fantasy', slug: 'dark-fantasy' },
	{ title: 'Monster', slug: 'monster' },
	{ title: 'Historical', slug: 'historical' },
	{ title: 'Slice of Life', slug: 'slice-of-life' },
];

export const mockSchedule: { day: string; anime_list: { title: string; slug: string; poster: string }[] }[] = [
	{
		day: 'Senin', anime_list: [
			{ title: 'One Piece', slug: 'one-piece', poster: mockAnimeList[5].image },
			{ title: 'Solo Leveling Season 2', slug: 'solo-leveling-s2', poster: mockAnimeList[0].image },
		],
	},
	{
		day: 'Selasa', anime_list: [
			{ title: 'Kaiju No. 8 Season 2', slug: 'kaiju-no-8-s2', poster: mockAnimeList[3].image },
		],
	},
	{
		day: 'Rabu', anime_list: [
			{ title: "Frieren: Beyond Journey's End Season 2", slug: 'frieren-s2', poster: mockAnimeList[4].image },
			{ title: 'Dr. Stone: Science Future Part 3', slug: 'dr-stone-s4', poster: mockAnimeList[10].image },
		],
	},
	{
		day: 'Kamis', anime_list: [
			{ title: 'Spy x Family Season 3', slug: 'spy-family-s3', poster: mockAnimeList[7].image },
		],
	},
	{
		day: 'Jumat', anime_list: [
			{ title: 'Jujutsu Kaisen Season 3', slug: 'jujutsu-kaisen-s3', poster: mockAnimeList[2].image },
			{ title: 'Demon Slayer: Hashira Training Arc', slug: 'demon-slayer-hashira', poster: mockAnimeList[6].image },
		],
	},
	{
		day: 'Sabtu', anime_list: [
			{ title: 'Dandadan', slug: 'dandadan', poster: mockAnimeList[1].image },
		],
	},
	{
		day: 'Minggu', anime_list: [
			{ title: 'Chainsaw Man: Reze Arc (Movie)', slug: 'chainsaw-man-movie', poster: mockAnimeList[9].image },
		],
	},
];

export function getMockDetail(slug: string): Anime | undefined {
	return mockAnimeList.find(a => a.id === slug);
}

export function searchMockAnime(query: string): Anime[] {
	const q = query.toLowerCase();
	return mockAnimeList.filter(a =>
		a.title.toLowerCase().includes(q) ||
		a.titleJapanese.toLowerCase().includes(q)
	);
}

export function getMockEpisodeDetail(episodeId: string) {
	for (const a of mockAnimeList) {
		const ep = a.episodes.find(e => e.id === episodeId);
		if (ep) {
			return {
				servers: [
					{ name: 'Server 1', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
					{ name: 'Server 2', url: 'https://www.youtube.com/embed/9bZkp7q19f0' },
				],
				streamUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
			};
		}
	}
	return null;
}
