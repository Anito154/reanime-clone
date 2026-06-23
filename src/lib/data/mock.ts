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
	description: string;
	rating: number;
	ageRating: string;
	year: number;
	status: "ongoing" | "completed" | "upcoming";
	type: "TV" | "TV_SHORT" | "MOVIE" | "ONA" | "OVA" | "Special";
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

export const anilist = (id: string): string =>
	`https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/${id}`;

export const animeList: Anime[] = [
	{
		id: "slime-s4",
		title: "That Time I Got Reincarnated as a Slime Season 4",
		titleJapanese: "転生したらスライムだった件 第4期",
		image: anilist("bx182205-q2AeO1owuQbO.jpg"),
		banner: "https://picsum.photos/seed/slime-banner/1920/800",
		description:
			"The fourth season of Tensei Shitara Slime Datta Ken. Demon Lord Rimuru's dream of creating an alliance between humans and monsters takes a step closer to being realized. As Tempest continues to prosper, Granville Rozzo and his granddaughter, Maribel Rozzo, clash with Demon Lord Rimuru.",
		rating: 8.1,
		ageRating: "PG-13",
		year: 2026,
		status: "ongoing",
		type: "TV",
		genres: ["action", "fantasy", "adventure"],
		totalEpisodes: 24,
		duration: "24m",
		studio: "8bit",
		season: "Spring 2026",
		recommendations: [],
		episodes: Array.from({ length: 11 }, (_, i) => ({
			id: `slime-s4-ep-${i + 1}`,
			number: i + 1,
			title: `Episode ${i + 1}`,
			thumbnail: `https://picsum.photos/seed/slime-ep${i + 1}/640/360`,
			duration: "24m",
			aired: `2026-04-${String(5 + i).padStart(2, "0")}`
		}))
	},
	{
		id: "lord-of-mysteries-specials",
		title: "Lord of Mysteries Specials",
		titleJapanese: "",
		image: anilist("bx199448-BuqzEdkuPSEm.png"),
		banner: "https://picsum.photos/seed/lom-specials/1920/800",
		description: "Specials for Lord of Mysteries.",
		rating: 0,
		ageRating: "R-17+",
		year: 2026,
		status: "ongoing",
		type: "ONA",
		genres: ["fantasy", "mystery"],
		totalEpisodes: 3,
		duration: "24m",
		studio: "",
		season: "Spring 2026",
		recommendations: [],
		episodes: Array.from({ length: 1 }, (_, i) => ({
			id: `lom-specials-ep-${i + 1}`,
			number: i + 1,
			title: `Episode ${i + 1}`,
			thumbnail: `https://picsum.photos/seed/lom-ep${i + 1}/640/360`,
			duration: "24m",
			aired: "2026-06-01"
		}))
	},
	{
		id: "ever-night",
		title: "Ever Night",
		titleJapanese: "",
		image: anilist("bx186833-BnuqxWjFh1HR.png"),
		banner: "https://picsum.photos/seed/ever-night/1920/800",
		description: "Ever Night anime series.",
		rating: 0,
		ageRating: "PG-13",
		year: 2026,
		status: "ongoing",
		type: "ONA",
		genres: ["action", "fantasy"],
		totalEpisodes: 16,
		duration: "24m",
		studio: "",
		season: "Spring 2026",
		recommendations: [],
		episodes: Array.from({ length: 7 }, (_, i) => ({
			id: `ever-night-ep-${i + 1}`,
			number: i + 1,
			title: `Episode ${i + 1}`,
			thumbnail: `https://picsum.photos/seed/en-ep${i + 1}/640/360`,
			duration: "24m",
			aired: `2026-05-${String(1 + i).padStart(2, "0")}`
		}))
	},
	{
		id: "biaoren-2",
		title: "Biaoren 2",
		titleJapanese: "",
		image: anilist("bx168179-wKRVDrZWcT5k.jpg"),
		banner: "https://picsum.photos/seed/biaoren2/1920/800",
		description: "Biaoren season 2.",
		rating: 0,
		ageRating: "R-17+",
		year: 2026,
		status: "ongoing",
		type: "ONA",
		genres: ["action"],
		totalEpisodes: 0,
		duration: "24m",
		studio: "",
		season: "Spring 2026",
		recommendations: [],
		episodes: Array.from({ length: 3 }, (_, i) => ({
			id: `biaoren2-ep-${i + 1}`,
			number: i + 1,
			title: `Episode ${i + 1}`,
			thumbnail: `https://picsum.photos/seed/biaoren-ep${i + 1}/640/360`,
			duration: "24m",
			aired: `2026-05-${String(28 + i).padStart(2, "0")}`
		}))
	},
	{
		id: "rilakkuma",
		title: "RILAKKUMA",
		titleJapanese: "",
		image: anilist("b183231-z7SgjmXZBcoX.png"),
		banner: "https://picsum.photos/seed/rilakkuma/1920/800",
		description: "Rilakkuma anime series.",
		rating: 5.7,
		ageRating: "PG",
		year: 2026,
		status: "completed",
		type: "TV_SHORT",
		genres: ["slice-of-life", "comedy"],
		totalEpisodes: 11,
		duration: "1m",
		studio: "",
		season: "Spring 2026",
		recommendations: [],
		episodes: Array.from({ length: 11 }, (_, i) => ({
			id: `rilakkuma-ep-${i + 1}`,
			number: i + 1,
			title: `Episode ${i + 1}`,
			thumbnail: `https://picsum.photos/seed/rila-ep${i + 1}/640/360`,
			duration: "1m",
			aired: `2026-04-${String(1 + i).padStart(2, "0")}`
		}))
	},
	{
		id: "hokuto-no-ken",
		title: "FIST OF THE NORTH STAR: HOKUTO NO KEN",
		titleJapanese: "北斗の拳",
		image: anilist("bx169228-y79xDpZ29Vv4.jpg"),
		banner: "https://picsum.photos/seed/hokuto/1920/800",
		description: "Fist of the North Star.",
		rating: 5.8,
		ageRating: "R-17+",
		year: 2026,
		status: "completed",
		type: "TV",
		genres: ["action", "martial-arts"],
		totalEpisodes: 13,
		duration: "24m",
		studio: "",
		season: "Spring 2026",
		recommendations: [],
		episodes: Array.from({ length: 13 }, (_, i) => ({
			id: `hokuto-ep-${i + 1}`,
			number: i + 1,
			title: `Episode ${i + 1}`,
			thumbnail: `https://picsum.photos/seed/hokuto-ep${i + 1}/640/360`,
			duration: "24m",
			aired: `2026-04-${String(1 + i).padStart(2, "0")}`
		}))
	},
	{
		id: "botan-kamiina",
		title: "Botan Kamiina Fully Blossoms When Drunk",
		titleJapanese: "",
		image: anilist("bx187869-LUn3dyTzuKUq.jpg"),
		banner: "https://picsum.photos/seed/botan/1920/800",
		description: "Botan Kamiina anime series.",
		rating: 7.9,
		ageRating: "PG-13",
		year: 2026,
		status: "ongoing",
		type: "TV",
		genres: ["comedy", "romance"],
		totalEpisodes: 12,
		duration: "24m",
		studio: "",
		season: "Spring 2026",
		recommendations: [],
		episodes: Array.from({ length: 11 }, (_, i) => ({
			id: `botan-ep-${i + 1}`,
			number: i + 1,
			title: `Episode ${i + 1}`,
			thumbnail: `https://picsum.photos/seed/botan-ep${i + 1}/640/360`,
			duration: "24m",
			aired: `2026-04-${String(3 + i).padStart(2, "0")}`
		}))
	},
	{
		id: "drops-of-god",
		title: "The Drops of God",
		titleJapanese: "",
		image: anilist("bx202508-dk6LEyevJYUY.jpg"),
		banner: "https://picsum.photos/seed/drops-god/1920/800",
		description: "The Drops of God anime series.",
		rating: 5.4,
		ageRating: "PG-13",
		year: 2026,
		status: "ongoing",
		type: "TV",
		genres: ["drama", "slice-of-life"],
		totalEpisodes: 24,
		duration: "24m",
		studio: "",
		season: "Spring 2026",
		recommendations: [],
		episodes: Array.from({ length: 11 }, (_, i) => ({
			id: `drops-god-ep-${i + 1}`,
			number: i + 1,
			title: `Episode ${i + 1}`,
			thumbnail: `https://picsum.photos/seed/dgod-ep${i + 1}/640/360`,
			duration: "24m",
			aired: `2026-04-${String(5 + i).padStart(2, "0")}`
		}))
	},
	{
		id: "snowball-earth",
		title: "SNOWBALL EARTH",
		titleJapanese: "",
		image: anilist("bx196144-UqVOcMjThkqa.jpg"),
		banner: "https://picsum.photos/seed/snowball/1920/800",
		description: "SNOWBALL EARTH anime series.",
		rating: 6.2,
		ageRating: "PG-13",
		year: 2026,
		status: "ongoing",
		type: "TV",
		genres: ["sci-fi", "adventure"],
		totalEpisodes: 13,
		duration: "23m",
		studio: "",
		season: "Spring 2026",
		recommendations: [],
		episodes: Array.from({ length: 12 }, (_, i) => ({
			id: `snowball-ep-${i + 1}`,
			number: i + 1,
			title: `Episode ${i + 1}`,
			thumbnail: `https://picsum.photos/seed/sw-ep${i + 1}/640/360`,
			duration: "23m",
			aired: `2026-04-${String(2 + i).padStart(2, "0")}`
		}))
	},
	{
		id: "villainess-fiancee",
		title: "An Observation Log of My Fiancée Who Calls Herself a Villainess",
		titleJapanese: "",
		image: anilist("bx192808-tfrX4Gn2Y1Ye.jpg"),
		banner: "https://picsum.photos/seed/villainess/1920/800",
		description:
			"An Observation Log of My Fiancée Who Calls Herself a Villainess.",
		rating: 7.4,
		ageRating: "PG-13",
		year: 2026,
		status: "ongoing",
		type: "ONA",
		genres: ["romance", "comedy", "fantasy"],
		totalEpisodes: 12,
		duration: "24m",
		studio: "",
		season: "Spring 2026",
		recommendations: [],
		episodes: Array.from({ length: 10 }, (_, i) => ({
			id: `villainess-ep-${i + 1}`,
			number: i + 1,
			title: `Episode ${i + 1}`,
			thumbnail: `https://picsum.photos/seed/vill-ep${i + 1}/640/360`,
			duration: "24m",
			aired: `2026-04-${String(6 + i).padStart(2, "0")}`
		}))
	},
	{
		id: "angel-next-door-s2",
		title: "The Angel Next Door Spoils Me Rotten 2",
		titleJapanese: "",
		image: anilist("bx170019-djbN0b934MhE.jpg"),
		banner: "https://picsum.photos/seed/angel-s2/1920/800",
		description: "The Angel Next Door Spoils Me Rotten season 2.",
		rating: 7.5,
		ageRating: "PG-13",
		year: 2026,
		status: "ongoing",
		type: "TV",
		genres: ["romance", "slice-of-life"],
		totalEpisodes: 12,
		duration: "24m",
		studio: "",
		season: "Spring 2026",
		recommendations: [],
		episodes: Array.from({ length: 12 }, (_, i) => ({
			id: `angel-s2-ep-${i + 1}`,
			number: i + 1,
			title: `Episode ${i + 1}`,
			thumbnail: `https://picsum.photos/seed/angel-ep${i + 1}/640/360`,
			duration: "24m",
			aired: `2026-04-${String(7 + i).padStart(2, "0")}`
		}))
	},
	{
		id: "monster-eater",
		title: "Monster Eater",
		titleJapanese: "",
		image: anilist("bx210234-MZaMjdbBzEHz.jpg"),
		banner: "https://picsum.photos/seed/monster-eater/1920/800",
		description: "Monster Eater anime series.",
		rating: 4.1,
		ageRating: "PG-13",
		year: 2026,
		status: "ongoing",
		type: "TV_SHORT",
		genres: ["action", "fantasy"],
		totalEpisodes: 0,
		duration: "24m",
		studio: "",
		season: "Spring 2026",
		recommendations: [],
		episodes: Array.from({ length: 12 }, (_, i) => ({
			id: `me-ep-${i + 1}`,
			number: i + 1,
			title: `Episode ${i + 1}`,
			thumbnail: `https://picsum.photos/seed/me-ep${i + 1}/640/360`,
			duration: "24m",
			aired: `2026-04-${String(8 + i).padStart(2, "0")}`
		}))
	},
	{
		id: "magi-labyrinth",
		title: "Magi: The Labyrinth of Magic",
		titleJapanese: "マギ",
		image: anilist("bx14513-HuUdrFFYftA7.jpg"),
		banner: "https://picsum.photos/seed/magi/1920/800",
		description: "Magi: The Labyrinth of Magic.",
		rating: 7.8,
		ageRating: "PG-13",
		year: 2012,
		status: "completed",
		type: "TV",
		genres: ["action", "adventure", "fantasy"],
		totalEpisodes: 25,
		duration: "24m",
		studio: "A-1 Pictures",
		season: "Fall 2012",
		recommendations: [],
		episodes: Array.from({ length: 25 }, (_, i) => ({
			id: `magi-ep-${i + 1}`,
			number: i + 1,
			title: `Episode ${i + 1}`,
			thumbnail: `https://picsum.photos/seed/magi-ep${i + 1}/640/360`,
			duration: "24m",
			aired: `2012-10-${String(7 + i).padStart(2, "0")}`
		}))
	},
	{
		id: "konosuba-movie",
		title:
			"KONOSUBA -God's blessing on this wonderful world!- Legend of Crimson",
		titleJapanese: "この素晴らしい世界に祝福を！　紅伝説",
		image: anilist("bx102976-2Yi5icRbjukO.png"),
		banner: "https://picsum.photos/seed/konosuba-movie/1920/800",
		description: "KONOSUBA movie.",
		rating: 8.2,
		ageRating: "PG-13",
		year: 2019,
		status: "completed",
		type: "MOVIE",
		genres: ["comedy", "fantasy", "adventure"],
		totalEpisodes: 1,
		duration: "1m",
		studio: "J.C.Staff",
		season: "Summer 2019",
		recommendations: [],
		episodes: []
	},
	{
		id: "bookworm-s3",
		title: "Ascendance of a Bookworm Season 3",
		titleJapanese: "本好きの下剋上 第3部",
		image: anilist("bx121176-qWobMmSf761W.jpg"),
		banner: "https://picsum.photos/seed/bookworm-s3/1920/800",
		description: "Ascendance of a Bookworm Season 3.",
		rating: 7.9,
		ageRating: "PG-13",
		year: 2022,
		status: "completed",
		type: "TV",
		genres: ["fantasy", "slice-of-life"],
		totalEpisodes: 10,
		duration: "24m",
		studio: "Ajia-do",
		season: "Spring 2022",
		recommendations: [],
		episodes: Array.from({ length: 10 }, (_, i) => ({
			id: `bw-s3-ep-${i + 1}`,
			number: i + 1,
			title: `Episode ${i + 1}`,
			thumbnail: `https://picsum.photos/seed/bw3-ep${i + 1}/640/360`,
			duration: "24m",
			aired: `2022-04-${String(4 + i).padStart(2, "0")}`
		}))
	},
	{
		id: "bookworm-p2",
		title: "Ascendance of a Bookworm Part 2",
		titleJapanese: "本好きの下克上 第2部",
		image: anilist("bx113693-3tHbslFxD47R.jpg"),
		banner: "https://picsum.photos/seed/bookworm-p2/1920/800",
		description: "Ascendance of a Bookworm Part 2.",
		rating: 7.9,
		ageRating: "PG-13",
		year: 2020,
		status: "completed",
		type: "TV",
		genres: ["fantasy", "slice-of-life"],
		totalEpisodes: 12,
		duration: "24m",
		studio: "Ajia-do",
		season: "Spring 2020",
		recommendations: [],
		episodes: Array.from({ length: 12 }, (_, i) => ({
			id: `bw-p2-ep-${i + 1}`,
			number: i + 1,
			title: `Episode ${i + 1}`,
			thumbnail: `https://picsum.photos/seed/bw2-ep${i + 1}/640/360`,
			duration: "24m",
			aired: `2020-04-${String(5 + i).padStart(2, "0")}`
		}))
	},
	{
		id: "bookworm",
		title: "Ascendance of a Bookworm",
		titleJapanese: "本好きの下剋上",
		image: anilist("bx108268-Dtt82uOi3vq5.jpg"),
		banner: "https://picsum.photos/seed/bookworm/1920/800",
		description: "Ascendance of a Bookworm.",
		rating: 7.8,
		ageRating: "PG-13",
		year: 2019,
		status: "completed",
		type: "TV",
		genres: ["fantasy", "slice-of-life"],
		totalEpisodes: 14,
		duration: "24m",
		studio: "Ajia-do",
		season: "Fall 2019",
		recommendations: [],
		episodes: Array.from({ length: 14 }, (_, i) => ({
			id: `bw-ep-${i + 1}`,
			number: i + 1,
			title: `Episode ${i + 1}`,
			thumbnail: `https://picsum.photos/seed/bw1-ep${i + 1}/640/360`,
			duration: "24m",
			aired: `2019-10-${String(3 + i).padStart(2, "0")}`
		}))
	},
	{
		id: "baki-dou",
		title: "BAKI-DOU: The Invincible Samurai",
		titleJapanese: "バキ道",
		image: anilist("bx176509-GRUa4fzyAM9u.jpg"),
		banner: "https://picsum.photos/seed/baki-dou/1920/800",
		description: "Baki-Dou series.",
		rating: 7.5,
		ageRating: "R-17+",
		year: 2026,
		status: "completed",
		type: "ONA",
		genres: ["action", "martial-arts"],
		totalEpisodes: 13,
		duration: "25m",
		studio: "",
		season: "Spring 2026",
		recommendations: [],
		episodes: Array.from({ length: 13 }, (_, i) => ({
			id: `baki-dou-ep-${i + 1}`,
			number: i + 1,
			title: `Episode ${i + 1}`,
			thumbnail: `https://picsum.photos/seed/bakidou-ep${i + 1}/640/360`,
			duration: "25m",
			aired: `2026-04-${String(1 + i).padStart(2, "0")}`
		}))
	},
	{
		id: "zls",
		title: "ZOMBIE LAND SAGA",
		titleJapanese: "ゾンビランドサガ",
		image: anilist("bx103871-KEWbn3fkz499.png"),
		banner: "https://picsum.photos/seed/zls/1920/800",
		description: "Zombie Land Saga.",
		rating: 7.4,
		ageRating: "R-17+",
		year: 2018,
		status: "completed",
		type: "TV",
		genres: ["comedy", "music", "horror"],
		totalEpisodes: 12,
		duration: "24m",
		studio: "MAPPA",
		season: "Fall 2018",
		recommendations: [],
		episodes: Array.from({ length: 12 }, (_, i) => ({
			id: `zls-ep-${i + 1}`,
			number: i + 1,
			title: `Episode ${i + 1}`,
			thumbnail: `https://picsum.photos/seed/zls-ep${i + 1}/640/360`,
			duration: "24m",
			aired: `2018-10-${String(4 + i).padStart(2, "0")}`
		}))
	},
	{
		id: "slime-movie",
		title:
			"That Time I Got Reincarnated as a Slime the Movie: Scarlet Bond",
		titleJapanese: "劇場版 転生したらスライムだった件 紅蓮の絆編",
		image: anilist("bx139498-DdVASeAj7ag4.jpg"),
		banner: "https://picsum.photos/seed/slime-movie/1920/800",
		description: "Slime movie.",
		rating: 7.7,
		ageRating: "PG-13",
		year: 2022,
		status: "completed",
		type: "MOVIE",
		genres: ["action", "fantasy", "adventure"],
		totalEpisodes: 1,
		duration: "1m",
		studio: "8bit",
		season: "Fall 2022",
		recommendations: [],
		episodes: []
	},
	{
		id: "zls-movie",
		title: "Zombie Land Saga: Yumeginga Paradise",
		titleJapanese: "ゾンビランドサガ ゆめぎんがパラダイス",
		image: anilist("bx140337-8EtbiPurofcC.jpg"),
		banner: "https://picsum.photos/seed/zls-movie/1920/800",
		description: "Zombie Land Saga movie.",
		rating: 7.8,
		ageRating: "R-17+",
		year: 2025,
		status: "completed",
		type: "MOVIE",
		genres: ["comedy", "music"],
		totalEpisodes: 1,
		duration: "2m",
		studio: "",
		season: "Summer 2025",
		recommendations: [],
		episodes: []
	},
	{
		id: "danmachi-iv-p2",
		title:
			"Is It Wrong to Try to Pick Up Girls in a Dungeon? IV Part 2",
		titleJapanese:
			"ダンジョンに出会いを求めるのは間違っているだろうかIV 第2クール",
		image: anilist("bx155211-GHT9uzXEkYS7.png"),
		banner: "https://picsum.photos/seed/danmachi-iv/1920/800",
		description: "DanMachi IV Part 2.",
		rating: 8.2,
		ageRating: "R-17+",
		year: 2023,
		status: "completed",
		type: "TV",
		genres: ["action", "fantasy", "adventure"],
		totalEpisodes: 11,
		duration: "24m",
		studio: "J.C.Staff",
		season: "Winter 2023",
		recommendations: [],
		episodes: Array.from({ length: 11 }, (_, i) => ({
			id: `danmachi-iv-ep-${i + 1}`,
			number: i + 1,
			title: `Episode ${i + 1}`,
			thumbnail: `https://picsum.photos/seed/danmachi-ep${i + 1}/640/360`,
			duration: "24m",
			aired: `2023-01-${String(5 + i).padStart(2, "0")}`
		}))
	},
	{
		id: "princess-principal",
		title: "Princess Principal",
		titleJapanese: "プリンセス・プリンシパル",
		image: anilist("bx98505-uxUXC7fQ9lMk.jpg"),
		banner: "https://picsum.photos/seed/princess-p/1920/800",
		description: "Princess Principal.",
		rating: 7.5,
		ageRating: "R-17+",
		year: 2017,
		status: "completed",
		type: "TV",
		genres: ["action", "thriller", "historical"],
		totalEpisodes: 12,
		duration: "24m",
		studio: "Studio 3Hz",
		season: "Summer 2017",
		recommendations: [],
		episodes: Array.from({ length: 12 }, (_, i) => ({
			id: `pp-ep-${i + 1}`,
			number: i + 1,
			title: `Episode ${i + 1}`,
			thumbnail: `https://picsum.photos/seed/pp-ep${i + 1}/640/360`,
			duration: "24m",
			aired: `2017-07-${String(9 + i).padStart(2, "0")}`
		}))
	},
	{
		id: "love-live-bloom",
		title:
			"Love Live! Hasunosora Jogakuin School Idol Club: Bloom Garden Party",
		titleJapanese: "",
		image: anilist("bx194167-kPUIZQFObAau.jpg"),
		banner: "https://picsum.photos/seed/ll-bloom/1920/800",
		description: "Love Live! movie.",
		rating: 0,
		ageRating: "PG",
		year: 2026,
		status: "upcoming",
		type: "MOVIE",
		genres: ["music", "slice-of-life"],
		totalEpisodes: 1,
		duration: "24m",
		studio: "",
		season: "Summer 2026",
		recommendations: [],
		episodes: []
	},
	{
		id: "mahouka-yotsuba",
		title: "Mahouka Koukou no Rettousei: Yotsuba Keishou-hen",
		titleJapanese: "魔法科高校の劣等生 四葉継承編",
		image: anilist("bx178707-Ys8zvR7BLECi.jpg"),
		banner: "https://picsum.photos/seed/mahouka-yotsuba/1920/800",
		description: "Mahouka Yotsuba Succession Arc.",
		rating: 0,
		ageRating: "PG-13",
		year: 2026,
		status: "upcoming",
		type: "MOVIE",
		genres: ["action", "sci-fi", "fantasy"],
		totalEpisodes: 0,
		duration: "24m",
		studio: "",
		season: "Summer 2026",
		recommendations: [],
		episodes: []
	},
	{
		id: "patlabor-ezy",
		title: "Kidou Keisatsu Patlabor EZY",
		titleJapanese: "機動警察パトレイバー EZY",
		image: anilist("bx113555-2V56Q1SZ3zpU.jpg"),
		banner: "https://picsum.photos/seed/patlabor/1920/800",
		description: "Patlabor EZY.",
		rating: 0,
		ageRating: "PG-13",
		year: 2026,
		status: "upcoming",
		type: "MOVIE",
		genres: ["mecha", "sci-fi", "comedy"],
		totalEpisodes: 0,
		duration: "24m",
		studio: "",
		season: "Summer 2026",
		recommendations: [],
		episodes: []
	},
	{
		id: "mononoke-hebigami",
		title: "Mononoke: Hebigami",
		titleJapanese: "モノノ怪 へびがみ",
		image: anilist("bx179874-JXaQoBDuaYlq.jpg"),
		banner: "https://picsum.photos/seed/mononoke-h/1920/800",
		description: "Mononoke movie.",
		rating: 0,
		ageRating: "R-17+",
		year: 2026,
		status: "upcoming",
		type: "MOVIE",
		genres: ["horror", "mystery", "supernatural"],
		totalEpisodes: 1,
		duration: "24m",
		studio: "",
		season: "Summer 2026",
		recommendations: [],
		episodes: []
	},
	{
		id: "anpanman",
		title: "Soreike! Anpanman: Pantan to Yakusoku no Hoshi",
		titleJapanese: "それいけ！アンパンマン ばんたんと約束の星",
		image: anilist("bx206682-CV51UmTvQJ84.png"),
		banner: "https://picsum.photos/seed/anpanman/1920/800",
		description: "Anpanman movie.",
		rating: 0,
		ageRating: "PG",
		year: 2026,
		status: "upcoming",
		type: "MOVIE",
		genres: ["kids", "adventure"],
		totalEpisodes: 1,
		duration: "24m",
		studio: "",
		season: "Summer 2026",
		recommendations: [],
		episodes: []
	},
	{
		id: "keroro-movie",
		title:
			"Shin Keroro Gunsou Movie: Fukkatsushite Sokkou Chikyuu Metsubou no Kiki de Arimasu!",
		titleJapanese:
			"新・ケロロ軍曹 復活して即行地球滅亡の危機であります！",
		image: anilist("bx176636-zPyFoYfFYZLo.jpg"),
		banner: "https://picsum.photos/seed/keroro-movie/1920/800",
		description: "Keroro movie.",
		rating: 0,
		ageRating: "PG",
		year: 2026,
		status: "upcoming",
		type: "MOVIE",
		genres: ["comedy", "sci-fi"],
		totalEpisodes: 1,
		duration: "24m",
		studio: "",
		season: "Summer 2026",
		recommendations: [],
		episodes: []
	},
	{
		id: "smoking-supermarket",
		title: "Smoking Behind the Supermarket with You",
		titleJapanese: "",
		image: anilist("bx196187-cXhET893v3Ag.png"),
		banner: "https://picsum.photos/seed/smoking-super/1920/800",
		description: "Smoking Behind the Supermarket with You.",
		rating: 0,
		ageRating: "PG-13",
		year: 2026,
		status: "upcoming",
		type: "TV",
		genres: ["romance", "slice-of-life", "comedy"],
		totalEpisodes: 0,
		duration: "24m",
		studio: "",
		season: "Summer 2026",
		recommendations: [],
		episodes: []
	},
	{
		id: "tsuihou-sareta",
		title:
			"Tsuihou Sareta Tensei Juukishi wa Game Chishiki de Musou Suru",
		titleJapanese: "追放された転生重騎士はゲーム知識で無双する",
		image: anilist("bx180136-gtMTCRlOD4OE.jpg"),
		banner: "https://picsum.photos/seed/tsuihou/1920/800",
		description: "Tsuihou Sareta Tensei Juukishi.",
		rating: 0,
		ageRating: "PG-13",
		year: 2026,
		status: "upcoming",
		type: "TV",
		genres: ["action", "fantasy"],
		totalEpisodes: 0,
		duration: "24m",
		studio: "",
		season: "Summer 2026",
		recommendations: [],
		episodes: []
	},
	{
		id: "yani-neko",
		title: "Yani Neko",
		titleJapanese: "",
		image: anilist("bx207141-qaJCCdx1DWtK.jpg"),
		banner: "https://picsum.photos/seed/yani-neko/1920/800",
		description: "Yani Neko.",
		rating: 0,
		ageRating: "PG-13",
		year: 2026,
		status: "upcoming",
		type: "TV",
		genres: ["comedy"],
		totalEpisodes: 0,
		duration: "24m",
		studio: "",
		season: "Summer 2026",
		recommendations: [],
		episodes: []
	},
	{
		id: "uchi-no-otouto",
		title: "Uchi no Otouto-domo ga Sumimasen",
		titleJapanese: "",
		image: anilist("bx203490-D6GOKA0OWblB.jpg"),
		banner: "https://picsum.photos/seed/uchi-otouto/1920/800",
		description: "Uchi no Otouto-domo ga Sumimasen.",
		rating: 0,
		ageRating: "PG-13",
		year: 2026,
		status: "upcoming",
		type: "TV",
		genres: ["comedy", "slice-of-life"],
		totalEpisodes: 24,
		duration: "24m",
		studio: "",
		season: "Summer 2026",
		recommendations: [],
		episodes: []
	},
	{
		id: "pan-no-akachan",
		title: "Pan no Akachan (TV)",
		titleJapanese: "",
		image: anilist("bx212308-HUdh20Djd7cm.jpg"),
		banner: "https://picsum.photos/seed/pan-akachan/1920/800",
		description: "Pan no Akachan.",
		rating: 0,
		ageRating: "PG",
		year: 2026,
		status: "upcoming",
		type: "TV",
		genres: ["fantasy", "slice-of-life"],
		totalEpisodes: 0,
		duration: "24m",
		studio: "",
		season: "Summer 2026",
		recommendations: [],
		episodes: []
	},
	{
		id: "nanoha-exceeds",
		title:
			"Magical Girl Lyrical Nanoha EXCEEDS Gun Blaze Vengeance",
		titleJapanese: "",
		image: anilist("bx185875-86GIL6o4uhdK.png"),
		banner: "https://picsum.photos/seed/nanoha-exceeds/1920/800",
		description: "Nanoha EXCEEDS.",
		rating: 0,
		ageRating: "PG-13",
		year: 2026,
		status: "upcoming",
		type: "TV",
		genres: ["action", "magical-girl", "sci-fi"],
		totalEpisodes: 0,
		duration: "24m",
		studio: "",
		season: "Summer 2026",
		recommendations: [],
		episodes: []
	}
];

export const latestEpisodes: LatestEpisodeItem[] = animeList
	.filter((a) => a.episodes.length > 0 && a.status !== "upcoming")
	.map((a) => ({
		anime: a,
		latestEpisode: a.episodes[a.episodes.length - 1]
	}))
	.sort(
		(a, b) =>
			new Date(b.latestEpisode.aired).getTime() -
			new Date(a.latestEpisode.aired).getTime()
	);

export const newOnSite: (Anime | undefined)[] = [
	animeList.find((a) => a.id === "magi-labyrinth"),
	animeList.find((a) => a.id === "lord-of-mysteries-specials"),
	animeList.find((a) => a.id === "konosuba-movie"),
	animeList.find((a) => a.id === "bookworm-s3"),
	animeList.find((a) => a.id === "bookworm-p2"),
	animeList.find((a) => a.id === "bookworm"),
	animeList.find((a) => a.id === "baki-dou"),
	animeList.find((a) => a.id === "zls"),
	animeList.find((a) => a.id === "slime-movie"),
	animeList.find((a) => a.id === "zls-movie"),
	animeList.find((a) => a.id === "danmachi-iv-p2"),
	animeList.find((a) => a.id === "princess-principal")
];

export const upcomingAnime: (Anime | undefined)[] = [
	animeList.find((a) => a.id === "love-live-bloom"),
	animeList.find((a) => a.id === "mahouka-yotsuba"),
	animeList.find((a) => a.id === "patlabor-ezy"),
	animeList.find((a) => a.id === "mononoke-hebigami"),
	animeList.find((a) => a.id === "anpanman"),
	animeList.find((a) => a.id === "keroro-movie"),
	animeList.find((a) => a.id === "smoking-supermarket"),
	animeList.find((a) => a.id === "tsuihou-sareta"),
	animeList.find((a) => a.id === "yani-neko"),
	animeList.find((a) => a.id === "uchi-no-otouto"),
	animeList.find((a) => a.id === "pan-no-akachan"),
	animeList.find((a) => a.id === "nanoha-exceeds")
];

export const continueWatching: ContinueWatchingItem[] = [
	{
		animeId: "slime-s4",
		episodeId: "slime-s4-ep-9",
		progress: 65,
		timestamp: Date.now() - 36e5
	},
	{
		animeId: "botan-kamiina",
		episodeId: "botan-ep-10",
		progress: 30,
		timestamp: Date.now() - 72e5
	},
	{
		animeId: "snowball-earth",
		episodeId: "sw-ep-11",
		progress: 85,
		timestamp: Date.now() - 864e5
	}
];

export function getAnimeById(id: string): Anime | undefined {
	return animeList.find((a) => a.id === id);
}
