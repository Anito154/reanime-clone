export interface Episode {
	id: string;
	number: number;
	title: string;
	thumbnail: string;
	duration: string;
	aired: string;
}

export interface Anime {
	id: string;
	title: string;
	titleJapanese: string;
	image: string;
	banner: string;
	color?: string;
	description: string;
	rating: number;
	ageRating: string;
	year: number;
	status: 'ongoing' | 'completed' | 'upcoming';
	type: 'TV' | 'TV_SHORT' | 'MOVIE' | 'ONA' | 'OVA' | 'Special';
	genres: string[];
	totalEpisodes: number;
	duration: string;
	studio: string;
	season: string;
	recommendations: string[];
	episodes: Episode[];
}

export interface ContinueWatchingItem {
	animeId: string;
	episodeId: string;
	progress: number;
	timestamp: number;
}

export interface LatestEpisodeItem {
	anime: Anime;
	latestEpisode: Episode;
}