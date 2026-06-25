const BASE = 'https://anipub.xyz';

function fixImage(p: string | undefined | null): string {
	if (!p) return '';
	return p.startsWith('https://') ? p : `${BASE}/${p}`;
}

export interface ApiAnimeInfo {
	_id: number;
	Name: string;
	ImagePath: string;
	Cover: string;
	Synonyms?: string;
	Aired?: string;
	Premiered?: string;
	Duration?: string;
	MALScore?: string;
	RatingsNum?: number;
	Genres?: string[];
	Studios?: string;
	Producers?: string;
	DescripTion?: string;
	Status?: string;
	MALID?: string;
	epCount?: number;
	Type?: string;
}

export interface ApiSearchResult {
	Name: string;
	Id: number;
	Image: string;
	finder: string;
}

export interface ApiAniDataItem {
	_id: number;
	Name: string;
	ImagePath: string;
	MALScore?: string;
	RatingsNum?: number;
	DescripTion?: string;
	finder: string;
	Genres?: string[];
}

export interface ApiFindResult {
	exist: boolean;
	id?: number;
	ep?: number;
}

export interface ApiDetailsV1 {
	local: {
		name: string;
		link: string;
		ep: { link: string }[];
	};
}

export interface ApiDetailsFull {
	local: {
		_id?: number;
		Name: string;
		ImagePath: string;
		Cover?: string;
		MALScore?: string;
		Genres?: string[];
		Status?: string;
		epCount?: number;
		DescripTion?: string;
		Studios?: string;
		Duration?: string;
		Premiered?: string;
	};
	jikan?: any;
	characters?: any[];
}

export interface ApiGenrePage {
	currentPage: number;
	wholePage: ApiAniDataItem[];
}

export interface ApiRatingPage {
	currentPage: number;
	AniData: ApiAniDataItem[];
}

export interface ApiSearchAllPage {
	currentPage: number;
	AniData: ApiAniDataItem[];
}

export interface ApiSortResult {
	pages: number;
	data: ApiAniDataItem[];
}

export async function getInfo(idOrSlug: number | string): Promise<ApiAnimeInfo> {
	const res = await fetch(`${BASE}/api/info/${idOrSlug}`);
	if (!res.ok) throw new Error(`getInfo failed: ${res.status}`);
	const d = await res.json();
	d.ImagePath = fixImage(d.ImagePath);
	d.Cover = fixImage(d.Cover);
	return d;
}

export async function getTotalCount(): Promise<number> {
	const res = await fetch(`${BASE}/api/getAll`);
	if (!res.ok) throw new Error(`getAll failed: ${res.status}`);
	return res.json();
}

export async function findByName(name: string): Promise<ApiFindResult> {
	const res = await fetch(`${BASE}/api/find/${encodeURIComponent(name)}`);
	if (!res.ok) throw new Error(`find failed: ${res.status}`);
	return res.json();
}

export async function getDetailsV1(id: number): Promise<ApiDetailsV1> {
	const res = await fetch(`${BASE}/v1/api/details/${id}`);
	if (!res.ok) throw new Error(`getDetailsV1 failed: ${res.status}`);
	return res.json();
}

export async function getDetailsFull(id: number): Promise<ApiDetailsFull> {
	const res = await fetch(`${BASE}/anime/api/details/${id}`);
	if (!res.ok) throw new Error(`getDetailsFull failed: ${res.status}`);
	const d = await res.json();
	if (d.local?.ImagePath) d.local.ImagePath = fixImage(d.local.ImagePath);
	if (d.local?.Cover) d.local.Cover = fixImage(d.local.Cover);
	return d;
}

export async function findByGenre(genre: string, page = 1): Promise<ApiGenrePage> {
	const res = await fetch(`${BASE}/api/findbyGenre/${encodeURIComponent(genre)}?Page=${page}`);
	if (!res.ok) throw new Error(`findByGenre failed: ${res.status}`);
	return res.json();
}

export async function checkAnime(name: string, genre: string | string[]): Promise<any> {
	const res = await fetch(`${BASE}/api/check`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ Name: name, Genre: genre }),
	});
	if (!res.ok) throw new Error(`check failed: ${res.status}`);
	return res.json();
}

export async function findByRating(page = 1): Promise<ApiRatingPage> {
	const res = await fetch(`${BASE}/api/findbyrating?page=${page}`);
	if (!res.ok) throw new Error(`findByRating failed: ${res.status}`);
	return res.json();
}

export async function quickSearch(name: string): Promise<ApiSearchResult[]> {
	const res = await fetch(`${BASE}/api/search/${encodeURIComponent(name)}`);
	if (!res.ok) throw new Error(`quickSearch failed: ${res.status}`);
	return res.json();
}

export async function searchAll(name: string, page = 1): Promise<ApiSearchAllPage> {
	const res = await fetch(`${BASE}/api/searchall/${encodeURIComponent(name)}?page=${page}`);
	if (!res.ok) throw new Error(`searchAll failed: ${res.status}`);
	return res.json();
}

export async function getLastId(): Promise<number> {
	const res = await fetch(`${BASE}/api/getlast`);
	if (!res.ok) throw new Error(`getLastId failed: ${res.status}`);
	return res.json();
}

export async function sortAnime(params: {
	name?: string;
	genre?: string;
	ratefrom?: number;
	rateto?: number;
	page?: number;
} = {}): Promise<ApiSortResult> {
	const qp = new URLSearchParams();
	if (params.name) qp.set('name', params.name);
	if (params.genre) qp.set('genre', params.genre);
	if (params.ratefrom !== undefined) qp.set('ratefrom', String(params.ratefrom));
	if (params.rateto !== undefined) qp.set('rateto', String(params.rateto));
	if (params.page) qp.set('page', String(params.page));
	const res = await fetch(`${BASE}/api/sort?${qp}`);
	if (!res.ok) throw new Error(`sort failed: ${res.status}`);
	const arr: [string, ApiAniDataItem[]] = await res.json();
	return { pages: Number(arr[0]), data: arr[1] };
}
