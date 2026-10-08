import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { n as pullClub, r as pullLeague } from "./pull-BBUeCpIN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/refresh-OYVL_Z6e.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var refreshLeague_createServerFn_handler = createServerRpc({
	id: "7e6aed5e96cb1255b10a335ec3bbb006704811037f21a4991df023e2144a9cd8",
	name: "refreshLeague",
	filename: "src/lib/nhl/refresh.ts"
}, (opts) => refreshLeague.__executeServer(opts));
var refreshLeague = createServerFn({ method: "GET" }).handler(refreshLeague_createServerFn_handler, async () => {
	return pullLeague({ withRosters: false });
});
var refreshClub_createServerFn_handler = createServerRpc({
	id: "e479f52be1dcc5c836803e756abe71c5a4f4226dcaa2d773d2c4f04733980805",
	name: "refreshClub",
	filename: "src/lib/nhl/refresh.ts"
}, (opts) => refreshClub.__executeServer(opts));
var refreshClub = createServerFn({ method: "POST" }).validator((abbrev) => {
	const clean = abbrev.toUpperCase();
	if (!/^[A-Z]{2,4}$/.test(clean)) throw new Error("Unknown club");
	return clean;
}).handler(refreshClub_createServerFn_handler, async ({ data }) => pullClub(data));
//#endregion
export { refreshClub_createServerFn_handler, refreshLeague_createServerFn_handler };
