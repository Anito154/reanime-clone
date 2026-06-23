
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/anime" | "/anime/[id]" | "/anime/[id]/watch" | "/home" | "/my-list" | "/schedule" | "/search" | "/settings" | "/watch" | "/watch/[slug]";
		RouteParams(): {
			"/anime/[id]": { id: string };
			"/anime/[id]/watch": { id: string };
			"/watch/[slug]": { slug: string }
		};
		LayoutParams(): {
			"/": { id?: string | undefined; slug?: string | undefined };
			"/anime": { id?: string | undefined };
			"/anime/[id]": { id: string };
			"/anime/[id]/watch": { id: string };
			"/home": Record<string, never>;
			"/my-list": Record<string, never>;
			"/schedule": Record<string, never>;
			"/search": Record<string, never>;
			"/settings": Record<string, never>;
			"/watch": { slug?: string | undefined };
			"/watch/[slug]": { slug: string }
		};
		Pathname(): "/" | "/anime" | `/anime/${string}` & {} | `/anime/${string}/watch` & {} | "/home" | "/my-list" | "/schedule" | "/search" | "/settings" | `/watch/${string}` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/collage.png" | "/favicon.svg" | "/logo.png" | "/logo.svg" | string & {};
	}
}