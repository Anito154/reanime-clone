

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/schedule/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.v8hXOy-b.js","_app/immutable/chunks/B2mK20LP.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/BPEOpMne.js"];
export const stylesheets = [];
export const fonts = [];
