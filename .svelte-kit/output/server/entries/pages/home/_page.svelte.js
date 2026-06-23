import "../../../chunks/server.js";
import { t as HomeContent } from "../../../chunks/HomeContent.js";
//#region src/routes/home/+page.svelte
function _page($$renderer) {
	HomeContent($$renderer, {});
}
//#endregion
export { _page as default };
