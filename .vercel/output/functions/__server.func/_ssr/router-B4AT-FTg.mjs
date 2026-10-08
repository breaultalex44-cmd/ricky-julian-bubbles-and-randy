import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, _ as createFileRoute, b as useRouter, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, v as createRootRoute, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B4AT-FTg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var nhl_default = {
	updatedAt: "2026-10-08T16:52:06.677Z",
	season: "2026-27",
	asOf: "2026-10-08",
	cycleLock: "2026-10-06",
	nextLock: "2026-10-10",
	dayLock: "2026-10-07",
	teams: [
		{
			"abbrev": "NYR",
			"name": "New York Rangers",
			"common": "Rangers",
			"place": "NY Rangers",
			"logo": "https://assets.nhle.com/logos/nhl/svg/NYR_light.svg",
			"conference": "Eastern",
			"division": "Metropolitan",
			"gp": 5,
			"w": 4,
			"l": 1,
			"otl": 0,
			"pts": 8,
			"ptPct": .8,
			"gf": 16,
			"ga": 8,
			"diff": 8,
			"rw": 4,
			"row": 4,
			"streak": "W4",
			"l10Pts": 8,
			"l10Diff": 8,
			"l10Record": "4-1-0",
			"homePts": 6,
			"homeGp": 3,
			"roadPts": 2,
			"roadGp": 2,
			"seq": 1,
			"pp": .21428,
			"pk": .875,
			"ppG": 3,
			"ppOpp": 14,
			"pkGa": 2,
			"shTimes": 16,
			"shG": 0,
			"fo": .522491,
			"sat": .471291,
			"sf": 23.2,
			"sa": 23.6,
			"hits": 135,
			"blocks": 86
		},
		{
			"abbrev": "EDM",
			"name": "Edmonton Oilers",
			"common": "Oilers",
			"place": "Edmonton",
			"logo": "https://assets.nhle.com/logos/nhl/svg/EDM_light.svg",
			"conference": "Western",
			"division": "Pacific",
			"gp": 4,
			"w": 3,
			"l": 0,
			"otl": 1,
			"pts": 7,
			"ptPct": .875,
			"gf": 22,
			"ga": 16,
			"diff": 6,
			"rw": 3,
			"row": 3,
			"streak": "W3",
			"l10Pts": 7,
			"l10Diff": 6,
			"l10Record": "3-0-1",
			"homePts": 3,
			"homeGp": 2,
			"roadPts": 4,
			"roadGp": 2,
			"seq": 2,
			"pp": .25,
			"pk": .64285,
			"ppG": 4,
			"ppOpp": 16,
			"pkGa": 5,
			"shTimes": 14,
			"shG": 2,
			"fo": .535269,
			"sat": .524539,
			"sf": 28.25,
			"sa": 24,
			"hits": 117,
			"blocks": 55
		},
		{
			"abbrev": "WPG",
			"name": "Winnipeg Jets",
			"common": "Jets",
			"place": "Winnipeg",
			"logo": "https://assets.nhle.com/logos/nhl/svg/WPG_light.svg",
			"conference": "Western",
			"division": "Central",
			"gp": 4,
			"w": 3,
			"l": 0,
			"otl": 1,
			"pts": 7,
			"ptPct": .875,
			"gf": 12,
			"ga": 10,
			"diff": 2,
			"rw": 3,
			"row": 3,
			"streak": "W3",
			"l10Pts": 7,
			"l10Diff": 2,
			"l10Record": "3-0-1",
			"homePts": 3,
			"homeGp": 2,
			"roadPts": 4,
			"roadGp": 2,
			"seq": 3,
			"pp": .4,
			"pk": .9,
			"ppG": 4,
			"ppOpp": 10,
			"pkGa": 1,
			"shTimes": 10,
			"shG": 0,
			"fo": .457983,
			"sat": .44878,
			"sf": 28.5,
			"sa": 32.75,
			"hits": 80,
			"blocks": 61
		},
		{
			"abbrev": "UTA",
			"name": "Utah Mammoth",
			"common": "Mammoth",
			"place": "Utah",
			"logo": "https://assets.nhle.com/logos/nhl/svg/UTA_light.svg",
			"conference": "Western",
			"division": "Central",
			"gp": 4,
			"w": 3,
			"l": 1,
			"otl": 0,
			"pts": 6,
			"ptPct": .75,
			"gf": 17,
			"ga": 8,
			"diff": 9,
			"rw": 3,
			"row": 3,
			"streak": "W1",
			"l10Pts": 6,
			"l10Diff": 9,
			"l10Record": "3-1-0",
			"homePts": 2,
			"homeGp": 1,
			"roadPts": 4,
			"roadGp": 3,
			"seq": 4,
			"pp": .61538,
			"pk": .92857,
			"ppG": 8,
			"ppOpp": 13,
			"pkGa": 1,
			"shTimes": 14,
			"shG": 0,
			"fo": .529914,
			"sat": .555844,
			"sf": 31,
			"sa": 22.25,
			"hits": 121,
			"blocks": 65
		},
		{
			"abbrev": "VGK",
			"name": "Vegas Golden Knights",
			"common": "Golden Knights",
			"place": "Vegas",
			"logo": "https://assets.nhle.com/logos/nhl/svg/VGK_light.svg",
			"conference": "Western",
			"division": "Pacific",
			"gp": 4,
			"w": 3,
			"l": 1,
			"otl": 0,
			"pts": 6,
			"ptPct": .75,
			"gf": 17,
			"ga": 10,
			"diff": 7,
			"rw": 3,
			"row": 3,
			"streak": "W2",
			"l10Pts": 6,
			"l10Diff": 7,
			"l10Record": "3-1-0",
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 4,
			"roadGp": 2,
			"seq": 5,
			"pp": .3125,
			"pk": .83333,
			"ppG": 5,
			"ppOpp": 16,
			"pkGa": 2,
			"shTimes": 12,
			"shG": 1,
			"fo": .530434,
			"sat": .56213,
			"sf": 30.75,
			"sa": 23.25,
			"hits": 76,
			"blocks": 41
		},
		{
			"abbrev": "FLA",
			"name": "Florida Panthers",
			"common": "Panthers",
			"place": "Florida",
			"logo": "https://assets.nhle.com/logos/nhl/svg/FLA_light.svg",
			"conference": "Eastern",
			"division": "Atlantic",
			"gp": 4,
			"w": 2,
			"l": 0,
			"otl": 2,
			"pts": 6,
			"ptPct": .75,
			"gf": 8,
			"ga": 8,
			"diff": 0,
			"rw": 1,
			"row": 2,
			"streak": "W1",
			"l10Pts": 6,
			"l10Diff": 0,
			"l10Record": "2-0-2",
			"homePts": 0,
			"homeGp": 0,
			"roadPts": 6,
			"roadGp": 4,
			"seq": 6,
			"pp": .04347,
			"pk": .78947,
			"ppG": 1,
			"ppOpp": 23,
			"pkGa": 4,
			"shTimes": 19,
			"shG": 0,
			"fo": .502183,
			"sat": .594982,
			"sf": 26.75,
			"sa": 21.75,
			"hits": 144,
			"blocks": 50
		},
		{
			"abbrev": "MIN",
			"name": "Minnesota Wild",
			"common": "Wild",
			"place": "Minnesota",
			"logo": "https://assets.nhle.com/logos/nhl/svg/MIN_light.svg",
			"conference": "Western",
			"division": "Central",
			"gp": 3,
			"w": 2,
			"l": 0,
			"otl": 1,
			"pts": 5,
			"ptPct": .833333,
			"gf": 9,
			"ga": 5,
			"diff": 4,
			"rw": 2,
			"row": 2,
			"streak": "OT1",
			"l10Pts": 5,
			"l10Diff": 4,
			"l10Record": "2-0-1",
			"homePts": 2,
			"homeGp": 1,
			"roadPts": 3,
			"roadGp": 2,
			"seq": 7,
			"pp": .36363,
			"pk": 1,
			"ppG": 4,
			"ppOpp": 11,
			"pkGa": 0,
			"shTimes": 9,
			"shG": 0,
			"fo": .48,
			"sat": .506276,
			"sf": 26.66666,
			"sa": 25,
			"hits": 61,
			"blocks": 38
		},
		{
			"abbrev": "CAR",
			"name": "Carolina Hurricanes",
			"common": "Hurricanes",
			"place": "Carolina",
			"logo": "https://assets.nhle.com/logos/nhl/svg/CAR_light.svg",
			"conference": "Eastern",
			"division": "Metropolitan",
			"gp": 4,
			"w": 2,
			"l": 1,
			"otl": 1,
			"pts": 5,
			"ptPct": .625,
			"gf": 11,
			"ga": 12,
			"diff": -1,
			"rw": 1,
			"row": 2,
			"streak": "W2",
			"l10Pts": 5,
			"l10Diff": -1,
			"l10Record": "2-1-1",
			"homePts": 1,
			"homeGp": 2,
			"roadPts": 4,
			"roadGp": 2,
			"seq": 8,
			"pp": .19047,
			"pk": .89473,
			"ppG": 4,
			"ppOpp": 21,
			"pkGa": 2,
			"shTimes": 19,
			"shG": 0,
			"fo": .520833,
			"sat": .596026,
			"sf": 30.25,
			"sa": 21.25,
			"hits": 116,
			"blocks": 51
		},
		{
			"abbrev": "COL",
			"name": "Colorado Avalanche",
			"common": "Avalanche",
			"place": "Colorado",
			"logo": "https://assets.nhle.com/logos/nhl/svg/COL_light.svg",
			"conference": "Western",
			"division": "Central",
			"gp": 3,
			"w": 2,
			"l": 1,
			"otl": 0,
			"pts": 4,
			"ptPct": .666667,
			"gf": 16,
			"ga": 8,
			"diff": 8,
			"rw": 2,
			"row": 2,
			"streak": "L1",
			"l10Pts": 4,
			"l10Diff": 8,
			"l10Record": "2-1-0",
			"homePts": 4,
			"homeGp": 2,
			"roadPts": 0,
			"roadGp": 1,
			"seq": 9,
			"pp": .4,
			"pk": 1,
			"ppG": 4,
			"ppOpp": 10,
			"pkGa": 0,
			"shTimes": 8,
			"shG": 0,
			"fo": .481081,
			"sat": .533557,
			"sf": 33,
			"sa": 25.33333,
			"hits": 54,
			"blocks": 42
		},
		{
			"abbrev": "WSH",
			"name": "Washington Capitals",
			"common": "Capitals",
			"place": "Washington",
			"logo": "https://assets.nhle.com/logos/nhl/svg/WSH_secondary_light.svg",
			"conference": "Eastern",
			"division": "Metropolitan",
			"gp": 3,
			"w": 2,
			"l": 1,
			"otl": 0,
			"pts": 4,
			"ptPct": .666667,
			"gf": 11,
			"ga": 8,
			"diff": 3,
			"rw": 2,
			"row": 2,
			"streak": "W1",
			"l10Pts": 4,
			"l10Diff": 3,
			"l10Record": "2-1-0",
			"homePts": 2,
			"homeGp": 1,
			"roadPts": 2,
			"roadGp": 2,
			"seq": 10,
			"pp": .25,
			"pk": .91666,
			"ppG": 2,
			"ppOpp": 8,
			"pkGa": 1,
			"shTimes": 12,
			"shG": 0,
			"fo": .503067,
			"sat": .468164,
			"sf": 25,
			"sa": 31,
			"hits": 65,
			"blocks": 57
		},
		{
			"abbrev": "OTT",
			"name": "Ottawa Senators",
			"common": "Senators",
			"place": "Ottawa",
			"logo": "https://assets.nhle.com/logos/nhl/svg/OTT_light.svg",
			"conference": "Eastern",
			"division": "Atlantic",
			"gp": 3,
			"w": 2,
			"l": 1,
			"otl": 0,
			"pts": 4,
			"ptPct": .666667,
			"gf": 10,
			"ga": 8,
			"diff": 2,
			"rw": 2,
			"row": 2,
			"streak": "L1",
			"l10Pts": 4,
			"l10Diff": 2,
			"l10Record": "2-1-0",
			"homePts": 0,
			"homeGp": 0,
			"roadPts": 4,
			"roadGp": 3,
			"seq": 11,
			"pp": .07692,
			"pk": .76923,
			"ppG": 1,
			"ppOpp": 13,
			"pkGa": 3,
			"shTimes": 13,
			"shG": 1,
			"fo": .526595,
			"sat": .458333,
			"sf": 26,
			"sa": 28,
			"hits": 92,
			"blocks": 45
		},
		{
			"abbrev": "TBL",
			"name": "Tampa Bay Lightning",
			"common": "Lightning",
			"place": "Tampa Bay",
			"logo": "https://assets.nhle.com/logos/nhl/svg/TBL_light.svg",
			"conference": "Eastern",
			"division": "Atlantic",
			"gp": 3,
			"w": 2,
			"l": 1,
			"otl": 0,
			"pts": 4,
			"ptPct": .666667,
			"gf": 8,
			"ga": 7,
			"diff": 1,
			"rw": 2,
			"row": 2,
			"streak": "W2",
			"l10Pts": 4,
			"l10Diff": 1,
			"l10Record": "2-1-0",
			"homePts": 4,
			"homeGp": 2,
			"roadPts": 0,
			"roadGp": 1,
			"seq": 12,
			"pp": 0,
			"pk": .85714,
			"ppG": 0,
			"ppOpp": 13,
			"pkGa": 1,
			"shTimes": 7,
			"shG": 0,
			"fo": .482142,
			"sat": .58,
			"sf": 30,
			"sa": 20.33333,
			"hits": 76,
			"blocks": 47
		},
		{
			"abbrev": "BUF",
			"name": "Buffalo Sabres",
			"common": "Sabres",
			"place": "Buffalo",
			"logo": "https://assets.nhle.com/logos/nhl/svg/BUF_light.svg",
			"conference": "Eastern",
			"division": "Atlantic",
			"gp": 3,
			"w": 2,
			"l": 1,
			"otl": 0,
			"pts": 4,
			"ptPct": .666667,
			"gf": 10,
			"ga": 11,
			"diff": -1,
			"rw": 1,
			"row": 2,
			"streak": "W2",
			"l10Pts": 4,
			"l10Diff": -1,
			"l10Record": "2-1-0",
			"homePts": 4,
			"homeGp": 2,
			"roadPts": 0,
			"roadGp": 1,
			"seq": 13,
			"pp": 0,
			"pk": .66666,
			"ppG": 0,
			"ppOpp": 10,
			"pkGa": 3,
			"shTimes": 9,
			"shG": 0,
			"fo": .505555,
			"sat": .581967,
			"sf": 27.33333,
			"sa": 19.33333,
			"hits": 62,
			"blocks": 32
		},
		{
			"abbrev": "ANA",
			"name": "Anaheim Ducks",
			"common": "Ducks",
			"place": "Anaheim",
			"logo": "https://assets.nhle.com/logos/nhl/svg/ANA_light.svg",
			"conference": "Western",
			"division": "Pacific",
			"gp": 3,
			"w": 2,
			"l": 1,
			"otl": 0,
			"pts": 4,
			"ptPct": .666667,
			"gf": 9,
			"ga": 10,
			"diff": -1,
			"rw": 1,
			"row": 2,
			"streak": "L1",
			"l10Pts": 4,
			"l10Diff": -1,
			"l10Record": "2-1-0",
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 2,
			"roadGp": 1,
			"seq": 14,
			"pp": .38461,
			"pk": .81818,
			"ppG": 5,
			"ppOpp": 13,
			"pkGa": 2,
			"shTimes": 11,
			"shG": 0,
			"fo": .430167,
			"sat": .486381,
			"sf": 23.66666,
			"sa": 26.66666,
			"hits": 80,
			"blocks": 45
		},
		{
			"abbrev": "SJS",
			"name": "San Jose Sharks",
			"common": "Sharks",
			"place": "San Jose",
			"logo": "https://assets.nhle.com/logos/nhl/svg/SJS_light.svg",
			"conference": "Western",
			"division": "Pacific",
			"gp": 3,
			"w": 2,
			"l": 1,
			"otl": 0,
			"pts": 4,
			"ptPct": .666667,
			"gf": 9,
			"ga": 12,
			"diff": -3,
			"rw": 0,
			"row": 2,
			"streak": "L1",
			"l10Pts": 4,
			"l10Diff": -3,
			"l10Record": "2-1-0",
			"homePts": 4,
			"homeGp": 2,
			"roadPts": 0,
			"roadGp": 1,
			"seq": 15,
			"pp": .25,
			"pk": .75,
			"ppG": 2,
			"ppOpp": 8,
			"pkGa": 3,
			"shTimes": 12,
			"shG": 1,
			"fo": .444444,
			"sat": .397683,
			"sf": 23.33333,
			"sa": 29,
			"hits": 77,
			"blocks": 53
		},
		{
			"abbrev": "SEA",
			"name": "Seattle Kraken",
			"common": "Kraken",
			"place": "Seattle",
			"logo": "https://assets.nhle.com/logos/nhl/svg/SEA_light.svg",
			"conference": "Western",
			"division": "Pacific",
			"gp": 4,
			"w": 2,
			"l": 2,
			"otl": 0,
			"pts": 4,
			"ptPct": .5,
			"gf": 15,
			"ga": 11,
			"diff": 4,
			"rw": 2,
			"row": 2,
			"streak": "L1",
			"l10Pts": 4,
			"l10Diff": 4,
			"l10Record": "2-2-0",
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 2,
			"roadGp": 2,
			"seq": 16,
			"pp": .25,
			"pk": .72727,
			"ppG": 3,
			"ppOpp": 12,
			"pkGa": 3,
			"shTimes": 11,
			"shG": 0,
			"fo": .495901,
			"sat": .437017,
			"sf": 26.5,
			"sa": 28,
			"hits": 76,
			"blocks": 74
		},
		{
			"abbrev": "PIT",
			"name": "Pittsburgh Penguins",
			"common": "Penguins",
			"place": "Pittsburgh",
			"logo": "https://assets.nhle.com/logos/nhl/svg/PIT_light.svg",
			"conference": "Eastern",
			"division": "Metropolitan",
			"gp": 4,
			"w": 2,
			"l": 2,
			"otl": 0,
			"pts": 4,
			"ptPct": .5,
			"gf": 18,
			"ga": 13,
			"diff": 5,
			"rw": 1,
			"row": 2,
			"streak": "L2",
			"l10Pts": 4,
			"l10Diff": 5,
			"l10Record": "2-2-0",
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 2,
			"roadGp": 2,
			"seq": 17,
			"pp": .30769,
			"pk": .9,
			"ppG": 4,
			"ppOpp": 13,
			"pkGa": 1,
			"shTimes": 10,
			"shG": 1,
			"fo": .446721,
			"sat": .501355,
			"sf": 32.25,
			"sa": 26.5,
			"hits": 50,
			"blocks": 59
		},
		{
			"abbrev": "VAN",
			"name": "Vancouver Canucks",
			"common": "Canucks",
			"place": "Vancouver",
			"logo": "https://assets.nhle.com/logos/nhl/svg/VAN_light.svg",
			"conference": "Western",
			"division": "Pacific",
			"gp": 4,
			"w": 2,
			"l": 2,
			"otl": 0,
			"pts": 4,
			"ptPct": .5,
			"gf": 19,
			"ga": 18,
			"diff": 1,
			"rw": 1,
			"row": 2,
			"streak": "L1",
			"l10Pts": 4,
			"l10Diff": 1,
			"l10Record": "2-2-0",
			"homePts": 2,
			"homeGp": 3,
			"roadPts": 2,
			"roadGp": 1,
			"seq": 18,
			"pp": .23076,
			"pk": .6875,
			"ppG": 3,
			"ppOpp": 13,
			"pkGa": 5,
			"shTimes": 16,
			"shG": 1,
			"fo": .493392,
			"sat": .423976,
			"sf": 22.75,
			"sa": 30,
			"hits": 100,
			"blocks": 74
		},
		{
			"abbrev": "TOR",
			"name": "Toronto Maple Leafs",
			"common": "Maple Leafs",
			"place": "Toronto",
			"logo": "https://assets.nhle.com/logos/nhl/svg/TOR_light.svg",
			"conference": "Eastern",
			"division": "Atlantic",
			"gp": 4,
			"w": 2,
			"l": 2,
			"otl": 0,
			"pts": 4,
			"ptPct": .5,
			"gf": 11,
			"ga": 11,
			"diff": 0,
			"rw": 1,
			"row": 2,
			"streak": "W1",
			"l10Pts": 4,
			"l10Diff": 0,
			"l10Record": "2-2-0",
			"homePts": 4,
			"homeGp": 4,
			"roadPts": 0,
			"roadGp": 0,
			"seq": 19,
			"pp": .21428,
			"pk": .90909,
			"ppG": 3,
			"ppOpp": 14,
			"pkGa": 1,
			"shTimes": 11,
			"shG": 0,
			"fo": .511312,
			"sat": .534328,
			"sf": 30,
			"sa": 26.25,
			"hits": 80,
			"blocks": 56
		},
		{
			"abbrev": "BOS",
			"name": "Boston Bruins",
			"common": "Bruins",
			"place": "Boston",
			"logo": "https://assets.nhle.com/logos/nhl/svg/BOS_light.svg",
			"conference": "Eastern",
			"division": "Atlantic",
			"gp": 4,
			"w": 2,
			"l": 2,
			"otl": 0,
			"pts": 4,
			"ptPct": .5,
			"gf": 9,
			"ga": 11,
			"diff": -2,
			"rw": 1,
			"row": 2,
			"streak": "L2",
			"l10Pts": 4,
			"l10Diff": -2,
			"l10Record": "2-2-0",
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 2,
			"roadGp": 2,
			"seq": 20,
			"pp": 0,
			"pk": .72727,
			"ppG": 0,
			"ppOpp": 10,
			"pkGa": 3,
			"shTimes": 11,
			"shG": 0,
			"fo": .50431,
			"sat": .515406,
			"sf": 24.75,
			"sa": 27.75,
			"hits": 112,
			"blocks": 53
		},
		{
			"abbrev": "MTL",
			"name": "Montréal Canadiens",
			"common": "Canadiens",
			"place": "Montréal",
			"logo": "https://assets.nhle.com/logos/nhl/svg/MTL_light.svg",
			"conference": "Eastern",
			"division": "Atlantic",
			"gp": 3,
			"w": 1,
			"l": 1,
			"otl": 1,
			"pts": 3,
			"ptPct": .5,
			"gf": 12,
			"ga": 14,
			"diff": -2,
			"rw": 1,
			"row": 1,
			"streak": "L1",
			"l10Pts": 3,
			"l10Diff": -2,
			"l10Record": "1-1-1",
			"homePts": 0,
			"homeGp": 1,
			"roadPts": 3,
			"roadGp": 2,
			"seq": 21,
			"pp": .1,
			"pk": .75,
			"ppG": 1,
			"ppOpp": 10,
			"pkGa": 3,
			"shTimes": 12,
			"shG": 0,
			"fo": .539325,
			"sat": .478991,
			"sf": 23,
			"sa": 30.33333,
			"hits": 76,
			"blocks": 39
		},
		{
			"abbrev": "NSH",
			"name": "Nashville Predators",
			"common": "Predators",
			"place": "Nashville",
			"logo": "https://assets.nhle.com/logos/nhl/svg/NSH_light.svg",
			"conference": "Western",
			"division": "Central",
			"gp": 3,
			"w": 1,
			"l": 1,
			"otl": 1,
			"pts": 3,
			"ptPct": .5,
			"gf": 7,
			"ga": 9,
			"diff": -2,
			"rw": 1,
			"row": 1,
			"streak": "OT1",
			"l10Pts": 3,
			"l10Diff": -2,
			"l10Record": "1-1-1",
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 1,
			"roadGp": 1,
			"seq": 22,
			"pp": .375,
			"pk": .75,
			"ppG": 3,
			"ppOpp": 8,
			"pkGa": 2,
			"shTimes": 8,
			"shG": 0,
			"fo": .47619,
			"sat": .436363,
			"sf": 23.66666,
			"sa": 32.33333,
			"hits": 68,
			"blocks": 45
		},
		{
			"abbrev": "CBJ",
			"name": "Columbus Blue Jackets",
			"common": "Blue Jackets",
			"place": "Columbus",
			"logo": "https://assets.nhle.com/logos/nhl/svg/CBJ_light.svg",
			"conference": "Eastern",
			"division": "Metropolitan",
			"gp": 2,
			"w": 1,
			"l": 1,
			"otl": 0,
			"pts": 2,
			"ptPct": .5,
			"gf": 7,
			"ga": 7,
			"diff": 0,
			"rw": 1,
			"row": 1,
			"streak": "L1",
			"l10Pts": 2,
			"l10Diff": 0,
			"l10Record": "1-1-0",
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 0,
			"roadGp": 0,
			"seq": 23,
			"pp": .4,
			"pk": .66666,
			"ppG": 2,
			"ppOpp": 5,
			"pkGa": 3,
			"shTimes": 9,
			"shG": 0,
			"fo": .559055,
			"sat": .444444,
			"sf": 21,
			"sa": 28.5,
			"hits": 46,
			"blocks": 38
		},
		{
			"abbrev": "NYI",
			"name": "New York Islanders",
			"common": "Islanders",
			"place": "NY Islanders",
			"logo": "https://assets.nhle.com/logos/nhl/svg/NYI_light.svg",
			"conference": "Eastern",
			"division": "Metropolitan",
			"gp": 3,
			"w": 1,
			"l": 2,
			"otl": 0,
			"pts": 2,
			"ptPct": .333333,
			"gf": 9,
			"ga": 7,
			"diff": 2,
			"rw": 1,
			"row": 1,
			"streak": "L1",
			"l10Pts": 2,
			"l10Diff": 2,
			"l10Record": "1-2-0",
			"homePts": 2,
			"homeGp": 1,
			"roadPts": 0,
			"roadGp": 2,
			"seq": 24,
			"pp": .18181,
			"pk": .83333,
			"ppG": 2,
			"ppOpp": 11,
			"pkGa": 2,
			"shTimes": 12,
			"shG": 2,
			"fo": .490909,
			"sat": .471774,
			"sf": 26,
			"sa": 29,
			"hits": 67,
			"blocks": 39
		},
		{
			"abbrev": "DAL",
			"name": "Dallas Stars",
			"common": "Stars",
			"place": "Dallas",
			"logo": "https://assets.nhle.com/logos/nhl/svg/DAL_light.svg",
			"conference": "Western",
			"division": "Central",
			"gp": 3,
			"w": 1,
			"l": 2,
			"otl": 0,
			"pts": 2,
			"ptPct": .333333,
			"gf": 6,
			"ga": 6,
			"diff": 0,
			"rw": 1,
			"row": 1,
			"streak": "W1",
			"l10Pts": 2,
			"l10Diff": 0,
			"l10Record": "1-2-0",
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 0,
			"roadGp": 1,
			"seq": 25,
			"pp": 0,
			"pk": .77777,
			"ppG": 0,
			"ppOpp": 8,
			"pkGa": 2,
			"shTimes": 9,
			"shG": 0,
			"fo": .551282,
			"sat": .557692,
			"sf": 27,
			"sa": 21,
			"hits": 61,
			"blocks": 45
		},
		{
			"abbrev": "DET",
			"name": "Detroit Red Wings",
			"common": "Red Wings",
			"place": "Detroit",
			"logo": "https://assets.nhle.com/logos/nhl/svg/DET_light.svg",
			"conference": "Eastern",
			"division": "Atlantic",
			"gp": 3,
			"w": 1,
			"l": 2,
			"otl": 0,
			"pts": 2,
			"ptPct": .333333,
			"gf": 7,
			"ga": 8,
			"diff": -1,
			"rw": 1,
			"row": 1,
			"streak": "W1",
			"l10Pts": 2,
			"l10Diff": -1,
			"l10Record": "1-2-0",
			"homePts": 2,
			"homeGp": 3,
			"roadPts": 0,
			"roadGp": 0,
			"seq": 26,
			"pp": .25,
			"pk": .61538,
			"ppG": 3,
			"ppOpp": 12,
			"pkGa": 5,
			"shTimes": 13,
			"shG": 0,
			"fo": .535911,
			"sat": .562231,
			"sf": 31.33333,
			"sa": 24.33333,
			"hits": 82,
			"blocks": 40
		},
		{
			"abbrev": "STL",
			"name": "St. Louis Blues",
			"common": "Blues",
			"place": "St. Louis",
			"logo": "https://assets.nhle.com/logos/nhl/svg/STL_light.svg",
			"conference": "Western",
			"division": "Central",
			"gp": 3,
			"w": 1,
			"l": 2,
			"otl": 0,
			"pts": 2,
			"ptPct": .333333,
			"gf": 7,
			"ga": 10,
			"diff": -3,
			"rw": 1,
			"row": 1,
			"streak": "L2",
			"l10Pts": 2,
			"l10Diff": -3,
			"l10Record": "1-2-0",
			"homePts": 0,
			"homeGp": 0,
			"roadPts": 2,
			"roadGp": 3,
			"seq": 27,
			"pp": .125,
			"pk": .9,
			"ppG": 1,
			"ppOpp": 8,
			"pkGa": 1,
			"shTimes": 10,
			"shG": 0,
			"fo": .446236,
			"sat": .528957,
			"sf": 25.66666,
			"sa": 27.33333,
			"hits": 74,
			"blocks": 34
		},
		{
			"abbrev": "NJD",
			"name": "New Jersey Devils",
			"common": "Devils",
			"place": "New Jersey",
			"logo": "https://assets.nhle.com/logos/nhl/svg/NJD_light.svg",
			"conference": "Eastern",
			"division": "Metropolitan",
			"gp": 3,
			"w": 1,
			"l": 2,
			"otl": 0,
			"pts": 2,
			"ptPct": .333333,
			"gf": 6,
			"ga": 13,
			"diff": -7,
			"rw": 0,
			"row": 1,
			"streak": "L2",
			"l10Pts": 2,
			"l10Diff": -7,
			"l10Record": "1-2-0",
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 0,
			"roadGp": 1,
			"seq": 28,
			"pp": .07142,
			"pk": .625,
			"ppG": 1,
			"ppOpp": 14,
			"pkGa": 3,
			"shTimes": 8,
			"shG": 0,
			"fo": .475409,
			"sat": .616724,
			"sf": 38,
			"sa": 29.33333,
			"hits": 43,
			"blocks": 32
		},
		{
			"abbrev": "CHI",
			"name": "Chicago Blackhawks",
			"common": "Blackhawks",
			"place": "Chicago",
			"logo": "https://assets.nhle.com/logos/nhl/svg/CHI_light.svg",
			"conference": "Western",
			"division": "Central",
			"gp": 4,
			"w": 1,
			"l": 3,
			"otl": 0,
			"pts": 2,
			"ptPct": .25,
			"gf": 9,
			"ga": 17,
			"diff": -8,
			"rw": 1,
			"row": 1,
			"streak": "W1",
			"l10Pts": 2,
			"l10Diff": -8,
			"l10Record": "1-3-0",
			"homePts": 2,
			"homeGp": 1,
			"roadPts": 0,
			"roadGp": 3,
			"seq": 29,
			"pp": .11111,
			"pk": .63636,
			"ppG": 1,
			"ppOpp": 9,
			"pkGa": 4,
			"shTimes": 11,
			"shG": 1,
			"fo": .421276,
			"sat": .404958,
			"sf": 19.25,
			"sa": 31,
			"hits": 62,
			"blocks": 45
		},
		{
			"abbrev": "PHI",
			"name": "Philadelphia Flyers",
			"common": "Flyers",
			"place": "Philadelphia",
			"logo": "https://assets.nhle.com/logos/nhl/svg/PHI_light.svg",
			"conference": "Eastern",
			"division": "Metropolitan",
			"gp": 4,
			"w": 0,
			"l": 2,
			"otl": 2,
			"pts": 2,
			"ptPct": .25,
			"gf": 5,
			"ga": 17,
			"diff": -12,
			"rw": 0,
			"row": 0,
			"streak": "L1",
			"l10Pts": 2,
			"l10Diff": -12,
			"l10Record": "0-2-2",
			"homePts": 1,
			"homeGp": 2,
			"roadPts": 1,
			"roadGp": 2,
			"seq": 30,
			"pp": 0,
			"pk": .73333,
			"ppG": 0,
			"ppOpp": 11,
			"pkGa": 4,
			"shTimes": 15,
			"shG": 0,
			"fo": .53629,
			"sat": .331521,
			"sf": 19.25,
			"sa": 39.5,
			"hits": 104,
			"blocks": 76
		},
		{
			"abbrev": "LAK",
			"name": "Los Angeles Kings",
			"common": "Kings",
			"place": "Los Angeles",
			"logo": "https://assets.nhle.com/logos/nhl/svg/LAK_light.svg",
			"conference": "Western",
			"division": "Pacific",
			"gp": 3,
			"w": 0,
			"l": 2,
			"otl": 1,
			"pts": 1,
			"ptPct": .166667,
			"gf": 9,
			"ga": 15,
			"diff": -6,
			"rw": 0,
			"row": 0,
			"streak": "L1",
			"l10Pts": 1,
			"l10Diff": -6,
			"l10Record": "0-2-1",
			"homePts": 0,
			"homeGp": 1,
			"roadPts": 1,
			"roadGp": 2,
			"seq": 31,
			"pp": .16666,
			"pk": .61538,
			"ppG": 2,
			"ppOpp": 12,
			"pkGa": 5,
			"shTimes": 13,
			"shG": 2,
			"fo": .56906,
			"sat": .508,
			"sf": 28.66666,
			"sa": 28,
			"hits": 49,
			"blocks": 44
		},
		{
			"abbrev": "CGY",
			"name": "Calgary Flames",
			"common": "Flames",
			"place": "Calgary",
			"logo": "https://assets.nhle.com/logos/nhl/svg/CGY_light.svg",
			"conference": "Western",
			"division": "Pacific",
			"gp": 3,
			"w": 0,
			"l": 3,
			"otl": 0,
			"pts": 0,
			"ptPct": 0,
			"gf": 3,
			"ga": 16,
			"diff": -13,
			"rw": 0,
			"row": 0,
			"streak": "L3",
			"l10Pts": 0,
			"l10Diff": -13,
			"l10Record": "0-3-0",
			"homePts": 0,
			"homeGp": 1,
			"roadPts": 0,
			"roadGp": 2,
			"seq": 32,
			"pp": .4,
			"pk": .9,
			"ppG": 2,
			"ppOpp": 5,
			"pkGa": 1,
			"shTimes": 10,
			"shG": 0,
			"fo": .502793,
			"sat": .559171,
			"sf": 27.33333,
			"sa": 28.33333,
			"hits": 81,
			"blocks": 38
		}
	],
	priorCycle: {
		"NYR": {
			"pts": 8,
			"gp": 5,
			"gf": 16,
			"ga": 8,
			"rw": 4,
			"l10Pts": 8,
			"l10Diff": 8,
			"seq": 1,
			"homePts": 6,
			"homeGp": 3,
			"roadPts": 2,
			"roadGp": 2
		},
		"UTA": {
			"pts": 6,
			"gp": 4,
			"gf": 17,
			"ga": 8,
			"rw": 3,
			"l10Pts": 6,
			"l10Diff": 9,
			"seq": 2,
			"homePts": 2,
			"homeGp": 1,
			"roadPts": 4,
			"roadGp": 3
		},
		"VGK": {
			"pts": 6,
			"gp": 4,
			"gf": 17,
			"ga": 10,
			"rw": 3,
			"l10Pts": 6,
			"l10Diff": 7,
			"seq": 3,
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 4,
			"roadGp": 2
		},
		"FLA": {
			"pts": 6,
			"gp": 4,
			"gf": 8,
			"ga": 8,
			"rw": 1,
			"l10Pts": 6,
			"l10Diff": 0,
			"seq": 4,
			"homePts": 0,
			"homeGp": 0,
			"roadPts": 6,
			"roadGp": 4
		},
		"MIN": {
			"pts": 5,
			"gp": 3,
			"gf": 9,
			"ga": 5,
			"rw": 2,
			"l10Pts": 5,
			"l10Diff": 4,
			"seq": 5,
			"homePts": 2,
			"homeGp": 1,
			"roadPts": 3,
			"roadGp": 2
		},
		"EDM": {
			"pts": 5,
			"gp": 3,
			"gf": 17,
			"ga": 14,
			"rw": 2,
			"l10Pts": 5,
			"l10Diff": 3,
			"seq": 6,
			"homePts": 3,
			"homeGp": 2,
			"roadPts": 2,
			"roadGp": 1
		},
		"WPG": {
			"pts": 5,
			"gp": 3,
			"gf": 9,
			"ga": 8,
			"rw": 2,
			"l10Pts": 5,
			"l10Diff": 1,
			"seq": 7,
			"homePts": 1,
			"homeGp": 1,
			"roadPts": 4,
			"roadGp": 2
		},
		"CAR": {
			"pts": 5,
			"gp": 4,
			"gf": 11,
			"ga": 12,
			"rw": 1,
			"l10Pts": 5,
			"l10Diff": -1,
			"seq": 8,
			"homePts": 1,
			"homeGp": 2,
			"roadPts": 4,
			"roadGp": 2
		},
		"COL": {
			"pts": 4,
			"gp": 2,
			"gf": 14,
			"ga": 5,
			"rw": 2,
			"l10Pts": 4,
			"l10Diff": 9,
			"seq": 9,
			"homePts": 4,
			"homeGp": 2,
			"roadPts": 0,
			"roadGp": 0
		},
		"ANA": {
			"pts": 4,
			"gp": 2,
			"gf": 7,
			"ga": 5,
			"rw": 1,
			"l10Pts": 4,
			"l10Diff": 2,
			"seq": 10,
			"homePts": 2,
			"homeGp": 1,
			"roadPts": 2,
			"roadGp": 1
		},
		"OTT": {
			"pts": 4,
			"gp": 3,
			"gf": 10,
			"ga": 8,
			"rw": 2,
			"l10Pts": 4,
			"l10Diff": 2,
			"seq": 11,
			"homePts": 0,
			"homeGp": 0,
			"roadPts": 4,
			"roadGp": 3
		},
		"TBL": {
			"pts": 4,
			"gp": 3,
			"gf": 8,
			"ga": 7,
			"rw": 2,
			"l10Pts": 4,
			"l10Diff": 1,
			"seq": 12,
			"homePts": 4,
			"homeGp": 2,
			"roadPts": 0,
			"roadGp": 1
		},
		"PIT": {
			"pts": 4,
			"gp": 3,
			"gf": 15,
			"ga": 8,
			"rw": 1,
			"l10Pts": 4,
			"l10Diff": 7,
			"seq": 13,
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 2,
			"roadGp": 1
		},
		"BUF": {
			"pts": 4,
			"gp": 3,
			"gf": 10,
			"ga": 11,
			"rw": 1,
			"l10Pts": 4,
			"l10Diff": -1,
			"seq": 14,
			"homePts": 4,
			"homeGp": 2,
			"roadPts": 0,
			"roadGp": 1
		},
		"SJS": {
			"pts": 4,
			"gp": 3,
			"gf": 9,
			"ga": 12,
			"rw": 0,
			"l10Pts": 4,
			"l10Diff": -3,
			"seq": 15,
			"homePts": 4,
			"homeGp": 2,
			"roadPts": 0,
			"roadGp": 1
		},
		"SEA": {
			"pts": 4,
			"gp": 4,
			"gf": 15,
			"ga": 11,
			"rw": 2,
			"l10Pts": 4,
			"l10Diff": 4,
			"seq": 16,
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 2,
			"roadGp": 2
		},
		"VAN": {
			"pts": 4,
			"gp": 4,
			"gf": 19,
			"ga": 18,
			"rw": 1,
			"l10Pts": 4,
			"l10Diff": 1,
			"seq": 17,
			"homePts": 2,
			"homeGp": 3,
			"roadPts": 2,
			"roadGp": 1
		},
		"TOR": {
			"pts": 4,
			"gp": 4,
			"gf": 11,
			"ga": 11,
			"rw": 1,
			"l10Pts": 4,
			"l10Diff": 0,
			"seq": 18,
			"homePts": 4,
			"homeGp": 4,
			"roadPts": 0,
			"roadGp": 0
		},
		"BOS": {
			"pts": 4,
			"gp": 4,
			"gf": 9,
			"ga": 11,
			"rw": 1,
			"l10Pts": 4,
			"l10Diff": -2,
			"seq": 19,
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 2,
			"roadGp": 2
		},
		"MTL": {
			"pts": 3,
			"gp": 3,
			"gf": 12,
			"ga": 14,
			"rw": 1,
			"l10Pts": 3,
			"l10Diff": -2,
			"seq": 20,
			"homePts": 0,
			"homeGp": 1,
			"roadPts": 3,
			"roadGp": 2
		},
		"NSH": {
			"pts": 3,
			"gp": 3,
			"gf": 7,
			"ga": 9,
			"rw": 1,
			"l10Pts": 3,
			"l10Diff": -2,
			"seq": 21,
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 1,
			"roadGp": 1
		},
		"WSH": {
			"pts": 2,
			"gp": 2,
			"gf": 6,
			"ga": 5,
			"rw": 1,
			"l10Pts": 2,
			"l10Diff": 1,
			"seq": 22,
			"homePts": 0,
			"homeGp": 0,
			"roadPts": 2,
			"roadGp": 2
		},
		"CBJ": {
			"pts": 2,
			"gp": 2,
			"gf": 7,
			"ga": 7,
			"rw": 1,
			"l10Pts": 2,
			"l10Diff": 0,
			"seq": 23,
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 0,
			"roadGp": 0
		},
		"NYI": {
			"pts": 2,
			"gp": 3,
			"gf": 9,
			"ga": 7,
			"rw": 1,
			"l10Pts": 2,
			"l10Diff": 2,
			"seq": 24,
			"homePts": 2,
			"homeGp": 1,
			"roadPts": 0,
			"roadGp": 2
		},
		"DAL": {
			"pts": 2,
			"gp": 3,
			"gf": 6,
			"ga": 6,
			"rw": 1,
			"l10Pts": 2,
			"l10Diff": 0,
			"seq": 25,
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 0,
			"roadGp": 1
		},
		"DET": {
			"pts": 2,
			"gp": 3,
			"gf": 7,
			"ga": 8,
			"rw": 1,
			"l10Pts": 2,
			"l10Diff": -1,
			"seq": 26,
			"homePts": 2,
			"homeGp": 3,
			"roadPts": 0,
			"roadGp": 0
		},
		"STL": {
			"pts": 2,
			"gp": 3,
			"gf": 7,
			"ga": 10,
			"rw": 1,
			"l10Pts": 2,
			"l10Diff": -3,
			"seq": 27,
			"homePts": 0,
			"homeGp": 0,
			"roadPts": 2,
			"roadGp": 3
		},
		"NJD": {
			"pts": 2,
			"gp": 3,
			"gf": 6,
			"ga": 13,
			"rw": 0,
			"l10Pts": 2,
			"l10Diff": -7,
			"seq": 28,
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 0,
			"roadGp": 1
		},
		"CHI": {
			"pts": 2,
			"gp": 4,
			"gf": 9,
			"ga": 17,
			"rw": 1,
			"l10Pts": 2,
			"l10Diff": -8,
			"seq": 29,
			"homePts": 2,
			"homeGp": 1,
			"roadPts": 0,
			"roadGp": 3
		},
		"PHI": {
			"pts": 2,
			"gp": 4,
			"gf": 5,
			"ga": 17,
			"rw": 0,
			"l10Pts": 2,
			"l10Diff": -12,
			"seq": 30,
			"homePts": 1,
			"homeGp": 2,
			"roadPts": 1,
			"roadGp": 2
		},
		"LAK": {
			"pts": 1,
			"gp": 3,
			"gf": 9,
			"ga": 15,
			"rw": 0,
			"l10Pts": 1,
			"l10Diff": -6,
			"seq": 31,
			"homePts": 0,
			"homeGp": 1,
			"roadPts": 1,
			"roadGp": 2
		},
		"CGY": {
			"pts": 0,
			"gp": 3,
			"gf": 3,
			"ga": 16,
			"rw": 0,
			"l10Pts": 0,
			"l10Diff": -13,
			"seq": 32,
			"homePts": 0,
			"homeGp": 1,
			"roadPts": 0,
			"roadGp": 2
		}
	},
	priorDay: {
		"NYR": {
			"pts": 8,
			"gp": 5,
			"gf": 16,
			"ga": 8,
			"rw": 4,
			"l10Pts": 8,
			"l10Diff": 8,
			"seq": 1,
			"homePts": 6,
			"homeGp": 3,
			"roadPts": 2,
			"roadGp": 2
		},
		"EDM": {
			"pts": 7,
			"gp": 4,
			"gf": 22,
			"ga": 16,
			"rw": 3,
			"l10Pts": 7,
			"l10Diff": 6,
			"seq": 2,
			"homePts": 3,
			"homeGp": 2,
			"roadPts": 4,
			"roadGp": 2
		},
		"WPG": {
			"pts": 7,
			"gp": 4,
			"gf": 12,
			"ga": 10,
			"rw": 3,
			"l10Pts": 7,
			"l10Diff": 2,
			"seq": 3,
			"homePts": 3,
			"homeGp": 2,
			"roadPts": 4,
			"roadGp": 2
		},
		"UTA": {
			"pts": 6,
			"gp": 4,
			"gf": 17,
			"ga": 8,
			"rw": 3,
			"l10Pts": 6,
			"l10Diff": 9,
			"seq": 4,
			"homePts": 2,
			"homeGp": 1,
			"roadPts": 4,
			"roadGp": 3
		},
		"VGK": {
			"pts": 6,
			"gp": 4,
			"gf": 17,
			"ga": 10,
			"rw": 3,
			"l10Pts": 6,
			"l10Diff": 7,
			"seq": 5,
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 4,
			"roadGp": 2
		},
		"FLA": {
			"pts": 6,
			"gp": 4,
			"gf": 8,
			"ga": 8,
			"rw": 1,
			"l10Pts": 6,
			"l10Diff": 0,
			"seq": 6,
			"homePts": 0,
			"homeGp": 0,
			"roadPts": 6,
			"roadGp": 4
		},
		"MIN": {
			"pts": 5,
			"gp": 3,
			"gf": 9,
			"ga": 5,
			"rw": 2,
			"l10Pts": 5,
			"l10Diff": 4,
			"seq": 7,
			"homePts": 2,
			"homeGp": 1,
			"roadPts": 3,
			"roadGp": 2
		},
		"CAR": {
			"pts": 5,
			"gp": 4,
			"gf": 11,
			"ga": 12,
			"rw": 1,
			"l10Pts": 5,
			"l10Diff": -1,
			"seq": 8,
			"homePts": 1,
			"homeGp": 2,
			"roadPts": 4,
			"roadGp": 2
		},
		"COL": {
			"pts": 4,
			"gp": 3,
			"gf": 16,
			"ga": 8,
			"rw": 2,
			"l10Pts": 4,
			"l10Diff": 8,
			"seq": 9,
			"homePts": 4,
			"homeGp": 2,
			"roadPts": 0,
			"roadGp": 1
		},
		"WSH": {
			"pts": 4,
			"gp": 3,
			"gf": 11,
			"ga": 8,
			"rw": 2,
			"l10Pts": 4,
			"l10Diff": 3,
			"seq": 10,
			"homePts": 2,
			"homeGp": 1,
			"roadPts": 2,
			"roadGp": 2
		},
		"OTT": {
			"pts": 4,
			"gp": 3,
			"gf": 10,
			"ga": 8,
			"rw": 2,
			"l10Pts": 4,
			"l10Diff": 2,
			"seq": 11,
			"homePts": 0,
			"homeGp": 0,
			"roadPts": 4,
			"roadGp": 3
		},
		"TBL": {
			"pts": 4,
			"gp": 3,
			"gf": 8,
			"ga": 7,
			"rw": 2,
			"l10Pts": 4,
			"l10Diff": 1,
			"seq": 12,
			"homePts": 4,
			"homeGp": 2,
			"roadPts": 0,
			"roadGp": 1
		},
		"BUF": {
			"pts": 4,
			"gp": 3,
			"gf": 10,
			"ga": 11,
			"rw": 1,
			"l10Pts": 4,
			"l10Diff": -1,
			"seq": 13,
			"homePts": 4,
			"homeGp": 2,
			"roadPts": 0,
			"roadGp": 1
		},
		"ANA": {
			"pts": 4,
			"gp": 3,
			"gf": 9,
			"ga": 10,
			"rw": 1,
			"l10Pts": 4,
			"l10Diff": -1,
			"seq": 14,
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 2,
			"roadGp": 1
		},
		"SJS": {
			"pts": 4,
			"gp": 3,
			"gf": 9,
			"ga": 12,
			"rw": 0,
			"l10Pts": 4,
			"l10Diff": -3,
			"seq": 15,
			"homePts": 4,
			"homeGp": 2,
			"roadPts": 0,
			"roadGp": 1
		},
		"SEA": {
			"pts": 4,
			"gp": 4,
			"gf": 15,
			"ga": 11,
			"rw": 2,
			"l10Pts": 4,
			"l10Diff": 4,
			"seq": 16,
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 2,
			"roadGp": 2
		},
		"PIT": {
			"pts": 4,
			"gp": 4,
			"gf": 18,
			"ga": 13,
			"rw": 1,
			"l10Pts": 4,
			"l10Diff": 5,
			"seq": 17,
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 2,
			"roadGp": 2
		},
		"VAN": {
			"pts": 4,
			"gp": 4,
			"gf": 19,
			"ga": 18,
			"rw": 1,
			"l10Pts": 4,
			"l10Diff": 1,
			"seq": 18,
			"homePts": 2,
			"homeGp": 3,
			"roadPts": 2,
			"roadGp": 1
		},
		"TOR": {
			"pts": 4,
			"gp": 4,
			"gf": 11,
			"ga": 11,
			"rw": 1,
			"l10Pts": 4,
			"l10Diff": 0,
			"seq": 19,
			"homePts": 4,
			"homeGp": 4,
			"roadPts": 0,
			"roadGp": 0
		},
		"BOS": {
			"pts": 4,
			"gp": 4,
			"gf": 9,
			"ga": 11,
			"rw": 1,
			"l10Pts": 4,
			"l10Diff": -2,
			"seq": 20,
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 2,
			"roadGp": 2
		},
		"MTL": {
			"pts": 3,
			"gp": 3,
			"gf": 12,
			"ga": 14,
			"rw": 1,
			"l10Pts": 3,
			"l10Diff": -2,
			"seq": 21,
			"homePts": 0,
			"homeGp": 1,
			"roadPts": 3,
			"roadGp": 2
		},
		"NSH": {
			"pts": 3,
			"gp": 3,
			"gf": 7,
			"ga": 9,
			"rw": 1,
			"l10Pts": 3,
			"l10Diff": -2,
			"seq": 22,
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 1,
			"roadGp": 1
		},
		"CBJ": {
			"pts": 2,
			"gp": 2,
			"gf": 7,
			"ga": 7,
			"rw": 1,
			"l10Pts": 2,
			"l10Diff": 0,
			"seq": 23,
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 0,
			"roadGp": 0
		},
		"NYI": {
			"pts": 2,
			"gp": 3,
			"gf": 9,
			"ga": 7,
			"rw": 1,
			"l10Pts": 2,
			"l10Diff": 2,
			"seq": 24,
			"homePts": 2,
			"homeGp": 1,
			"roadPts": 0,
			"roadGp": 2
		},
		"DAL": {
			"pts": 2,
			"gp": 3,
			"gf": 6,
			"ga": 6,
			"rw": 1,
			"l10Pts": 2,
			"l10Diff": 0,
			"seq": 25,
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 0,
			"roadGp": 1
		},
		"DET": {
			"pts": 2,
			"gp": 3,
			"gf": 7,
			"ga": 8,
			"rw": 1,
			"l10Pts": 2,
			"l10Diff": -1,
			"seq": 26,
			"homePts": 2,
			"homeGp": 3,
			"roadPts": 0,
			"roadGp": 0
		},
		"STL": {
			"pts": 2,
			"gp": 3,
			"gf": 7,
			"ga": 10,
			"rw": 1,
			"l10Pts": 2,
			"l10Diff": -3,
			"seq": 27,
			"homePts": 0,
			"homeGp": 0,
			"roadPts": 2,
			"roadGp": 3
		},
		"NJD": {
			"pts": 2,
			"gp": 3,
			"gf": 6,
			"ga": 13,
			"rw": 0,
			"l10Pts": 2,
			"l10Diff": -7,
			"seq": 28,
			"homePts": 2,
			"homeGp": 2,
			"roadPts": 0,
			"roadGp": 1
		},
		"CHI": {
			"pts": 2,
			"gp": 4,
			"gf": 9,
			"ga": 17,
			"rw": 1,
			"l10Pts": 2,
			"l10Diff": -8,
			"seq": 29,
			"homePts": 2,
			"homeGp": 1,
			"roadPts": 0,
			"roadGp": 3
		},
		"PHI": {
			"pts": 2,
			"gp": 4,
			"gf": 5,
			"ga": 17,
			"rw": 0,
			"l10Pts": 2,
			"l10Diff": -12,
			"seq": 30,
			"homePts": 1,
			"homeGp": 2,
			"roadPts": 1,
			"roadGp": 2
		},
		"LAK": {
			"pts": 1,
			"gp": 3,
			"gf": 9,
			"ga": 15,
			"rw": 0,
			"l10Pts": 1,
			"l10Diff": -6,
			"seq": 31,
			"homePts": 0,
			"homeGp": 1,
			"roadPts": 1,
			"roadGp": 2
		},
		"CGY": {
			"pts": 0,
			"gp": 3,
			"gf": 3,
			"ga": 16,
			"rw": 0,
			"l10Pts": 0,
			"l10Diff": -13,
			"seq": 32,
			"homePts": 0,
			"homeGp": 1,
			"roadPts": 0,
			"roadGp": 2
		}
	},
	games: [
		{
			"id": 2026020056,
			"date": "2026-10-08",
			"start": "2026-10-08T23:00:00Z",
			"state": "upcoming",
			"venue": "TD Garden",
			"away": {
				"abbrev": "UTA",
				"score": null,
				"odds": -125
			},
			"home": {
				"abbrev": "BOS",
				"score": null,
				"odds": 105
			},
			"networks": ["Utah16", "NESN"]
		},
		{
			"id": 2026020057,
			"date": "2026-10-08",
			"start": "2026-10-08T23:00:00Z",
			"state": "upcoming",
			"venue": "KeyBank Center",
			"away": {
				"abbrev": "DAL",
				"score": null,
				"odds": -122
			},
			"home": {
				"abbrev": "BUF",
				"score": null,
				"odds": 102
			},
			"networks": ["Prime Video", "MSG-B"]
		},
		{
			"id": 2026020058,
			"date": "2026-10-08",
			"start": "2026-10-08T23:00:00Z",
			"state": "upcoming",
			"venue": "Centre Bell",
			"away": {
				"abbrev": "NSH",
				"score": null,
				"odds": 140
			},
			"home": {
				"abbrev": "MTL",
				"score": null,
				"odds": -166
			},
			"networks": ["SCRIPPS"]
		},
		{
			"id": 2026020059,
			"date": "2026-10-08",
			"start": "2026-10-08T23:00:00Z",
			"state": "upcoming",
			"venue": "Canadian Tire Centre",
			"away": {
				"abbrev": "PHI",
				"score": null,
				"odds": 150
			},
			"home": {
				"abbrev": "OTT",
				"score": null,
				"odds": -180
			},
			"networks": ["NBCSP"]
		},
		{
			"id": 2026020060,
			"date": "2026-10-08",
			"start": "2026-10-08T23:00:00Z",
			"state": "upcoming",
			"venue": "Benchmark International Arena",
			"away": {
				"abbrev": "MIN",
				"score": null,
				"odds": 120
			},
			"home": {
				"abbrev": "TBL",
				"score": null,
				"odds": -142
			},
			"networks": [
				"MINNHL",
				"Wild+",
				"The Spot"
			]
		},
		{
			"id": 2026020061,
			"date": "2026-10-08",
			"start": "2026-10-08T23:00:00Z",
			"state": "upcoming",
			"venue": "Lenovo Center",
			"away": {
				"abbrev": "VAN",
				"score": null,
				"odds": 270
			},
			"home": {
				"abbrev": "CAR",
				"score": null,
				"odds": -340
			},
			"networks": ["CARNHL", "HHN"]
		},
		{
			"id": 2026020062,
			"date": "2026-10-08",
			"start": "2026-10-08T23:30:00Z",
			"state": "upcoming",
			"venue": "UBS Arena",
			"away": {
				"abbrev": "CHI",
				"score": null,
				"odds": 154
			},
			"home": {
				"abbrev": "NYI",
				"score": null,
				"odds": -185
			},
			"networks": ["CHSN", "MSGSN"]
		},
		{
			"id": 2026020063,
			"date": "2026-10-08",
			"start": "2026-10-09T00:00:00Z",
			"state": "upcoming",
			"venue": "Enterprise Center",
			"away": {
				"abbrev": "SJS",
				"score": null,
				"odds": 120
			},
			"home": {
				"abbrev": "STL",
				"score": null,
				"odds": -142
			},
			"networks": [
				"ESPN+",
				"HULU",
				"Disney+"
			]
		},
		{
			"id": 2026020064,
			"date": "2026-10-08",
			"start": "2026-10-09T01:00:00Z",
			"state": "upcoming",
			"venue": "Scotiabank Saddledome",
			"away": {
				"abbrev": "COL",
				"score": null,
				"odds": -238
			},
			"home": {
				"abbrev": "CGY",
				"score": null,
				"odds": 195
			},
			"networks": ["ALT", "KTVD"]
		},
		{
			"id": 2026020065,
			"date": "2026-10-08",
			"start": "2026-10-09T02:00:00Z",
			"state": "upcoming",
			"venue": "T-Mobile Arena",
			"away": {
				"abbrev": "TOR",
				"score": null,
				"odds": 142
			},
			"home": {
				"abbrev": "VGK",
				"score": null,
				"odds": -170
			},
			"networks": ["SCRIPPS"]
		},
		{
			"id": 2026020066,
			"date": "2026-10-09",
			"start": "2026-10-09T23:00:00Z",
			"state": "upcoming",
			"venue": "Little Caesars Arena",
			"away": {
				"abbrev": "SEA",
				"score": null,
				"odds": null
			},
			"home": {
				"abbrev": "DET",
				"score": null,
				"odds": null
			},
			"networks": [
				"DSN",
				"Prime Video",
				"KING"
			]
		},
		{
			"id": 2026020067,
			"date": "2026-10-09",
			"start": "2026-10-09T23:00:00Z",
			"state": "upcoming",
			"venue": "Capital One Arena",
			"away": {
				"abbrev": "NYR",
				"score": null,
				"odds": null
			},
			"home": {
				"abbrev": "WSH",
				"score": null,
				"odds": null
			},
			"networks": [
				"NHLN",
				"MNMT",
				"MSG"
			]
		},
		{
			"id": 2026020068,
			"date": "2026-10-09",
			"start": "2026-10-09T23:00:00Z",
			"state": "upcoming",
			"venue": "Nationwide Arena",
			"away": {
				"abbrev": "PIT",
				"score": null,
				"odds": null
			},
			"home": {
				"abbrev": "CBJ",
				"score": null,
				"odds": null
			},
			"networks": [
				"CBJNHL",
				"CBJHN",
				"SN-PIT"
			]
		},
		{
			"id": 2026020069,
			"date": "2026-10-09",
			"start": "2026-10-10T00:00:00Z",
			"state": "upcoming",
			"venue": "Canada Life Centre",
			"away": {
				"abbrev": "ANA",
				"score": null,
				"odds": null
			},
			"home": {
				"abbrev": "WPG",
				"score": null,
				"odds": null
			},
			"networks": ["Prime Video", "KCOP-13"]
		},
		{
			"id": 2026020070,
			"date": "2026-10-10",
			"start": "2026-10-10T17:00:00Z",
			"state": "upcoming",
			"venue": "TD Garden",
			"away": {
				"abbrev": "PHI",
				"score": null,
				"odds": null
			},
			"home": {
				"abbrev": "BOS",
				"score": null,
				"odds": null
			},
			"networks": [
				"NHLN",
				"NBCSP",
				"NESN"
			]
		},
		{
			"id": 2026020071,
			"date": "2026-10-10",
			"start": "2026-10-10T19:30:00Z",
			"state": "upcoming",
			"venue": "Prudential Center",
			"away": {
				"abbrev": "VAN",
				"score": null,
				"odds": null
			},
			"home": {
				"abbrev": "NJD",
				"score": null,
				"odds": null
			},
			"networks": ["MSGSN"]
		},
		{
			"id": 2026020072,
			"date": "2026-10-10",
			"start": "2026-10-10T20:00:00Z",
			"state": "upcoming",
			"venue": "SAP Center at San Jose",
			"away": {
				"abbrev": "EDM",
				"score": null,
				"odds": null
			},
			"home": {
				"abbrev": "SJS",
				"score": null,
				"odds": null
			},
			"networks": ["NBCSCA"]
		},
		{
			"id": 2026020073,
			"date": "2026-10-10",
			"start": "2026-10-10T22:00:00Z",
			"state": "upcoming",
			"venue": "Amerant Bank Arena",
			"away": {
				"abbrev": "MIN",
				"score": null,
				"odds": null
			},
			"home": {
				"abbrev": "FLA",
				"score": null,
				"odds": null
			},
			"networks": [
				"MINNHL",
				"Wild+",
				"SCRIPPS"
			]
		},
		{
			"id": 2026020074,
			"date": "2026-10-10",
			"start": "2026-10-10T23:00:00Z",
			"state": "upcoming",
			"venue": "KeyBank Center",
			"away": {
				"abbrev": "UTA",
				"score": null,
				"odds": null
			},
			"home": {
				"abbrev": "BUF",
				"score": null,
				"odds": null
			},
			"networks": ["Utah16", "MSG-B"]
		},
		{
			"id": 2026020075,
			"date": "2026-10-10",
			"start": "2026-10-10T23:00:00Z",
			"state": "upcoming",
			"venue": "Centre Bell",
			"away": {
				"abbrev": "DET",
				"score": null,
				"odds": null
			},
			"home": {
				"abbrev": "MTL",
				"score": null,
				"odds": null
			},
			"networks": ["DSN"]
		},
		{
			"id": 2026020076,
			"date": "2026-10-10",
			"start": "2026-10-10T23:00:00Z",
			"state": "upcoming",
			"venue": "Canadian Tire Centre",
			"away": {
				"abbrev": "NSH",
				"score": null,
				"odds": null
			},
			"home": {
				"abbrev": "OTT",
				"score": null,
				"odds": null
			},
			"networks": ["SCRIPPS"]
		},
		{
			"id": 2026020077,
			"date": "2026-10-10",
			"start": "2026-10-10T23:00:00Z",
			"state": "upcoming",
			"venue": "PPG Paints Arena",
			"away": {
				"abbrev": "DAL",
				"score": null,
				"odds": null
			},
			"home": {
				"abbrev": "PIT",
				"score": null,
				"odds": null
			},
			"networks": ["Prime Video", "SN-PIT"]
		},
		{
			"id": 2026020078,
			"date": "2026-10-10",
			"start": "2026-10-10T23:00:00Z",
			"state": "upcoming",
			"venue": "United Center",
			"away": {
				"abbrev": "CAR",
				"score": null,
				"odds": null
			},
			"home": {
				"abbrev": "CHI",
				"score": null,
				"odds": null
			},
			"networks": [
				"CARNHL",
				"HHN",
				"CHSN"
			]
		},
		{
			"id": 2026020079,
			"date": "2026-10-10",
			"start": "2026-10-10T23:00:00Z",
			"state": "upcoming",
			"venue": "Enterprise Center",
			"away": {
				"abbrev": "CBJ",
				"score": null,
				"odds": null
			},
			"home": {
				"abbrev": "STL",
				"score": null,
				"odds": null
			},
			"networks": [
				"CBJNHL",
				"STLNHL",
				"BN+"
			]
		},
		{
			"id": 2026020080,
			"date": "2026-10-10",
			"start": "2026-10-10T23:00:00Z",
			"state": "upcoming",
			"venue": "Ball Arena",
			"away": {
				"abbrev": "TOR",
				"score": null,
				"odds": null
			},
			"home": {
				"abbrev": "COL",
				"score": null,
				"odds": null
			},
			"networks": ["NHLN", "ALT"]
		},
		{
			"id": 2026020081,
			"date": "2026-10-10",
			"start": "2026-10-10T23:30:00Z",
			"state": "upcoming",
			"venue": "UBS Arena",
			"away": {
				"abbrev": "TBL",
				"score": null,
				"odds": null
			},
			"home": {
				"abbrev": "NYI",
				"score": null,
				"odds": null
			},
			"networks": ["The Spot", "MSGSN"]
		},
		{
			"id": 2026020082,
			"date": "2026-10-10",
			"start": "2026-10-11T02:00:00Z",
			"state": "upcoming",
			"venue": "Scotiabank Saddledome",
			"away": {
				"abbrev": "ANA",
				"score": null,
				"odds": null
			},
			"home": {
				"abbrev": "CGY",
				"score": null,
				"odds": null
			},
			"networks": ["Prime Video", "KCOP-13"]
		},
		{
			"id": 2026020083,
			"date": "2026-10-10",
			"start": "2026-10-11T02:00:00Z",
			"state": "upcoming",
			"venue": "T-Mobile Arena",
			"away": {
				"abbrev": "LAK",
				"score": null,
				"odds": null
			},
			"home": {
				"abbrev": "VGK",
				"score": null,
				"odds": null
			},
			"networks": ["ABTV ", "SCRIPPS"]
		},
		{
			"id": 2026020084,
			"date": "2026-10-11",
			"start": "2026-10-11T21:00:00Z",
			"state": "upcoming",
			"venue": "Capital One Arena",
			"away": {
				"abbrev": "SEA",
				"score": null,
				"odds": null
			},
			"home": {
				"abbrev": "WSH",
				"score": null,
				"odds": null
			},
			"networks": [
				"Prime Video",
				"MNMT",
				"KONG"
			]
		},
		{
			"id": 2026020085,
			"date": "2026-10-11",
			"start": "2026-10-11T22:00:00Z",
			"state": "upcoming",
			"venue": "Madison Square Garden",
			"away": {
				"abbrev": "VAN",
				"score": null,
				"odds": null
			},
			"home": {
				"abbrev": "NYR",
				"score": null,
				"odds": null
			},
			"networks": ["MSG"]
		},
		{
			"id": 2026020086,
			"date": "2026-10-11",
			"start": "2026-10-11T23:00:00Z",
			"state": "upcoming",
			"venue": "Xfinity Mobile Arena",
			"away": {
				"abbrev": "CAR",
				"score": null,
				"odds": null
			},
			"home": {
				"abbrev": "PHI",
				"score": null,
				"odds": null
			},
			"networks": [
				"CARNHL",
				"HHN",
				"NHLN"
			]
		}
	],
	injuries: [
		{
			"abbrev": "ANA",
			"player": "Drew Helleson",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Lower Body",
			"note": "Helleson (lower body) hopes to return at the end of Anaheim's upcoming road trip, per Zach Cavanagh of The Sporting Tribune on Wednesday."
		},
		{
			"abbrev": "ANA",
			"player": "Troy Terry",
			"pos": "RW",
			"status": "Injured Reserve",
			"detail": "Surgery",
			"note": "Terry (hip) was moved from the non-roster list to long-term injured reserve Wednesday, Zach Cavanagh of The Sporting Tribune reports."
		},
		{
			"abbrev": "ANA",
			"player": "Ian Moore",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Not Specified",
			"note": "ir"
		},
		{
			"abbrev": "BOS",
			"player": "Charlie McAvoy",
			"pos": "D",
			"status": "Suspension",
			"detail": "Suspension",
			"note": "McAvoy logged an even-strength goal on three shots and four PIM in a game-high 28:35 of ice time during Sunday's 3-2 shootout win over the Capitals in preseason play."
		},
		{
			"abbrev": "BUF",
			"player": "Josh Doan",
			"pos": "RW",
			"status": "Day-To-Day",
			"detail": "Lower Body",
			"note": "day-to-day"
		},
		{
			"abbrev": "BUF",
			"player": "Jason Zucker",
			"pos": "LW",
			"status": "Injured Reserve",
			"detail": "Surgery",
			"note": "Zucker (abdomen) participated in Tuesday's morning skate but is still a few weeks away from returning to game action, Matthew Fairburn of The Athletic reports."
		},
		{
			"abbrev": "BUF",
			"player": "Alex Lyon",
			"pos": "G",
			"status": "Injured Reserve",
			"detail": "Upper Body",
			"note": "Lyon (upper body) was spotted practicing at Tuesday's optional morning skate, per Matthew Fairburn of The Athletic."
		},
		{
			"abbrev": "BUF",
			"player": "Conor Timmins",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Not Specified",
			"note": "Timmins (lower body) doesn't have a timeline for his return yet, according to Heather Engel of NHL.com on Tuesday."
		},
		{
			"abbrev": "BUF",
			"player": "Topias Leinonen",
			"pos": "G",
			"status": "Injured Reserve",
			"detail": "Lower Body",
			"note": "Leinonen (lower body) was placed on the injured non-roster list Monday."
		},
		{
			"abbrev": "BUF",
			"player": "Jack Rathbone",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Not Specified",
			"note": "ir-nr"
		},
		{
			"abbrev": "CGY",
			"player": "Jonathan Huberdeau",
			"pos": "LW",
			"status": "Injured Reserve",
			"detail": "Surgery",
			"note": "Huberdeau (hip) was placed on injured reserve Monday, per Pat Steinberg of QR Calgary 770 AM."
		},
		{
			"abbrev": "CAR",
			"player": "Seth Jarvis",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Surgery",
			"note": "Jarvis (shoulder) was placed on the injured non-roster list Sunday."
		},
		{
			"abbrev": "CAR",
			"player": "Alexander Nikishin",
			"pos": "D",
			"status": "Out",
			"detail": "Not Specified",
			"note": "out"
		},
		{
			"abbrev": "CHI",
			"player": "Andrew Mangiapane",
			"pos": "LW",
			"status": "Injured Reserve",
			"detail": "Lower Body",
			"note": "ir"
		},
		{
			"abbrev": "CHI",
			"player": "Teuvo Teravainen",
			"pos": "C",
			"status": "Out",
			"detail": "Undisclosed",
			"note": "out"
		},
		{
			"abbrev": "CHI",
			"player": "Connor Bedard",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Shoulder",
			"note": "Bedard (shoulder) was on the ice for Monday's practice session, Scott Powers of The Athletic reports."
		},
		{
			"abbrev": "COL",
			"player": "Logan O'Connor",
			"pos": "RW",
			"status": "Injured Reserve",
			"detail": "Lower Body",
			"note": "O'Connor (lower body) won't play Wednesday in Winnipeg, but he might be an option Thursday in Calgary, per Evan Rawal of the Denver Gazette."
		},
		{
			"abbrev": "COL",
			"player": "Trent Miner",
			"pos": "G",
			"status": "Injured Reserve",
			"detail": "Undisclosed",
			"note": "ir-nr"
		},
		{
			"abbrev": "COL",
			"player": "Georgii Merkulov",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Undisclosed",
			"note": "Merkulov (undisclosed) was put on non-roster injured reserve Monday."
		},
		{
			"abbrev": "DAL",
			"player": "Joel Kiviranta",
			"pos": "LW",
			"status": "Out",
			"detail": "Lower Body",
			"note": "out"
		},
		{
			"abbrev": "DAL",
			"player": "Matt Duchene",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Lower Body",
			"note": "The Stars placed Duchene (lower body) on long-term injured reserve Thursday, retroactive to Sept. 29."
		},
		{
			"abbrev": "DAL",
			"player": "Harrison Scott",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Undisclosed",
			"note": "ir-nr"
		},
		{
			"abbrev": "DAL",
			"player": "Luke Krys",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Undisclosed",
			"note": "ir-nr"
		},
		{
			"abbrev": "DAL",
			"player": "Cameron Hughes",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Upper Body",
			"note": "ir-nr"
		},
		{
			"abbrev": "DET",
			"player": "J.T. Compher",
			"pos": "LW",
			"status": "Out",
			"detail": "Undisclosed",
			"note": "out"
		},
		{
			"abbrev": "DET",
			"player": "Mason Appleton",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Not Specified",
			"note": "ir"
		},
		{
			"abbrev": "DET",
			"player": "Marco Kasper",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Upper Body",
			"note": "Kasper (upper body) has been given a week-to-week timetable for return."
		},
		{
			"abbrev": "DET",
			"player": "Simon Edvinsson",
			"pos": "D",
			"status": "Out",
			"detail": "Contract Dispute",
			"note": "Edvinsson, who is a restricted free agent, has returned to Sweden to resume his training, per Andreas III Johnsson of Goteborgs-Posten on Wednesday."
		},
		{
			"abbrev": "DET",
			"player": "Chase Stillman",
			"pos": "RW",
			"status": "Injured Reserve",
			"detail": "Undisclosed",
			"note": "Stillman (undisclosed) was moved to the injured non-roster list Monday."
		},
		{
			"abbrev": "DET",
			"player": "Carter Bear",
			"pos": "LW",
			"status": "Injured Reserve",
			"detail": "Not Specified",
			"note": "Bear (upper body) was placed on the injured non-roster list Monday."
		},
		{
			"abbrev": "DET",
			"player": "Jacob Bernard-Docker",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Not Specified",
			"note": "The Red Wings placed Bernard-Docker (upper body) on injured reserve Monday, Ansar Khan of MLive.com reports."
		},
		{
			"abbrev": "EDM",
			"player": "Colton Dach",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Undisclosed",
			"note": "ir"
		},
		{
			"abbrev": "EDM",
			"player": "Zach Hyman",
			"pos": "LW",
			"status": "Out",
			"detail": "Not Specified",
			"note": "Hyman (undisclosed) is expected to be out of action for two weeks, Oilers play-by-play announcer Jack Michaels reports Thursday."
		},
		{
			"abbrev": "EDM",
			"player": "Alec Regula",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Undisclosed",
			"note": "Regula (undisclosed) was designated for long-term injured reserve Thursday."
		},
		{
			"abbrev": "EDM",
			"player": "Ryan Nugent-Hopkins",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Lower Body",
			"note": "The Oilers placed Nugent-Hopkins (lower body) on injured reserve Thursday."
		},
		{
			"abbrev": "EDM",
			"player": "Matt Savoie",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Not Specified",
			"note": "Savoie (lower body) was shifted to long-term injured reserve Thursday."
		},
		{
			"abbrev": "EDM",
			"player": "Frederik Andersen",
			"pos": "G",
			"status": "Injured Reserve",
			"detail": "Knee",
			"note": "Andersen (knee) isn't expected back until \"maybe\" December, head coach Mike Babcock told NHL.com on Tuesday."
		},
		{
			"abbrev": "EDM",
			"player": "Mattias Janmark",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Surgery",
			"note": "Janmark (undisclosed) does not have a timetable for his return from injury."
		},
		{
			"abbrev": "EDM",
			"player": "James Stefan",
			"pos": "RW",
			"status": "Injured Reserve",
			"detail": "Undisclosed",
			"note": "ir-nr"
		},
		{
			"abbrev": "EDM",
			"player": "Atro Leppanen",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Undisclosed",
			"note": "ir-nr"
		},
		{
			"abbrev": "FLA",
			"player": "Aaron Ekblad",
			"pos": "D",
			"status": "Day-To-Day",
			"detail": "Personal",
			"note": "day-to-day"
		},
		{
			"abbrev": "FLA",
			"player": "Brad Marchand",
			"pos": "LW",
			"status": "Day-To-Day",
			"detail": "Leg",
			"note": "day-to-day"
		},
		{
			"abbrev": "FLA",
			"player": "Aleksander Barkov",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Lower Body",
			"note": "Barkov (lower body) will be out for approximately 6-8 weeks, Jameson Olive of the Panthers' official site reports Tuesday."
		},
		{
			"abbrev": "FLA",
			"player": "Jonah Gadjovich",
			"pos": "LW",
			"status": "Injured Reserve",
			"detail": "Surgery",
			"note": "Gadjovich (upper body) is out indefinitely, the team announced Thursday."
		},
		{
			"abbrev": "LAK",
			"player": "Jakub Dvorak",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Upper Body",
			"note": "ir-nr"
		},
		{
			"abbrev": "LAK",
			"player": "Jan Jenik",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Undisclosed",
			"note": "Jenik (undisclosed) was placed on non-roster injured reserve by Los Angeles on Thursday, per Zach Dooley of LA Kings Insider."
		},
		{
			"abbrev": "LAK",
			"player": "Kevin Fiala",
			"pos": "LW",
			"status": "Injured Reserve",
			"detail": "Surgery",
			"note": "Fiala (lower leg fracture) is at least three weeks away from being ready to play, Zach Dooley of the Kings' official site reports Thursday."
		},
		{
			"abbrev": "MIN",
			"player": "Nick Foligno",
			"pos": "LW",
			"status": "Out",
			"detail": "Upper Body",
			"note": "out"
		},
		{
			"abbrev": "MIN",
			"player": "Brock Faber",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Surgery",
			"note": "Faber underwent a procedure to repair his fractured skull and is without a timetable to return, per Michael Russo of The Athletic."
		},
		{
			"abbrev": "MIN",
			"player": "Filip Gustavsson",
			"pos": "G",
			"status": "Injured Reserve",
			"detail": "Surgery",
			"note": "Gustavsson (hip) was placed on injured reserve Monday, according to Dylan Loucks of The Hockey News."
		},
		{
			"abbrev": "MTL",
			"player": "Sam Montembeault",
			"pos": "G",
			"status": "Out",
			"detail": "Undisclosed",
			"note": "out"
		},
		{
			"abbrev": "MTL",
			"player": "Oliver Kapanen",
			"pos": "C",
			"status": "Day-To-Day",
			"detail": "Lower Body",
			"note": "day-to-day"
		},
		{
			"abbrev": "MTL",
			"player": "Ivan Demidov",
			"pos": "RW",
			"status": "Injured Reserve",
			"detail": "Not Specified",
			"note": "Demidov (lower body) was placed on injured reserve by the Canadiens on Tuesday, per the NHL media site."
		},
		{
			"abbrev": "MTL",
			"player": "Kaiden Guhle",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Surgery",
			"note": "Head coach Martin St. Louis said Monday that Guhle (groin) is getting close to being ready to play, Stu Cowan of The Montreal Gazette reports."
		},
		{
			"abbrev": "MTL",
			"player": "Bryce Pickford",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Undisclosed",
			"note": "ir-nr"
		},
		{
			"abbrev": "MTL",
			"player": "Lucas Condotta",
			"pos": "LW",
			"status": "Injured Reserve",
			"detail": "Undisclosed",
			"note": "ir-nr"
		},
		{
			"abbrev": "NSH",
			"player": "Justus Annunen",
			"pos": "G",
			"status": "Injured Reserve",
			"detail": "Undisclosed",
			"note": "ir"
		},
		{
			"abbrev": "NJD",
			"player": "Jonas Siegenthaler",
			"pos": "D",
			"status": "Day-To-Day",
			"detail": "Undisclosed",
			"note": "day-to-day"
		},
		{
			"abbrev": "NJD",
			"player": "Connor Brown",
			"pos": "RW",
			"status": "Out",
			"detail": "Lower Body",
			"note": "out"
		},
		{
			"abbrev": "NJD",
			"player": "Seamus Casey",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Knee",
			"note": "Casey will be out of action for 6-8 weeks after undergoing a knee procedure, Kristy Flannery of The Hockey News reports Friday."
		},
		{
			"abbrev": "NJD",
			"player": "Johnathan Kovacevic",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Knee",
			"note": "Kovacevic (knee) will begin the 2026-27 regular season on the injured non-roster list, per Mike Morreale of NHL.com."
		},
		{
			"abbrev": "NJD",
			"player": "Nick Bjugstad",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Surgery",
			"note": "ir-nr"
		},
		{
			"abbrev": "NYI",
			"player": "Alexander Romanov",
			"pos": "D",
			"status": "Out",
			"detail": "Surgery",
			"note": "out"
		},
		{
			"abbrev": "NYI",
			"player": "Mathew Barzal",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Knee",
			"note": "Barzal (knee) might resume skating this weekend or early next week, Andrew Gross of Newsday reports Wednesday."
		},
		{
			"abbrev": "NYR",
			"player": "Joe Veleno",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Lower Body",
			"note": "ir"
		},
		{
			"abbrev": "NYR",
			"player": "Joonas Korpisalo",
			"pos": "G",
			"status": "Injured Reserve",
			"detail": "Lower Body",
			"note": "ir"
		},
		{
			"abbrev": "NYR",
			"player": "Aidan Thompson",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Not Specified",
			"note": "ir-nr"
		},
		{
			"abbrev": "NYR",
			"player": "Adam Sykora",
			"pos": "LW",
			"status": "Injured Reserve",
			"detail": "Lower Body",
			"note": "ir"
		},
		{
			"abbrev": "OTT",
			"player": "Jake Sanderson",
			"pos": "D",
			"status": "Out",
			"detail": "Lower Body",
			"note": "out"
		},
		{
			"abbrev": "OTT",
			"player": "Artem Zub",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Knee",
			"note": "Zub, who has been recovering from a knee injury, was seen skating during Senators' morning skate Thursday, per Wayne Scanlan of Sportsnet."
		},
		{
			"abbrev": "OTT",
			"player": "Andre Burakovsky",
			"pos": "LW",
			"status": "Injured Reserve",
			"detail": "Not Specified",
			"note": "Burakovsky (upper body) was placed on injured reserve Monday, according to Bruce Garrioch of Postmedia."
		},
		{
			"abbrev": "OTT",
			"player": "Kurtis MacDermid",
			"pos": "LW",
			"status": "Injured Reserve",
			"detail": "Upper Body",
			"note": "MacDermid (upper body) was moved to the injured non-roster list Monday."
		},
		{
			"abbrev": "PHI",
			"player": "Rasmus Ristolainen",
			"pos": "D",
			"status": "Day-To-Day",
			"detail": "Undisclosed",
			"note": "day-to-day"
		},
		{
			"abbrev": "PHI",
			"player": "Nikita Grebenkin",
			"pos": "RW",
			"status": "Injured Reserve",
			"detail": "Upper Body",
			"note": "ir"
		},
		{
			"abbrev": "PHI",
			"player": "Helge Grans",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Lower Body",
			"note": "Grans (lower body) was put on the injured non-roster list Monday."
		},
		{
			"abbrev": "PIT",
			"player": "Andrei Kuzmenko",
			"pos": "LW",
			"status": "Injured Reserve",
			"detail": "Personal",
			"note": "ir-nr"
		},
		{
			"abbrev": "PIT",
			"player": "Justin Brazeau",
			"pos": "RW",
			"status": "Injured Reserve",
			"detail": "Lower Body",
			"note": "Brazeau (lower body) was placed on injured reserve by the Penguins on Sunday."
		},
		{
			"abbrev": "PIT",
			"player": "Ryan Graves",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Knee",
			"note": "Graves (lower body) is out indefinitely and was placed on injured reserve Sunday."
		},
		{
			"abbrev": "SJS",
			"player": "Macklin Celebrini",
			"pos": "C",
			"status": "Day-To-Day",
			"detail": "Lower Body",
			"note": "Head coach Ryan Warsofsky said Tuesday that Celebrini (lower body) is considered day-to-day, Sheng Peng of San Jose Hockey Now reports."
		},
		{
			"abbrev": "SJS",
			"player": "Adam Gaudette",
			"pos": "RW",
			"status": "Injured Reserve",
			"detail": "Upper Body",
			"note": "Gaudette (upper body) will begin the 2026-27 regular season on the injured non-roster list, per Curtis Pashelka of The San Jose Mercury News."
		},
		{
			"abbrev": "SJS",
			"player": "Alex Barre-Boulet",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Undisclosed",
			"note": "Barre-Boulet (undisclosed) will begin the 2026-27 regular season on injured reserve, per Curtis Pashelka of The San Jose Mercury News."
		},
		{
			"abbrev": "SJS",
			"player": "Quentin Musty",
			"pos": "LW",
			"status": "Injured Reserve",
			"detail": "Upper Body",
			"note": "Musty (upper body) was put on non-roster injured reserve Monday, according to Curtis Pashelka of The San Jose Mercury News."
		},
		{
			"abbrev": "SJS",
			"player": "Cam Lund",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Upper Body",
			"note": "Lund (upper body) was placed on non-roster injured reserve by the Sharks on Monday, Curtis Pashelka of The San Jose Mercury News reports."
		},
		{
			"abbrev": "SJS",
			"player": "Kyle Keyser",
			"pos": "G",
			"status": "Injured Reserve",
			"detail": "Upper Body",
			"note": "Keyser (upper body) was placed on non-roster injured reserve by the Sharks on Monday, Curtis Pashelka of The San Jose Mercury News reports."
		},
		{
			"abbrev": "SEA",
			"player": "Ryan Lindgren",
			"pos": "D",
			"status": "Day-To-Day",
			"detail": "Upper Body",
			"note": "day-to-day"
		},
		{
			"abbrev": "SEA",
			"player": "Jacob Melanson",
			"pos": "RW",
			"status": "Injured Reserve",
			"detail": "Upper Body",
			"note": "Melanson (upper body) was placed on injured reserve Saturday."
		},
		{
			"abbrev": "SEA",
			"player": "Jake O'Brien",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Lower Body",
			"note": "O'Brien (lower body) was placed on non-roster injured reserve Wednesday."
		},
		{
			"abbrev": "STL",
			"player": "Alexey Toropchenko",
			"pos": "RW",
			"status": "Injured Reserve",
			"detail": "Upper Body",
			"note": "ir"
		},
		{
			"abbrev": "STL",
			"player": "Tyler Tucker",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Surgery",
			"note": "Tucker had arthroscopic knee surgery and will be re-assessed in six weeks, the team announced Wednesday."
		},
		{
			"abbrev": "STL",
			"player": "Felix Trudeau",
			"pos": "LW",
			"status": "Injured Reserve",
			"detail": "Undisclosed",
			"note": "ir-nr"
		},
		{
			"abbrev": "STL",
			"player": "Logan Mailloux",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Surgery",
			"note": "ir"
		},
		{
			"abbrev": "TBL",
			"player": "Dominic James",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Hand",
			"note": "James (hand) will not be in the lineup versus the Wild on Thursday, Eduardo A. Encina of the Tampa Bay Times reports."
		},
		{
			"abbrev": "TBL",
			"player": "Emil Lilleberg",
			"pos": "D",
			"status": "Out",
			"detail": "Undisclosed",
			"note": "Lilleberg (undisclosed) has been ruled out for Monday's game against the Flyers and is expected to miss approximately one week, Eduardo A. Encina of the Tampa Bay Times reports."
		},
		{
			"abbrev": "TBL",
			"player": "Yanni Gourde",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Surgery",
			"note": "Gourde (hip) was placed on the injured non-roster list Monday."
		},
		{
			"abbrev": "TOR",
			"player": "Dakota Joshua",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Abdomen",
			"note": "Joshua (abdomen) has been moved from the non-roster list to long-term injured reserve, PuckPedia reports Wednesday."
		},
		{
			"abbrev": "TOR",
			"player": "Max Domi",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Surgery",
			"note": "Domi (back) was transferred from the non-roster list to long-term injured reserve Wednesday, per PuckPedia."
		},
		{
			"abbrev": "TOR",
			"player": "Cade Webber",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Elbow",
			"note": "ir-nr"
		},
		{
			"abbrev": "TOR",
			"player": "Elvis Merzlikins",
			"pos": "G",
			"status": "Injured Reserve",
			"detail": "Surgery",
			"note": "Merzlikins is expected to miss 4-6 months to begin the 2026-27 regular season while recovering from a shoulder injury, per Luke Fox of Sportsnet."
		},
		{
			"abbrev": "TOR",
			"player": "William Villeneuve",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Surgery",
			"note": "ir-nr"
		},
		{
			"abbrev": "UTA",
			"player": "Mikhail Sergachev",
			"pos": "D",
			"status": "Day-To-Day",
			"detail": "Undisclosed",
			"note": "day-to-day"
		},
		{
			"abbrev": "UTA",
			"player": "Maveric Lamoureux",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Shoulder",
			"note": "ir"
		},
		{
			"abbrev": "VAN",
			"player": "Jack Thompson",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Undisclosed",
			"note": "ir-nr"
		},
		{
			"abbrev": "VAN",
			"player": "Akil Thomas",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Undisclosed",
			"note": "ir-nr"
		},
		{
			"abbrev": "VAN",
			"player": "Mackenzie MacEachern",
			"pos": "LW",
			"status": "Injured Reserve",
			"detail": "Undisclosed",
			"note": "ir-nr"
		},
		{
			"abbrev": "VAN",
			"player": "Thatcher Demko",
			"pos": "G",
			"status": "Injured Reserve",
			"detail": "Surgery",
			"note": "Co-president of hockey operations Henrik Sedin said Monday that he hopes Demko (hip) will be ready to return before Christmas, Kevin Woodley of NHL.com reports."
		},
		{
			"abbrev": "VAN",
			"player": "Filip Chytil",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Shoulder",
			"note": "ir"
		},
		{
			"abbrev": "VGK",
			"player": "Raphael Lavoie",
			"pos": "C",
			"status": "Day-To-Day",
			"detail": "Undisclosed",
			"note": "day-to-day"
		},
		{
			"abbrev": "VGK",
			"player": "Victor Olofsson",
			"pos": "LW",
			"status": "Day-To-Day",
			"detail": "Undisclosed",
			"note": "day-to-day"
		},
		{
			"abbrev": "VGK",
			"player": "Lukas Cormier",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Undisclosed",
			"note": "ir"
		},
		{
			"abbrev": "WSH",
			"player": "Matt Roy",
			"pos": "D",
			"status": "Day-To-Day",
			"detail": "Lower Body",
			"note": "day-to-day"
		},
		{
			"abbrev": "WSH",
			"player": "Patrick Thomas",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Upper Body",
			"note": "ir-nr"
		},
		{
			"abbrev": "WSH",
			"player": "Rasmus Sandin",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Surgery",
			"note": "Sandin (knee) will begin the 2026-27 regular season on the injured non-roster list."
		},
		{
			"abbrev": "WPG",
			"player": "Josh Morrissey",
			"pos": "D",
			"status": "Day-To-Day",
			"detail": "Upper Body",
			"note": "day-to-day"
		},
		{
			"abbrev": "WPG",
			"player": "Connor Hellebuyck",
			"pos": "G",
			"status": "Injured Reserve",
			"detail": "Suspension",
			"note": "ir-nr"
		},
		{
			"abbrev": "WPG",
			"player": "Garrett Brown",
			"pos": "C",
			"status": "Injured Reserve",
			"detail": "Lower Body",
			"note": "ir-nr"
		},
		{
			"abbrev": "WPG",
			"player": "Walker Duehr",
			"pos": "RW",
			"status": "Injured Reserve",
			"detail": "Lower Body",
			"note": "ir-nr"
		},
		{
			"abbrev": "WPG",
			"player": "Elias Salomonsson",
			"pos": "D",
			"status": "Injured Reserve",
			"detail": "Surgery",
			"note": "ir-nr"
		}
	],
	news: [
		{
			"id": "50125128",
			"title": "Wysh List: What NHL execs think of ESPN's top 100 player rankings",
			"dek": "Who was too high or too low according to actual team personnel and players? Plus, winners and losers of the week, key upcoming games and more.",
			"at": "2026-10-08T14:19:34Z",
			"url": "https://www.espn.com/nhl/story/_/id/50125128/nhl-2026-27-wysh-list-player-rankings-insiders-execs-audit-overrated-underrated",
			"teams": []
		},
		{
			"id": "50126088",
			"title": "NHL Tonight: Previews and betting info for all 10 of Thursday's games",
			"dek": "From the six 7 p.m. matchups all the way through Maple Leafs-Golden Knights at 10, here's what to watch.",
			"at": "2026-10-08T10:13:34Z",
			"url": "https://www.espn.com/nhl/story/_/id/50126088/nhl-2026-27-tonight-games-schedule-matchups-stats-top-players-betting",
			"teams": ["VGK", "TOR"]
		},
		{
			"id": "50131285",
			"title": "Penguins take on the Blue Jackets in Metropolitan Division play",
			"dek": "Pittsburgh Penguins (2-2, in the Metropolitan Division) vs. Columbus Blue Jackets (1-1, in the Metropolitan Division)",
			"at": "2026-10-08T08:12:32Z",
			"url": "http://www.espn.com/nhl/preview?gameId=401892467",
			"teams": ["PIT", "CBJ"]
		},
		{
			"id": "50131284",
			"title": "Anaheim visits Winnipeg after Sennecke's 2-goal game",
			"dek": "Anaheim Ducks (2-1, in the Pacific Division) vs. Winnipeg Jets (3-0-1, in the Central Division)",
			"at": "2026-10-08T08:12:29Z",
			"url": "http://www.espn.com/nhl/preview?gameId=401892468",
			"teams": ["WPG", "ANA"]
		},
		{
			"id": "50131283",
			"title": "Red Wings host the Kraken after DeBrincat's 2-goal game",
			"dek": "Seattle Kraken (2-2, in the Pacific Division) vs. Detroit Red Wings (1-2, in the Atlantic Division)",
			"at": "2026-10-08T08:11:49Z",
			"url": "http://www.espn.com/nhl/preview?gameId=401892465",
			"teams": ["SEA", "DET"]
		},
		{
			"id": "50131282",
			"title": "Rangers visit the Capitals after Lafreniere's hat trick",
			"dek": "New York Rangers (4-1, in the Metropolitan Division) vs. Washington Capitals (2-1, in the Metropolitan Division)",
			"at": "2026-10-08T08:11:45Z",
			"url": "http://www.espn.com/nhl/preview?gameId=401892466",
			"teams": ["NYR", "WSH"]
		},
		{
			"id": "50131281",
			"title": "Flames host the Avalanche on losing streak",
			"dek": "Colorado Avalanche (2-1, in the Central Division) vs. Calgary Flames (0-3, in the Pacific Division)",
			"at": "2026-10-08T08:11:41Z",
			"url": "http://www.espn.com/nhl/preview?gameId=401892463",
			"teams": ["COL", "CGY"]
		},
		{
			"id": "50131279",
			"title": "Evan Bouchard continues historic start, Oilers pummel Ducks in 2nd period in 5-2 win",
			"dek": "— Evan Bouchard had two goals and an assist to become the second defenseman in NHL history with at least six goals through the first four games of a season, and the Edmonton Oilers used a five-goal second period to beat ",
			"at": "2026-10-08T08:05:49Z",
			"url": "http://www.espn.com/nhl/recap?gameId=401892456",
			"teams": ["EDM", "ANA"]
		},
		{
			"id": "50130575",
			"title": "Edmonton Oilers vs. Anaheim Ducks: Game Highlights",
			"dek": "Edmonton Oilers vs. Anaheim Ducks: Game Highlights",
			"at": "2026-10-08T04:54:52Z",
			"url": "https://www.espn.com/video/clip/_/id/50130575/game-highlights",
			"teams": ["EDM", "ANA"]
		},
		{
			"id": "50130222",
			"title": "Alex Ovechkin's 'cool' final home opener marked by sons introducing him pregame",
			"dek": "On the occasion of his final NHL home opener, Alex Ovechkin described it as \"pretty cool\" when his sons, Ilya and Sergei Ovechkin, were given the microphone to announce their father in player introductions Wednesday.",
			"at": "2026-10-08T04:36:38Z",
			"url": "https://www.espn.com/nhl/story/_/id/50130222/alex-ovechkin-cool-final-home-opener-marked-sons-introducing-pregame",
			"teams": []
		},
		{
			"id": "50129771",
			"title": "Kyle Connor scores twice, Jets beat Avalanche 3-2 for 3rd straight victory",
			"dek": "— Kyle Connor broke a tie with a minute left with his second goal of game, Stuart Skinner made 32 saves and the Winnipeg Jets beat the Colorado Avalanche 3-2 on Wednesday night for their third straight victory.",
			"at": "2026-10-08T04:26:28Z",
			"url": "http://www.espn.com/nhl/recap?gameId=401892455",
			"teams": ["WPG", "COL"]
		},
		{
			"id": "50129677",
			"title": "Colorado Avalanche vs. Winnipeg Jets: Game Highlights",
			"dek": "Colorado Avalanche vs. Winnipeg Jets: Game Highlights",
			"at": "2026-10-08T02:33:59Z",
			"url": "https://www.espn.com/video/clip/_/id/50129677/game-highlights",
			"teams": ["WPG", "COL"]
		},
		{
			"id": "50129628",
			"title": "Pittsburgh Penguins vs. Washington Capitals: Game Highlights",
			"dek": "Pittsburgh Penguins vs. Washington Capitals: Game Highlights",
			"at": "2026-10-08T02:24:13Z",
			"url": "https://www.espn.com/video/clip/_/id/50129628/game-highlights",
			"teams": ["WSH", "PIT"]
		},
		{
			"id": "50129564",
			"title": "Capitals top Penguins 5-3 in Alex Ovechkin's final home opener in Washington",
			"dek": "— Tom Wilson had a goal and two assists, and the Washington Capitals held on for a win in Alex Ovechkin's final home opener, 5-3 over the Pittsburgh Penguins on Wednesday night.",
			"at": "2026-10-08T02:18:30Z",
			"url": "http://www.espn.com/nhl/recap?gameId=401891830",
			"teams": ["WSH", "PIT"]
		},
		{
			"id": "50126876",
			"title": "U10 hockey owner says parents' jackets violate trademark, threatens suspension",
			"dek": "Mothers of players in the U10 club made jackets with \"Hitmen\" on the front and \"Hitmama Hockey\" on the back.",
			"at": "2026-10-07T19:41:40Z",
			"url": "https://www.espn.com/espn/story/_/id/50126876/u10-hockey-new-jersey-hitmamas-trademark-violation",
			"teams": []
		},
		{
			"id": "50126899",
			"title": "Islanders D Alexander Romanov out 6-8 months with torn ACL",
			"dek": "The Islanders said Wednesday that defenseman Alexander Romanov has a torn ACL and is expected to be out 6-8 months.",
			"at": "2026-10-07T18:59:44Z",
			"url": "https://www.espn.com/nhl/story/_/id/50126899/islanders-d-alexander-romanov-6-8-months-torn-acl",
			"teams": ["NYI"]
		},
		{
			"id": "50126459",
			"title": "The NHL Frozen Frenzy returns to ESPN",
			"dek": "The NHL Frozen Frenzy returns to ESPN",
			"at": "2026-10-07T17:55:08Z",
			"url": "https://www.espn.com/video/clip/_/id/50126459/the-nhl-frozen-frenzy-returns-espn",
			"teams": []
		},
		{
			"id": "50126128",
			"title": "Penguins trade Filip Hallander to Oilers for Spencer Stastney",
			"dek": "The Penguins have acquired defenseman Spencer Stastney from the Oilers in exchange for forward Filip Hallander.",
			"at": "2026-10-07T17:05:53Z",
			"url": "https://www.espn.com/nhl/story/_/id/50126128/penguins-trade-filip-hallander-oilers-spencer-stastney",
			"teams": ["EDM", "PIT"]
		},
		{
			"id": "50122046",
			"title": "Winnipeg Jets, Montreal Canadiens unveil NHL Heritage Classic sweaters",
			"dek": "After taking a three-year break, the NHL Heritage Classic returns with the Canadiens and Jets meeting outdoors.",
			"at": "2026-10-07T14:04:34Z",
			"url": "https://www.espn.com/nhl/story/_/id/50122046/nhl-jets-canadiens-heritage-classic-uniforms",
			"teams": ["WPG", "MTL"]
		},
		{
			"id": "50118123",
			"title": "The top NCAA hockey teams to watch for high-end prospects in 2026-27",
			"dek": "The college hockey season is just underway. Here's where to get a glimpse at the next wave of NHL stars.",
			"at": "2026-10-07T13:37:10Z",
			"url": "https://www.espn.com/nhl/story/_/id/50118123/nhl-2026-27-ncaa-hockey-prospects-top-teams-players-draft",
			"teams": ["DAL"]
		},
		{
			"id": "50109198",
			"title": "Why expansion to Houston makes too much sense for the NHL",
			"dek": "Commissioner Gary Bettman said the league is considering a new team, and Houston's viability is concrete.",
			"at": "2026-10-07T15:10:25Z",
			"url": "https://www.espn.com/nhl/story/_/id/50109198/nhl-2026-27-expansion-houston-texas-market-size-demographics-new-team",
			"teams": []
		},
		{
			"id": "50120337",
			"title": "NHL Tonight: What to watch in each of Wednesday's matchups",
			"dek": "It's a light night in the league, with just three games on the schedule.",
			"at": "2026-10-07T13:22:38Z",
			"url": "https://www.espn.com/nhl/story/_/id/50120337/nhl-2026-27-tonight-games-schedule-matchups-stats-top-players-betting",
			"teams": []
		},
		{
			"id": "50123507",
			"title": "Matthew Tkachuk scores, Brad Marchand injured in Panthers' 2-1 win over Kings",
			"dek": "— Matthew Tkachuk scored in the third period to give the Florida Panthers a 2-1 win over the Los Angeles Kings on Tuesday night despite losing Brad Marchand to a left leg injury.",
			"at": "2026-10-07T08:35:30Z",
			"url": "http://www.espn.com/nhl/recap?gameId=401891806",
			"teams": ["FLA", "LAK"]
		},
		{
			"id": "50123502",
			"title": "Alexis Lafrenière has a hat trick as the Rangers beat the Islanders for their 4th win in a row",
			"dek": "— Alexis Lafrenière recorded a hat trick, with two goals into an empty net, and had an assist as the New York Rangers extended their winning streak to four by defeating the crosstown...",
			"at": "2026-10-07T08:33:42Z",
			"url": "http://www.espn.com/nhl/recap?gameId=401892452",
			"teams": ["NYR", "NYI"]
		}
	],
	skaters: /* @__PURE__ */ JSON.parse("{\"NYR\":[{\"id\":8476459,\"name\":\"Mika Zibanejad\",\"pos\":\"C\",\"no\":93,\"gp\":5,\"g\":1,\"a\":4,\"pts\":5,\"pm\":4,\"toi\":1240.4,\"sog\":9,\"ppg\":1,\"shg\":0},{\"id\":8476468,\"name\":\"J.T. Miller\",\"pos\":\"C\",\"no\":10,\"gp\":5,\"g\":1,\"a\":1,\"pts\":2,\"pm\":3,\"toi\":1033.8,\"sog\":9,\"ppg\":0,\"shg\":0},{\"id\":8477416,\"name\":\"Oliver Bjorkstrand\",\"pos\":\"R\",\"no\":28,\"gp\":5,\"g\":2,\"a\":1,\"pts\":3,\"pm\":2,\"toi\":685.4,\"sog\":8,\"ppg\":1,\"shg\":0},{\"id\":8477969,\"name\":\"Marcus Pettersson\",\"pos\":\"D\",\"no\":26,\"gp\":5,\"g\":0,\"a\":0,\"pts\":0,\"pm\":2,\"toi\":1225.4,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8478882,\"name\":\"Vladislav Gavrikov\",\"pos\":\"D\",\"no\":44,\"gp\":5,\"g\":1,\"a\":3,\"pts\":4,\"pm\":4,\"toi\":1292.8,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8479323,\"name\":\"Adam Fox\",\"pos\":\"D\",\"no\":23,\"gp\":5,\"g\":0,\"a\":5,\"pts\":5,\"pm\":5,\"toi\":1268.6,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8480009,\"name\":\"Eeli Tolvanen\",\"pos\":\"R\",\"no\":17,\"gp\":5,\"g\":3,\"a\":0,\"pts\":3,\"pm\":3,\"toi\":814.4,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8480434,\"name\":\"Sean Durzi\",\"pos\":\"D\",\"no\":5,\"gp\":5,\"g\":1,\"a\":1,\"pts\":2,\"pm\":0,\"toi\":1247.8,\"sog\":3,\"ppg\":1,\"shg\":0},{\"id\":8480813,\"name\":\"Joseph Veleno\",\"pos\":\"C\",\"no\":90,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":697.25,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8481604,\"name\":\"Pavel Dorofeyev\",\"pos\":\"R\",\"no\":16,\"gp\":5,\"g\":1,\"a\":1,\"pts\":2,\"pm\":-1,\"toi\":977,\"sog\":15,\"ppg\":0,\"shg\":0},{\"id\":8481789,\"name\":\"Tye Kartye\",\"pos\":\"L\",\"no\":24,\"gp\":5,\"g\":0,\"a\":2,\"pts\":2,\"pm\":1,\"toi\":885.6,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8482073,\"name\":\"Braden Schneider\",\"pos\":\"D\",\"no\":4,\"gp\":5,\"g\":0,\"a\":0,\"pts\":0,\"pm\":2,\"toi\":1043.8,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8482109,\"name\":\"Alexis Lafrenière\",\"pos\":\"L\",\"no\":13,\"gp\":5,\"g\":3,\"a\":2,\"pts\":5,\"pm\":5,\"toi\":1148,\"sog\":11,\"ppg\":0,\"shg\":0},{\"id\":8482157,\"name\":\"Will Cuylle\",\"pos\":\"L\",\"no\":50,\"gp\":5,\"g\":0,\"a\":3,\"pts\":3,\"pm\":-1,\"toi\":909.6,\"sog\":14,\"ppg\":0,\"shg\":0},{\"id\":8482460,\"name\":\"Matt Rempe\",\"pos\":\"C\",\"no\":73,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":589,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8482877,\"name\":\"Jaroslav Chmelar\",\"pos\":\"R\",\"no\":49,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":450.5,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8483690,\"name\":\"Noah Laba\",\"pos\":\"C\",\"no\":42,\"gp\":5,\"g\":0,\"a\":1,\"pts\":1,\"pm\":0,\"toi\":883.8,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8484210,\"name\":\"Gabe Perreault\",\"pos\":\"R\",\"no\":94,\"gp\":5,\"g\":2,\"a\":2,\"pts\":4,\"pm\":2,\"toi\":894.6,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8484786,\"name\":\"Cole Beaudoin\",\"pos\":\"C\",\"no\":53,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":597,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8485957,\"name\":\"Alberts Smits\",\"pos\":\"D\",\"no\":12,\"gp\":5,\"g\":0,\"a\":0,\"pts\":0,\"pm\":2,\"toi\":889.6,\"sog\":1,\"ppg\":0,\"shg\":0}],\"EDM\":[{\"id\":8475218,\"name\":\"Mattias Ekholm\",\"pos\":\"D\",\"no\":14,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":10,\"toi\":1293.75,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8475786,\"name\":\"Zach Hyman\",\"pos\":\"L\",\"no\":18,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":1233,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8476473,\"name\":\"Connor Murphy\",\"pos\":\"D\",\"no\":5,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":1229.5,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8477450,\"name\":\"Jason Dickinson\",\"pos\":\"C\",\"no\":16,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":573,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8477934,\"name\":\"Leon Draisaitl\",\"pos\":\"C\",\"no\":29,\"gp\":4,\"g\":3,\"a\":6,\"pts\":9,\"pm\":8,\"toi\":1275,\"sog\":18,\"ppg\":1,\"shg\":0},{\"id\":8477953,\"name\":\"Kasperi Kapanen\",\"pos\":\"R\",\"no\":42,\"gp\":4,\"g\":2,\"a\":1,\"pts\":3,\"pm\":-4,\"toi\":1063.25,\"sog\":8,\"ppg\":1,\"shg\":1},{\"id\":8478013,\"name\":\"Jake Walman\",\"pos\":\"D\",\"no\":96,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-3,\"toi\":887.25,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8478402,\"name\":\"Connor McDavid\",\"pos\":\"C\",\"no\":97,\"gp\":4,\"g\":3,\"a\":9,\"pts\":12,\"pm\":11,\"toi\":1435.5,\"sog\":8,\"ppg\":0,\"shg\":1},{\"id\":8478472,\"name\":\"Mathieu Joseph\",\"pos\":\"R\",\"no\":21,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":0,\"toi\":897.75,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8478854,\"name\":\"Ryan Shea\",\"pos\":\"D\",\"no\":6,\"gp\":4,\"g\":1,\"a\":2,\"pts\":3,\"pm\":4,\"toi\":1376.75,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8479365,\"name\":\"Trent Frederic\",\"pos\":\"C\",\"no\":10,\"gp\":4,\"g\":1,\"a\":0,\"pts\":1,\"pm\":0,\"toi\":601,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8479368,\"name\":\"Max Jones\",\"pos\":\"L\",\"no\":46,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-4,\"toi\":615.5,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8480029,\"name\":\"Alex Formenton\",\"pos\":\"L\",\"no\":26,\"gp\":4,\"g\":0,\"a\":2,\"pts\":2,\"pm\":4,\"toi\":911,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8480803,\"name\":\"Evan Bouchard\",\"pos\":\"D\",\"no\":2,\"gp\":4,\"g\":6,\"a\":5,\"pts\":11,\"pm\":10,\"toi\":1503,\"sog\":16,\"ppg\":0,\"shg\":0},{\"id\":8480834,\"name\":\"Ty Emberson\",\"pos\":\"D\",\"no\":49,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":676,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8481617,\"name\":\"Vasily Podkolzin\",\"pos\":\"R\",\"no\":92,\"gp\":4,\"g\":4,\"a\":2,\"pts\":6,\"pm\":6,\"toi\":1124.75,\"sog\":16,\"ppg\":2,\"shg\":0},{\"id\":8482166,\"name\":\"Shakir Mukhamadullin\",\"pos\":\"D\",\"no\":85,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-6,\"toi\":692,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8482703,\"name\":\"Colton Dach\",\"pos\":\"C\",\"no\":34,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-4,\"toi\":802.6667,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8483455,\"name\":\"Isaac Howard\",\"pos\":\"L\",\"no\":53,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":0,\"toi\":607.75,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8484509,\"name\":\"Josh Samanski\",\"pos\":\"C\",\"no\":81,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":496.3333,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8486161,\"name\":\"Owen Michaels\",\"pos\":\"R\",\"no\":43,\"gp\":4,\"g\":2,\"a\":0,\"pts\":2,\"pm\":0,\"toi\":741,\"sog\":5,\"ppg\":0,\"shg\":0}],\"WPG\":[{\"id\":8475799,\"name\":\"Nino Niederreiter\",\"pos\":\"R\",\"no\":62,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":706,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8476331,\"name\":\"Dylan DeMelo\",\"pos\":\"D\",\"no\":2,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":0,\"toi\":1302,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8476392,\"name\":\"Adam Lowry\",\"pos\":\"C\",\"no\":17,\"gp\":4,\"g\":1,\"a\":2,\"pts\":3,\"pm\":2,\"toi\":930.5,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8476460,\"name\":\"Mark Scheifele\",\"pos\":\"C\",\"no\":55,\"gp\":4,\"g\":0,\"a\":2,\"pts\":2,\"pm\":0,\"toi\":1262.75,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8476480,\"name\":\"Vladislav Namestnikov\",\"pos\":\"C\",\"no\":7,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":717.5,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8477504,\"name\":\"Josh Morrissey\",\"pos\":\"D\",\"no\":44,\"gp\":4,\"g\":0,\"a\":3,\"pts\":3,\"pm\":-1,\"toi\":1204.25,\"sog\":12,\"ppg\":0,\"shg\":0},{\"id\":8478398,\"name\":\"Kyle Connor\",\"pos\":\"L\",\"no\":81,\"gp\":4,\"g\":5,\"a\":2,\"pts\":7,\"pm\":0,\"toi\":1243.75,\"sog\":24,\"ppg\":3,\"shg\":0},{\"id\":8479983,\"name\":\"Mario Ferraro\",\"pos\":\"D\",\"no\":38,\"gp\":4,\"g\":1,\"a\":0,\"pts\":1,\"pm\":0,\"toi\":1181,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8480014,\"name\":\"Gabriel Vilardi\",\"pos\":\"C\",\"no\":13,\"gp\":4,\"g\":0,\"a\":2,\"pts\":2,\"pm\":-3,\"toi\":942,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8480049,\"name\":\"Dylan Samberg\",\"pos\":\"D\",\"no\":54,\"gp\":4,\"g\":0,\"a\":2,\"pts\":2,\"pm\":1,\"toi\":1336,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8480113,\"name\":\"Alex Iafallo\",\"pos\":\"L\",\"no\":9,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":2,\"toi\":746,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8480145,\"name\":\"Neal Pionk\",\"pos\":\"D\",\"no\":4,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-1,\"toi\":1376,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8480289,\"name\":\"Morgan Barron\",\"pos\":\"C\",\"no\":36,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":1004.75,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8481030,\"name\":\"Jack St. Ivany\",\"pos\":\"D\",\"no\":6,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":853,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8481043,\"name\":\"Cole Koepke\",\"pos\":\"L\",\"no\":45,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":637.5,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8482149,\"name\":\"Cole Perfetti\",\"pos\":\"C\",\"no\":91,\"gp\":4,\"g\":3,\"a\":3,\"pts\":6,\"pm\":-1,\"toi\":1099.25,\"sog\":12,\"ppg\":1,\"shg\":0},{\"id\":8482459,\"name\":\"Tyrel Bauer\",\"pos\":\"D\",\"no\":77,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":436.5,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8482765,\"name\":\"Isak Rosen\",\"pos\":\"R\",\"no\":27,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":691,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8483471,\"name\":\"Brad Lambert\",\"pos\":\"C\",\"no\":93,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":668.25,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8486025,\"name\":\"Viggo Björck\",\"pos\":\"C\",\"no\":61,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":843.25,\"sog\":5,\"ppg\":0,\"shg\":0}],\"UTA\":[{\"id\":8475314,\"name\":\"Anders Lee\",\"pos\":\"L\",\"no\":72,\"gp\":4,\"g\":1,\"a\":2,\"pts\":3,\"pm\":2,\"toi\":745.5,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8476389,\"name\":\"Vincent Trocheck\",\"pos\":\"C\",\"no\":16,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":-2,\"toi\":1014.5,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8477220,\"name\":\"Nate Schmidt\",\"pos\":\"D\",\"no\":88,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":0,\"toi\":1298.75,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8477346,\"name\":\"MacKenzie Weegar\",\"pos\":\"D\",\"no\":52,\"gp\":4,\"g\":1,\"a\":0,\"pts\":1,\"pm\":0,\"toi\":1249.25,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8477951,\"name\":\"Nick Schmaltz\",\"pos\":\"C\",\"no\":8,\"gp\":4,\"g\":5,\"a\":2,\"pts\":7,\"pm\":-1,\"toi\":1094,\"sog\":17,\"ppg\":3,\"shg\":0},{\"id\":8478474,\"name\":\"Lawson Crouse\",\"pos\":\"L\",\"no\":67,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":2,\"toi\":895.75,\"sog\":9,\"ppg\":0,\"shg\":0},{\"id\":8478507,\"name\":\"John Marino\",\"pos\":\"D\",\"no\":6,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":0,\"toi\":1232.25,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8478831,\"name\":\"Kevin Stenlund\",\"pos\":\"C\",\"no\":82,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":839.75,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8479343,\"name\":\"Clayton Keller\",\"pos\":\"R\",\"no\":9,\"gp\":4,\"g\":1,\"a\":6,\"pts\":7,\"pm\":-1,\"toi\":1067,\"sog\":11,\"ppg\":1,\"shg\":0},{\"id\":8479369,\"name\":\"Andrew Peeke\",\"pos\":\"D\",\"no\":20,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":2,\"toi\":948,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8479410,\"name\":\"Mikhail Sergachev\",\"pos\":\"D\",\"no\":98,\"gp\":4,\"g\":1,\"a\":5,\"pts\":6,\"pm\":0,\"toi\":1258.25,\"sog\":12,\"ppg\":1,\"shg\":0},{\"id\":8479619,\"name\":\"Michael Carcone\",\"pos\":\"L\",\"no\":53,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":1,\"toi\":739,\"sog\":10,\"ppg\":0,\"shg\":0},{\"id\":8480849,\"name\":\"Barrett Hayton\",\"pos\":\"C\",\"no\":27,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":802.75,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8480855,\"name\":\"Jack McBain\",\"pos\":\"C\",\"no\":22,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":786.5,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8482699,\"name\":\"Dylan Guenther\",\"pos\":\"R\",\"no\":11,\"gp\":4,\"g\":3,\"a\":3,\"pts\":6,\"pm\":0,\"toi\":970,\"sog\":17,\"ppg\":3,\"shg\":0},{\"id\":8483431,\"name\":\"Logan Cooley\",\"pos\":\"C\",\"no\":92,\"gp\":4,\"g\":0,\"a\":4,\"pts\":4,\"pm\":0,\"toi\":1053.75,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8484386,\"name\":\"Dmitri Simashev\",\"pos\":\"D\",\"no\":26,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":3,\"toi\":965.25,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8484388,\"name\":\"Daniil But\",\"pos\":\"L\",\"no\":50,\"gp\":4,\"g\":1,\"a\":0,\"pts\":1,\"pm\":1,\"toi\":670.25,\"sog\":1,\"ppg\":0,\"shg\":0}],\"VGK\":[{\"id\":8475188,\"name\":\"Brayden McNabb\",\"pos\":\"D\",\"no\":3,\"gp\":4,\"g\":0,\"a\":4,\"pts\":4,\"pm\":7,\"toi\":1129.75,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8475343,\"name\":\"Nic Dowd\",\"pos\":\"C\",\"no\":26,\"gp\":4,\"g\":0,\"a\":2,\"pts\":2,\"pm\":-1,\"toi\":690.5,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8475913,\"name\":\"Mark Stone\",\"pos\":\"R\",\"no\":61,\"gp\":4,\"g\":2,\"a\":2,\"pts\":4,\"pm\":5,\"toi\":1101.5,\"sog\":8,\"ppg\":0,\"shg\":1},{\"id\":8476448,\"name\":\"William Karlsson\",\"pos\":\"C\",\"no\":71,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":1120.75,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8476881,\"name\":\"Tomas Hertl\",\"pos\":\"C\",\"no\":48,\"gp\":4,\"g\":3,\"a\":2,\"pts\":5,\"pm\":3,\"toi\":985.25,\"sog\":14,\"ppg\":3,\"shg\":0},{\"id\":8477447,\"name\":\"Shea Theodore\",\"pos\":\"D\",\"no\":27,\"gp\":4,\"g\":1,\"a\":2,\"pts\":3,\"pm\":7,\"toi\":1309.5,\"sog\":11,\"ppg\":0,\"shg\":0},{\"id\":8477964,\"name\":\"Ivan Barbashev\",\"pos\":\"L\",\"no\":49,\"gp\":4,\"g\":0,\"a\":3,\"pts\":3,\"pm\":3,\"toi\":871.25,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8478109,\"name\":\"Victor Olofsson\",\"pos\":\"L\",\"no\":95,\"gp\":4,\"g\":4,\"a\":1,\"pts\":5,\"pm\":1,\"toi\":788.25,\"sog\":9,\"ppg\":2,\"shg\":0},{\"id\":8478396,\"name\":\"Noah Hanifin\",\"pos\":\"D\",\"no\":15,\"gp\":4,\"g\":1,\"a\":0,\"pts\":1,\"pm\":1,\"toi\":1186.5,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8478397,\"name\":\"Rasmus Andersson\",\"pos\":\"D\",\"no\":4,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-4,\"toi\":1089,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8478403,\"name\":\"Jack Eichel\",\"pos\":\"C\",\"no\":9,\"gp\":4,\"g\":2,\"a\":8,\"pts\":10,\"pm\":3,\"toi\":1174.75,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8478450,\"name\":\"Parker Wotherspoon\",\"pos\":\"D\",\"no\":29,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-4,\"toi\":1102.25,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8478468,\"name\":\"Jeremy Lauzon\",\"pos\":\"D\",\"no\":5,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":982.5,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8478483,\"name\":\"Mitch Marner\",\"pos\":\"R\",\"no\":93,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":0,\"toi\":1232.75,\"sog\":10,\"ppg\":0,\"shg\":0},{\"id\":8479353,\"name\":\"Brett Howden\",\"pos\":\"C\",\"no\":21,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":2,\"toi\":980.25,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8483553,\"name\":\"Marc Gatcomb\",\"pos\":\"C\",\"no\":17,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":-1,\"toi\":545,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8483890,\"name\":\"Braeden Bowman\",\"pos\":\"R\",\"no\":42,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":-3,\"toi\":731.75,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8484803,\"name\":\"Trevor Connelly\",\"pos\":\"L\",\"no\":24,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":0,\"toi\":689,\"sog\":6,\"ppg\":0,\"shg\":0}],\"FLA\":[{\"id\":8473419,\"name\":\"Brad Marchand\",\"pos\":\"L\",\"no\":63,\"gp\":2,\"g\":1,\"a\":0,\"pts\":1,\"pm\":0,\"toi\":683,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8474189,\"name\":\"Lars Eller\",\"pos\":\"C\",\"no\":20,\"gp\":4,\"g\":0,\"a\":3,\"pts\":3,\"pm\":2,\"toi\":764.75,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8475179,\"name\":\"Dmitry Kulikov\",\"pos\":\"D\",\"no\":7,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":2,\"toi\":981.5,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8475462,\"name\":\"Radko Gudas\",\"pos\":\"D\",\"no\":6,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":2,\"toi\":782.75,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8477409,\"name\":\"Carter Verhaeghe\",\"pos\":\"C\",\"no\":23,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":5,\"toi\":1105,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8477493,\"name\":\"Aleksander Barkov\",\"pos\":\"C\",\"no\":16,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":893.5,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8477495,\"name\":\"Seth Jones\",\"pos\":\"D\",\"no\":3,\"gp\":4,\"g\":1,\"a\":0,\"pts\":1,\"pm\":-1,\"toi\":1662.5,\"sog\":9,\"ppg\":0,\"shg\":0},{\"id\":8477903,\"name\":\"Garnet Hathaway\",\"pos\":\"R\",\"no\":21,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":495.5,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8477932,\"name\":\"Aaron Ekblad\",\"pos\":\"D\",\"no\":5,\"gp\":2,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-1,\"toi\":1255,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8477933,\"name\":\"Sam Reinhart\",\"pos\":\"C\",\"no\":13,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":1317.5,\"sog\":10,\"ppg\":0,\"shg\":0},{\"id\":8477935,\"name\":\"Sam Bennett\",\"pos\":\"C\",\"no\":9,\"gp\":4,\"g\":0,\"a\":3,\"pts\":3,\"pm\":2,\"toi\":1219.5,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8478055,\"name\":\"Gustav Forsling\",\"pos\":\"D\",\"no\":42,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":3,\"toi\":1289,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8478147,\"name\":\"Bokondji Imama\",\"pos\":\"L\",\"no\":14,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":380.5,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8478859,\"name\":\"Niko Mikkola\",\"pos\":\"D\",\"no\":77,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":1240.25,\"sog\":9,\"ppg\":0,\"shg\":0},{\"id\":8479314,\"name\":\"Matthew Tkachuk\",\"pos\":\"L\",\"no\":19,\"gp\":4,\"g\":2,\"a\":1,\"pts\":3,\"pm\":2,\"toi\":1300.25,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8480185,\"name\":\"Eetu Luostarinen\",\"pos\":\"C\",\"no\":27,\"gp\":4,\"g\":2,\"a\":0,\"pts\":2,\"pm\":1,\"toi\":935.25,\"sog\":6,\"ppg\":1,\"shg\":0},{\"id\":8480801,\"name\":\"Brady Tkachuk\",\"pos\":\"L\",\"no\":8,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":1041,\"sog\":11,\"ppg\":0,\"shg\":0},{\"id\":8482113,\"name\":\"Anton Lundell\",\"pos\":\"C\",\"no\":15,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":0,\"toi\":1139.5,\"sog\":10,\"ppg\":0,\"shg\":0},{\"id\":8483771,\"name\":\"Sandis Vilmanis\",\"pos\":\"L\",\"no\":95,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":737.25,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8484304,\"name\":\"Uvis Balinskis\",\"pos\":\"D\",\"no\":26,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":2,\"toi\":835,\"sog\":2,\"ppg\":0,\"shg\":0}],\"MIN\":[{\"id\":8473422,\"name\":\"Nick Foligno\",\"pos\":\"L\",\"no\":71,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":2,\"toi\":597,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8474567,\"name\":\"Zach Bogosian\",\"pos\":\"D\",\"no\":24,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":892.6667,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8474716,\"name\":\"Jared Spurgeon\",\"pos\":\"D\",\"no\":46,\"gp\":3,\"g\":1,\"a\":2,\"pts\":3,\"pm\":1,\"toi\":1221.3333,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8475220,\"name\":\"Marcus Foligno\",\"pos\":\"L\",\"no\":17,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":3,\"toi\":755,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8476399,\"name\":\"Blake Coleman\",\"pos\":\"L\",\"no\":20,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":-2,\"toi\":900.6667,\"sog\":5,\"ppg\":1,\"shg\":0},{\"id\":8476463,\"name\":\"Jonas Brodin\",\"pos\":\"D\",\"no\":25,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":1228.3333,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8476874,\"name\":\"Olli Maatta\",\"pos\":\"D\",\"no\":3,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-1,\"toi\":1281.6667,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8477446,\"name\":\"Michael McCarron\",\"pos\":\"C\",\"no\":47,\"gp\":3,\"g\":0,\"a\":3,\"pts\":3,\"pm\":3,\"toi\":912.6667,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8477451,\"name\":\"Ryan Hartman\",\"pos\":\"R\",\"no\":38,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-3,\"toi\":761.3333,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8478493,\"name\":\"Joel Eriksson Ek\",\"pos\":\"C\",\"no\":14,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":1171,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8478508,\"name\":\"Yakov Trenin\",\"pos\":\"C\",\"no\":13,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":817,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8478864,\"name\":\"Kirill Kaprizov\",\"pos\":\"L\",\"no\":97,\"gp\":3,\"g\":3,\"a\":0,\"pts\":3,\"pm\":1,\"toi\":1293.3333,\"sog\":9,\"ppg\":1,\"shg\":0},{\"id\":8480800,\"name\":\"Quinn Hughes\",\"pos\":\"D\",\"no\":43,\"gp\":3,\"g\":1,\"a\":3,\"pts\":4,\"pm\":2,\"toi\":1587.6667,\"sog\":10,\"ppg\":1,\"shg\":0},{\"id\":8481553,\"name\":\"Bobby Brink\",\"pos\":\"R\",\"no\":10,\"gp\":3,\"g\":0,\"a\":2,\"pts\":2,\"pm\":-2,\"toi\":729.3333,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8481557,\"name\":\"Matt Boldy\",\"pos\":\"L\",\"no\":12,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":1259,\"sog\":16,\"ppg\":0,\"shg\":0},{\"id\":8482094,\"name\":\"Daemon Hunt\",\"pos\":\"D\",\"no\":48,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":767.6667,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8483525,\"name\":\"Danila Yurov\",\"pos\":\"R\",\"no\":22,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":0,\"toi\":790.3333,\"sog\":4,\"ppg\":1,\"shg\":0},{\"id\":8485702,\"name\":\"Maxim Shabanov\",\"pos\":\"R\",\"no\":49,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":1,\"toi\":951.3333,\"sog\":2,\"ppg\":0,\"shg\":0}],\"CAR\":[{\"id\":8473533,\"name\":\"Jordan Staal\",\"pos\":\"C\",\"no\":11,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":983.75,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8475235,\"name\":\"Nicolas Deslauriers\",\"pos\":\"L\",\"no\":44,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":433,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8475791,\"name\":\"Taylor Hall\",\"pos\":\"L\",\"no\":71,\"gp\":4,\"g\":2,\"a\":0,\"pts\":2,\"pm\":-1,\"toi\":849.5,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8476422,\"name\":\"Mike Reilly\",\"pos\":\"D\",\"no\":6,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":629,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8476873,\"name\":\"Mark Jankowski\",\"pos\":\"L\",\"no\":77,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":0,\"toi\":756.5,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8476906,\"name\":\"Shayne Gostisbehere\",\"pos\":\"D\",\"no\":4,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":-2,\"toi\":1126.75,\"sog\":6,\"ppg\":1,\"shg\":0},{\"id\":8476921,\"name\":\"Jordan Martinook\",\"pos\":\"L\",\"no\":48,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":882,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8476958,\"name\":\"Jaccob Slavin\",\"pos\":\"D\",\"no\":74,\"gp\":4,\"g\":0,\"a\":2,\"pts\":2,\"pm\":3,\"toi\":1307,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8477478,\"name\":\"William Carrier\",\"pos\":\"L\",\"no\":28,\"gp\":4,\"g\":0,\"a\":2,\"pts\":2,\"pm\":-1,\"toi\":648.75,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8477940,\"name\":\"Nikolaj Ehlers\",\"pos\":\"L\",\"no\":27,\"gp\":4,\"g\":0,\"a\":2,\"pts\":2,\"pm\":-2,\"toi\":1019.25,\"sog\":9,\"ppg\":0,\"shg\":0},{\"id\":8478427,\"name\":\"Sebastian Aho\",\"pos\":\"C\",\"no\":20,\"gp\":4,\"g\":4,\"a\":3,\"pts\":7,\"pm\":0,\"toi\":1200.25,\"sog\":15,\"ppg\":3,\"shg\":0},{\"id\":8478970,\"name\":\"Jalen Chatfield\",\"pos\":\"D\",\"no\":5,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":1224.25,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8480336,\"name\":\"Sean Walker\",\"pos\":\"D\",\"no\":26,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-4,\"toi\":1241.25,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8480762,\"name\":\"Eric Robinson\",\"pos\":\"L\",\"no\":50,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":0,\"toi\":667.75,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8480817,\"name\":\"K'Andre Miller\",\"pos\":\"D\",\"no\":19,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-3,\"toi\":1392.75,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8480829,\"name\":\"Jesperi Kotkaniemi\",\"pos\":\"C\",\"no\":82,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":546,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8480830,\"name\":\"Andrei Svechnikov\",\"pos\":\"R\",\"no\":37,\"gp\":4,\"g\":1,\"a\":3,\"pts\":4,\"pm\":0,\"toi\":1067.75,\"sog\":15,\"ppg\":0,\"shg\":0},{\"id\":8482702,\"name\":\"Logan Stankoven\",\"pos\":\"C\",\"no\":22,\"gp\":4,\"g\":1,\"a\":0,\"pts\":1,\"pm\":0,\"toi\":1125.25,\"sog\":9,\"ppg\":0,\"shg\":0},{\"id\":8482809,\"name\":\"Jackson Blake\",\"pos\":\"R\",\"no\":53,\"gp\":4,\"g\":0,\"a\":3,\"pts\":3,\"pm\":-1,\"toi\":1133.25,\"sog\":9,\"ppg\":0,\"shg\":0},{\"id\":8484428,\"name\":\"Charles Alexis Legault\",\"pos\":\"D\",\"no\":null,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":713.5,\"sog\":2,\"ppg\":0,\"shg\":0}],\"COL\":[{\"id\":8470613,\"name\":\"Brent Burns\",\"pos\":\"D\",\"no\":84,\"gp\":3,\"g\":0,\"a\":2,\"pts\":2,\"pm\":-2,\"toi\":920.3333,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8475172,\"name\":\"Nazem Kadri\",\"pos\":\"C\",\"no\":91,\"gp\":3,\"g\":0,\"a\":2,\"pts\":2,\"pm\":2,\"toi\":1090,\"sog\":10,\"ppg\":0,\"shg\":0},{\"id\":8475754,\"name\":\"Brock Nelson\",\"pos\":\"C\",\"no\":11,\"gp\":3,\"g\":1,\"a\":2,\"pts\":3,\"pm\":-1,\"toi\":1045,\"sog\":2,\"ppg\":1,\"shg\":0},{\"id\":8475768,\"name\":\"Jaden Schwartz\",\"pos\":\"L\",\"no\":71,\"gp\":3,\"g\":1,\"a\":3,\"pts\":4,\"pm\":0,\"toi\":806.6667,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8476312,\"name\":\"Josh Manson\",\"pos\":\"D\",\"no\":42,\"gp\":3,\"g\":1,\"a\":2,\"pts\":3,\"pm\":4,\"toi\":961,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8476455,\"name\":\"Gabriel Landeskog\",\"pos\":\"L\",\"no\":92,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":-2,\"toi\":954.3333,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8476967,\"name\":\"Brett Kulak\",\"pos\":\"D\",\"no\":27,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-1,\"toi\":1073.6667,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8477476,\"name\":\"Artturi Lehkonen\",\"pos\":\"L\",\"no\":62,\"gp\":3,\"g\":3,\"a\":1,\"pts\":4,\"pm\":2,\"toi\":1124.6667,\"sog\":5,\"ppg\":2,\"shg\":0},{\"id\":8477492,\"name\":\"Nathan MacKinnon\",\"pos\":\"C\",\"no\":29,\"gp\":3,\"g\":2,\"a\":3,\"pts\":5,\"pm\":-1,\"toi\":1123.6667,\"sog\":13,\"ppg\":1,\"shg\":0},{\"id\":8478038,\"name\":\"Devon Toews\",\"pos\":\"D\",\"no\":7,\"gp\":3,\"g\":0,\"a\":2,\"pts\":2,\"pm\":3,\"toi\":1209,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8478454,\"name\":\"Noah Juulsen\",\"pos\":\"D\",\"no\":47,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":665,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8478462,\"name\":\"Nicolas Roy\",\"pos\":\"C\",\"no\":10,\"gp\":3,\"g\":2,\"a\":1,\"pts\":3,\"pm\":2,\"toi\":745,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8480039,\"name\":\"Martin Necas\",\"pos\":\"C\",\"no\":88,\"gp\":3,\"g\":2,\"a\":2,\"pts\":4,\"pm\":1,\"toi\":1181.6667,\"sog\":11,\"ppg\":0,\"shg\":0},{\"id\":8480069,\"name\":\"Cale Makar\",\"pos\":\"D\",\"no\":8,\"gp\":3,\"g\":1,\"a\":2,\"pts\":3,\"pm\":1,\"toi\":1271.3333,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8480448,\"name\":\"Parker Kelly\",\"pos\":\"C\",\"no\":17,\"gp\":3,\"g\":1,\"a\":3,\"pts\":4,\"pm\":4,\"toi\":826.6667,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8482742,\"name\":\"Zachary L'Heureux\",\"pos\":\"L\",\"no\":68,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":502,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8482768,\"name\":\"Fedor Svechkov\",\"pos\":\"C\",\"no\":9,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":3,\"toi\":869.3333,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8484258,\"name\":\"Sam Malinski\",\"pos\":\"D\",\"no\":70,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":5,\"toi\":973.6667,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8486171,\"name\":\"T.J. Hughes\",\"pos\":\"R\",\"no\":13,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":909,\"sog\":5,\"ppg\":0,\"shg\":0}],\"WSH\":[{\"id\":8471214,\"name\":\"Alex Ovechkin\",\"pos\":\"L\",\"no\":8,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":808.3333,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8475795,\"name\":\"Dylan McIlrath\",\"pos\":\"D\",\"no\":52,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":541,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8476432,\"name\":\"Boone Jenner\",\"pos\":\"C\",\"no\":22,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":0,\"toi\":982.3333,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8476880,\"name\":\"Tom Wilson\",\"pos\":\"R\",\"no\":43,\"gp\":3,\"g\":1,\"a\":3,\"pts\":4,\"pm\":3,\"toi\":1085,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8477949,\"name\":\"Alex Tuch\",\"pos\":\"R\",\"no\":89,\"gp\":3,\"g\":3,\"a\":0,\"pts\":3,\"pm\":4,\"toi\":1062,\"sog\":11,\"ppg\":0,\"shg\":0},{\"id\":8478440,\"name\":\"Dylan Strome\",\"pos\":\"C\",\"no\":17,\"gp\":3,\"g\":0,\"a\":3,\"pts\":3,\"pm\":0,\"toi\":894.6667,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8478463,\"name\":\"Anthony Beauvillier\",\"pos\":\"R\",\"no\":72,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":2,\"toi\":726,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8478911,\"name\":\"Matt Roy\",\"pos\":\"D\",\"no\":3,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":1105.5,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8479345,\"name\":\"Jakob Chychrun\",\"pos\":\"D\",\"no\":6,\"gp\":3,\"g\":1,\"a\":2,\"pts\":3,\"pm\":0,\"toi\":1428,\"sog\":6,\"ppg\":1,\"shg\":0},{\"id\":8479385,\"name\":\"Jordan Kyrou\",\"pos\":\"R\",\"no\":25,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-5,\"toi\":779.6667,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8479400,\"name\":\"Pierre-Luc Dubois\",\"pos\":\"C\",\"no\":80,\"gp\":3,\"g\":1,\"a\":3,\"pts\":4,\"pm\":3,\"toi\":967.6667,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8479576,\"name\":\"Vincent Desharnais\",\"pos\":\"D\",\"no\":73,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":4,\"toi\":1154.3333,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8480043,\"name\":\"Timothy Liljegren\",\"pos\":\"D\",\"no\":27,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":1060.6667,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8480796,\"name\":\"Martin Fehérváry\",\"pos\":\"D\",\"no\":42,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":1232,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8481656,\"name\":\"Aliaksei Protas\",\"pos\":\"L\",\"no\":21,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-3,\"toi\":980.3333,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8482088,\"name\":\"Justin Sourdif\",\"pos\":\"C\",\"no\":34,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":0,\"toi\":810.6667,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8484186,\"name\":\"Ryan Leonard\",\"pos\":\"R\",\"no\":9,\"gp\":3,\"g\":2,\"a\":0,\"pts\":2,\"pm\":1,\"toi\":803.6667,\"sog\":8,\"ppg\":1,\"shg\":0},{\"id\":8484873,\"name\":\"Cole Hutson\",\"pos\":\"D\",\"no\":44,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":1,\"toi\":1093.3333,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8484999,\"name\":\"Ilya Protas\",\"pos\":\"L\",\"no\":62,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-2,\"toi\":663.6667,\"sog\":1,\"ppg\":0,\"shg\":0}],\"OTT\":[{\"id\":8473512,\"name\":\"Claude Giroux\",\"pos\":\"R\",\"no\":28,\"gp\":3,\"g\":0,\"a\":2,\"pts\":2,\"pm\":1,\"toi\":956,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8476393,\"name\":\"Nick Cousins\",\"pos\":\"C\",\"no\":21,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-2,\"toi\":487,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8477998,\"name\":\"Warren Foegele\",\"pos\":\"L\",\"no\":37,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":2,\"toi\":681.6667,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8478020,\"name\":\"Michael Amadio\",\"pos\":\"R\",\"no\":22,\"gp\":3,\"g\":2,\"a\":1,\"pts\":3,\"pm\":3,\"toi\":1012,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8478173,\"name\":\"Hayden Hodgson\",\"pos\":\"R\",\"no\":42,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":322.5,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8478469,\"name\":\"Thomas Chabot\",\"pos\":\"D\",\"no\":72,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":3,\"toi\":1550.3333,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8480075,\"name\":\"Cameron Crotty\",\"pos\":\"D\",\"no\":5,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":653.5,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8480188,\"name\":\"Fabian Zetterlund\",\"pos\":\"L\",\"no\":20,\"gp\":3,\"g\":0,\"a\":2,\"pts\":2,\"pm\":2,\"toi\":876,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8480208,\"name\":\"Drake Batherson\",\"pos\":\"R\",\"no\":19,\"gp\":3,\"g\":2,\"a\":1,\"pts\":3,\"pm\":1,\"toi\":1006.6667,\"sog\":6,\"ppg\":1,\"shg\":0},{\"id\":8481528,\"name\":\"Dylan Cozens\",\"pos\":\"C\",\"no\":24,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":1128,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8481596,\"name\":\"Shane Pinto\",\"pos\":\"C\",\"no\":12,\"gp\":3,\"g\":0,\"a\":2,\"pts\":2,\"pm\":2,\"toi\":1100,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8481606,\"name\":\"Jordan Spence\",\"pos\":\"D\",\"no\":10,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":1396,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8482092,\"name\":\"Ridly Greig\",\"pos\":\"C\",\"no\":71,\"gp\":1,\"g\":0,\"a\":1,\"pts\":1,\"pm\":0,\"toi\":790,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8482095,\"name\":\"Tyler Kleven\",\"pos\":\"D\",\"no\":43,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":1280.6667,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8482105,\"name\":\"Jake Sanderson\",\"pos\":\"D\",\"no\":85,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":269,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8482116,\"name\":\"Tim Stützle\",\"pos\":\"C\",\"no\":18,\"gp\":3,\"g\":3,\"a\":3,\"pts\":6,\"pm\":4,\"toi\":1268,\"sog\":7,\"ppg\":0,\"shg\":1},{\"id\":8482667,\"name\":\"William Eklund\",\"pos\":\"L\",\"no\":27,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":1,\"toi\":1086,\"sog\":9,\"ppg\":0,\"shg\":0},{\"id\":8483676,\"name\":\"Stephen Halliday\",\"pos\":\"C\",\"no\":34,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":-1,\"toi\":607.6667,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8484321,\"name\":\"Nikolas Matinpalo\",\"pos\":\"D\",\"no\":33,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":2,\"toi\":1112.6667,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8484759,\"name\":\"Carter Yakemchuk\",\"pos\":\"D\",\"no\":26,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":0,\"toi\":998.3333,\"sog\":4,\"ppg\":0,\"shg\":0}],\"TBL\":[{\"id\":8474151,\"name\":\"Ryan McDonagh\",\"pos\":\"D\",\"no\":27,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":939.6667,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8474590,\"name\":\"John Carlson\",\"pos\":\"D\",\"no\":74,\"gp\":3,\"g\":0,\"a\":2,\"pts\":2,\"pm\":0,\"toi\":1242.3333,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8475167,\"name\":\"Victor Hedman\",\"pos\":\"D\",\"no\":77,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":946.6667,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8476453,\"name\":\"Nikita Kucherov\",\"pos\":\"R\",\"no\":86,\"gp\":3,\"g\":1,\"a\":3,\"pts\":4,\"pm\":2,\"toi\":1377.3333,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8476878,\"name\":\"Zemgus Girgensons\",\"pos\":\"C\",\"no\":28,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":0,\"toi\":729.6667,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8477404,\"name\":\"Jake Guentzel\",\"pos\":\"C\",\"no\":59,\"gp\":3,\"g\":1,\"a\":2,\"pts\":3,\"pm\":2,\"toi\":1273.3333,\"sog\":10,\"ppg\":0,\"shg\":0},{\"id\":8478010,\"name\":\"Brayden Point\",\"pos\":\"C\",\"no\":21,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":2,\"toi\":1226.3333,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8478416,\"name\":\"Erik Cernak\",\"pos\":\"D\",\"no\":81,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":3,\"toi\":1176.3333,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8478424,\"name\":\"Jansen Harkins\",\"pos\":\"C\",\"no\":null,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":655,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8478519,\"name\":\"Anthony Cirelli\",\"pos\":\"C\",\"no\":71,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":1083,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8479542,\"name\":\"Brandon Hagel\",\"pos\":\"L\",\"no\":38,\"gp\":3,\"g\":1,\"a\":2,\"pts\":3,\"pm\":2,\"toi\":1319.3333,\"sog\":17,\"ppg\":0,\"shg\":0},{\"id\":8479705,\"name\":\"Jeffrey Viel\",\"pos\":\"L\",\"no\":25,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-3,\"toi\":504,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8480426,\"name\":\"Charle-Edouard D'Astous\",\"pos\":\"D\",\"no\":51,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":-1,\"toi\":876.6667,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8480995,\"name\":\"Pontus Holmberg\",\"pos\":\"R\",\"no\":29,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":0,\"toi\":869.6667,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8481624,\"name\":\"Ilya Mikheyev\",\"pos\":\"R\",\"no\":95,\"gp\":3,\"g\":1,\"a\":2,\"pts\":3,\"pm\":0,\"toi\":832,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8481719,\"name\":\"Max Crozier\",\"pos\":\"D\",\"no\":24,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":924,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8482201,\"name\":\"Gage Goncalves\",\"pos\":\"C\",\"no\":93,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":882.6667,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8482655,\"name\":\"J.J. Moser\",\"pos\":\"D\",\"no\":90,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":2,\"toi\":1026.6667,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8482929,\"name\":\"Emil Lilleberg\",\"pos\":\"D\",\"no\":78,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":630,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8483447,\"name\":\"Conor Geekie\",\"pos\":\"C\",\"no\":94,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":0,\"toi\":669.6667,\"sog\":4,\"ppg\":0,\"shg\":0}],\"BUF\":[{\"id\":8475842,\"name\":\"Sam Carrick\",\"pos\":\"C\",\"no\":10,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":451.5,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8476891,\"name\":\"Matt Grzelcyk\",\"pos\":\"D\",\"no\":24,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":867,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8479359,\"name\":\"Beck Malenstyn\",\"pos\":\"L\",\"no\":29,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-3,\"toi\":503.3333,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8479420,\"name\":\"Tage Thompson\",\"pos\":\"C\",\"no\":72,\"gp\":3,\"g\":2,\"a\":2,\"pts\":4,\"pm\":3,\"toi\":1196.6667,\"sog\":17,\"ppg\":0,\"shg\":0},{\"id\":8479941,\"name\":\"Justin Danforth\",\"pos\":\"R\",\"no\":15,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":497,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8480064,\"name\":\"Josh Norris\",\"pos\":\"C\",\"no\":9,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":991.6667,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8480802,\"name\":\"Ryan McLeod\",\"pos\":\"C\",\"no\":71,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-3,\"toi\":859.3333,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8480807,\"name\":\"Mattias Samuelsson\",\"pos\":\"D\",\"no\":23,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":-2,\"toi\":1304.3333,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8480839,\"name\":\"Rasmus Dahlin\",\"pos\":\"D\",\"no\":26,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":1,\"toi\":1612,\"sog\":10,\"ppg\":0,\"shg\":0},{\"id\":8481522,\"name\":\"Peyton Krebs\",\"pos\":\"C\",\"no\":19,\"gp\":3,\"g\":0,\"a\":2,\"pts\":2,\"pm\":0,\"toi\":880.3333,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8481806,\"name\":\"Louis Crevier\",\"pos\":\"D\",\"no\":46,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":953.6667,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8482097,\"name\":\"Jack Quinn\",\"pos\":\"R\",\"no\":22,\"gp\":3,\"g\":2,\"a\":0,\"pts\":2,\"pm\":1,\"toi\":1232.6667,\"sog\":11,\"ppg\":0,\"shg\":0},{\"id\":8482659,\"name\":\"Josh Doan\",\"pos\":\"R\",\"no\":91,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":985.6667,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8482671,\"name\":\"Owen Power\",\"pos\":\"D\",\"no\":25,\"gp\":3,\"g\":1,\"a\":4,\"pts\":5,\"pm\":3,\"toi\":1593.6667,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8482803,\"name\":\"Olen Zellweger\",\"pos\":\"D\",\"no\":8,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":911.5,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8483468,\"name\":\"Jiri Kulich\",\"pos\":\"C\",\"no\":20,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":2,\"toi\":724,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8483500,\"name\":\"Noah Ostlund\",\"pos\":\"C\",\"no\":86,\"gp\":3,\"g\":1,\"a\":2,\"pts\":3,\"pm\":2,\"toi\":1094.6667,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8484145,\"name\":\"Zach Benson\",\"pos\":\"L\",\"no\":6,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":1176,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8484305,\"name\":\"Zach Metsa\",\"pos\":\"D\",\"no\":73,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":642,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8484797,\"name\":\"Konsta Helenius\",\"pos\":\"C\",\"no\":94,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":0,\"toi\":856.3333,\"sog\":5,\"ppg\":0,\"shg\":0}],\"ANA\":[{\"id\":8473986,\"name\":\"Alex Killorn\",\"pos\":\"L\",\"no\":17,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":1,\"toi\":825.3333,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8475798,\"name\":\"Mikael Granlund\",\"pos\":\"C\",\"no\":64,\"gp\":3,\"g\":1,\"a\":2,\"pts\":3,\"pm\":-1,\"toi\":1254.3333,\"sog\":4,\"ppg\":1,\"shg\":0},{\"id\":8478366,\"name\":\"Frank Vatrano\",\"pos\":\"R\",\"no\":77,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":634,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8478421,\"name\":\"A.J. Greer\",\"pos\":\"L\",\"no\":18,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-4,\"toi\":754.6667,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8480068,\"name\":\"Ryan Poehling\",\"pos\":\"C\",\"no\":25,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":841.6667,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8481538,\"name\":\"Judd Caulfield\",\"pos\":\"R\",\"no\":28,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":664,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8481605,\"name\":\"Jackson LaCombe\",\"pos\":\"D\",\"no\":2,\"gp\":3,\"g\":0,\"a\":3,\"pts\":3,\"pm\":-4,\"toi\":1752,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8481754,\"name\":\"Nikita Nesterenko\",\"pos\":\"C\",\"no\":13,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":667,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8482118,\"name\":\"Sam Colangelo\",\"pos\":\"R\",\"no\":12,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":624,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8482408,\"name\":\"Jeff Malott\",\"pos\":\"L\",\"no\":39,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":0,\"toi\":551.6667,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8482731,\"name\":\"Tyson Hinds\",\"pos\":\"D\",\"no\":55,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":717.3333,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8483445,\"name\":\"Cutter Gauthier\",\"pos\":\"L\",\"no\":61,\"gp\":3,\"g\":2,\"a\":2,\"pts\":4,\"pm\":-1,\"toi\":1257,\"sog\":16,\"ppg\":2,\"shg\":0},{\"id\":8483482,\"name\":\"Tristan Luneau\",\"pos\":\"D\",\"no\":67,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-2,\"toi\":1502.3333,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8483490,\"name\":\"Pavel Mintyukov\",\"pos\":\"D\",\"no\":98,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":1175,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8483521,\"name\":\"Noah Warren\",\"pos\":\"D\",\"no\":47,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":0,\"toi\":855.6667,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8484153,\"name\":\"Leo Carlsson\",\"pos\":\"C\",\"no\":91,\"gp\":3,\"g\":1,\"a\":6,\"pts\":7,\"pm\":-2,\"toi\":1235,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8484262,\"name\":\"Travis Mitchell\",\"pos\":\"D\",\"no\":34,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":959.3333,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8484762,\"name\":\"Beckett Sennecke\",\"pos\":\"R\",\"no\":45,\"gp\":3,\"g\":3,\"a\":1,\"pts\":4,\"pm\":1,\"toi\":1295.3333,\"sog\":11,\"ppg\":2,\"shg\":0},{\"id\":8485512,\"name\":\"Tim Washe\",\"pos\":\"C\",\"no\":42,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-1,\"toi\":995.3333,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8486052,\"name\":\"Nikita Klepov\",\"pos\":\"R\",\"no\":40,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":603,\"sog\":0,\"ppg\":0,\"shg\":0}],\"SJS\":[{\"id\":8475200,\"name\":\"Dmitry Orlov\",\"pos\":\"D\",\"no\":9,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-4,\"toi\":1108.6667,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8475726,\"name\":\"Tyler Toffoli\",\"pos\":\"C\",\"no\":73,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":1,\"toi\":760,\"sog\":7,\"ppg\":1,\"shg\":0},{\"id\":8476624,\"name\":\"Barclay Goodrow\",\"pos\":\"C\",\"no\":23,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":786,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8476885,\"name\":\"Jacob Trouba\",\"pos\":\"D\",\"no\":65,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-1,\"toi\":1244.6667,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8477498,\"name\":\"Darnell Nurse\",\"pos\":\"D\",\"no\":25,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":1224.6667,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8477505,\"name\":\"Alexander Wennberg\",\"pos\":\"C\",\"no\":21,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":1162,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8478975,\"name\":\"Mason Marchment\",\"pos\":\"L\",\"no\":27,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":-4,\"toi\":906.3333,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8480748,\"name\":\"Kiefer Sherwood\",\"pos\":\"L\",\"no\":44,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":1,\"toi\":817.3333,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8480848,\"name\":\"Ty Dellandrea\",\"pos\":\"C\",\"no\":10,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":860,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8480891,\"name\":\"Michael Kesselring\",\"pos\":\"D\",\"no\":7,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":1237,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8482700,\"name\":\"Nolan Allan\",\"pos\":\"D\",\"no\":5,\"gp\":2,\"g\":1,\"a\":0,\"pts\":1,\"pm\":1,\"toi\":1102,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8482859,\"name\":\"Zack Ostapchuk\",\"pos\":\"C\",\"no\":63,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":666,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8484152,\"name\":\"Luca Cagnoni\",\"pos\":\"D\",\"no\":42,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":0,\"toi\":1233,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8484227,\"name\":\"Will Smith\",\"pos\":\"C\",\"no\":2,\"gp\":3,\"g\":2,\"a\":1,\"pts\":3,\"pm\":-2,\"toi\":1146,\"sog\":5,\"ppg\":1,\"shg\":1},{\"id\":8484801,\"name\":\"Macklin Celebrini\",\"pos\":\"C\",\"no\":71,\"gp\":2,\"g\":0,\"a\":5,\"pts\":5,\"pm\":2,\"toi\":1339.5,\"sog\":9,\"ppg\":0,\"shg\":0},{\"id\":8484806,\"name\":\"Sam Dickinson\",\"pos\":\"D\",\"no\":6,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":988,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8484911,\"name\":\"Collin Graf\",\"pos\":\"R\",\"no\":51,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":924.3333,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8484994,\"name\":\"Igor Chernyshov\",\"pos\":\"L\",\"no\":92,\"gp\":3,\"g\":2,\"a\":1,\"pts\":3,\"pm\":1,\"toi\":873,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8485402,\"name\":\"Michael Misa\",\"pos\":\"C\",\"no\":77,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":0,\"toi\":823.3333,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8486103,\"name\":\"Ivar Stenberg\",\"pos\":\"L\",\"no\":41,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-2,\"toi\":859,\"sog\":1,\"ppg\":0,\"shg\":0}],\"SEA\":[{\"id\":8474586,\"name\":\"Jordan Eberle\",\"pos\":\"R\",\"no\":7,\"gp\":4,\"g\":2,\"a\":2,\"pts\":4,\"pm\":1,\"toi\":972.75,\"sog\":7,\"ppg\":1,\"shg\":0},{\"id\":8476457,\"name\":\"Adam Larsson\",\"pos\":\"D\",\"no\":6,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":2,\"toi\":1302.25,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8476905,\"name\":\"Chandler Stephenson\",\"pos\":\"C\",\"no\":9,\"gp\":4,\"g\":1,\"a\":3,\"pts\":4,\"pm\":1,\"toi\":1025.75,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8477919,\"name\":\"Frederick Gaudreau\",\"pos\":\"C\",\"no\":89,\"gp\":4,\"g\":1,\"a\":0,\"pts\":1,\"pm\":-1,\"toi\":875,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8477955,\"name\":\"Jared McCann\",\"pos\":\"L\",\"no\":19,\"gp\":4,\"g\":1,\"a\":4,\"pts\":5,\"pm\":1,\"toi\":948,\"sog\":15,\"ppg\":1,\"shg\":0},{\"id\":8477986,\"name\":\"Brandon Montour\",\"pos\":\"D\",\"no\":62,\"gp\":4,\"g\":0,\"a\":2,\"pts\":2,\"pm\":1,\"toi\":1362.25,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8478407,\"name\":\"Vince Dunn\",\"pos\":\"D\",\"no\":29,\"gp\":4,\"g\":1,\"a\":3,\"pts\":4,\"pm\":0,\"toi\":1305.5,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8479324,\"name\":\"Ryan Lindgren\",\"pos\":\"D\",\"no\":55,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":3,\"toi\":764.75,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8479372,\"name\":\"Josh Mahura\",\"pos\":\"D\",\"no\":28,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":868,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8479985,\"name\":\"Cale Fleury\",\"pos\":\"D\",\"no\":8,\"gp\":2,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-1,\"toi\":895,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8480876,\"name\":\"Curtis Douglas\",\"pos\":\"C\",\"no\":42,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":412,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8481554,\"name\":\"Kaapo Kakko\",\"pos\":\"R\",\"no\":84,\"gp\":4,\"g\":1,\"a\":3,\"pts\":4,\"pm\":3,\"toi\":873,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8482259,\"name\":\"Bobby McMann\",\"pos\":\"C\",\"no\":74,\"gp\":4,\"g\":2,\"a\":0,\"pts\":2,\"pm\":1,\"toi\":995.25,\"sog\":15,\"ppg\":1,\"shg\":0},{\"id\":8482665,\"name\":\"Matty Beniers\",\"pos\":\"C\",\"no\":10,\"gp\":4,\"g\":1,\"a\":2,\"pts\":3,\"pm\":2,\"toi\":980.75,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8482713,\"name\":\"Mackie Samoskevich\",\"pos\":\"R\",\"no\":11,\"gp\":3,\"g\":2,\"a\":0,\"pts\":2,\"pm\":1,\"toi\":891.3333,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8482751,\"name\":\"Ryan Winterton\",\"pos\":\"C\",\"no\":26,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":0,\"toi\":838.75,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8482858,\"name\":\"Ryker Evans\",\"pos\":\"D\",\"no\":41,\"gp\":4,\"g\":0,\"a\":2,\"pts\":2,\"pm\":1,\"toi\":1297,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8482866,\"name\":\"Ville Ottavainen\",\"pos\":\"D\",\"no\":46,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":2,\"toi\":951,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8482874,\"name\":\"Jacob Melanson\",\"pos\":\"R\",\"no\":63,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":571,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8483524,\"name\":\"Shane Wright\",\"pos\":\"C\",\"no\":51,\"gp\":4,\"g\":2,\"a\":1,\"pts\":3,\"pm\":1,\"toi\":901.25,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8483570,\"name\":\"Ben Meyers\",\"pos\":\"C\",\"no\":59,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":653.5,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8484800,\"name\":\"Berkly Catton\",\"pos\":\"C\",\"no\":27,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":1,\"toi\":944,\"sog\":7,\"ppg\":0,\"shg\":0}],\"PIT\":[{\"id\":8471215,\"name\":\"Evgeni Malkin\",\"pos\":\"C\",\"no\":71,\"gp\":4,\"g\":2,\"a\":2,\"pts\":4,\"pm\":1,\"toi\":1059.25,\"sog\":8,\"ppg\":2,\"shg\":0},{\"id\":8471675,\"name\":\"Sidney Crosby\",\"pos\":\"C\",\"no\":87,\"gp\":4,\"g\":0,\"a\":2,\"pts\":2,\"pm\":-3,\"toi\":1141.5,\"sog\":12,\"ppg\":0,\"shg\":0},{\"id\":8471724,\"name\":\"Kris Letang\",\"pos\":\"D\",\"no\":58,\"gp\":4,\"g\":0,\"a\":3,\"pts\":3,\"pm\":1,\"toi\":1183.25,\"sog\":12,\"ppg\":0,\"shg\":0},{\"id\":8474578,\"name\":\"Erik Karlsson\",\"pos\":\"D\",\"no\":65,\"gp\":4,\"g\":0,\"a\":4,\"pts\":4,\"pm\":2,\"toi\":1325.25,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8475810,\"name\":\"Bryan Rust\",\"pos\":\"R\",\"no\":17,\"gp\":1,\"g\":1,\"a\":0,\"pts\":1,\"pm\":0,\"toi\":1149,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8476483,\"name\":\"Rickard Rakell\",\"pos\":\"R\",\"no\":67,\"gp\":4,\"g\":0,\"a\":2,\"pts\":2,\"pm\":-2,\"toi\":1154.25,\"sog\":9,\"ppg\":0,\"shg\":0},{\"id\":8477845,\"name\":\"Trevor van Riemsdyk\",\"pos\":\"D\",\"no\":57,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":1123.5,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8478438,\"name\":\"Tommy Novak\",\"pos\":\"C\",\"no\":18,\"gp\":4,\"g\":3,\"a\":2,\"pts\":5,\"pm\":2,\"toi\":918.75,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8479398,\"name\":\"Samuel Girard\",\"pos\":\"D\",\"no\":49,\"gp\":4,\"g\":1,\"a\":3,\"pts\":4,\"pm\":-1,\"toi\":1176.25,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8480842,\"name\":\"Filip Hallander\",\"pos\":\"C\",\"no\":null,\"gp\":2,\"g\":1,\"a\":2,\"pts\":3,\"pm\":4,\"toi\":617,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8480980,\"name\":\"Connor Dewar\",\"pos\":\"C\",\"no\":19,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":820.5,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8481481,\"name\":\"Blake Lizotte\",\"pos\":\"C\",\"no\":46,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":0,\"toi\":766.75,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8481527,\"name\":\"Kaedan Korczak\",\"pos\":\"D\",\"no\":6,\"gp\":4,\"g\":0,\"a\":4,\"pts\":4,\"pm\":1,\"toi\":1003.75,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8481582,\"name\":\"Nick Robertson\",\"pos\":\"L\",\"no\":14,\"gp\":4,\"g\":3,\"a\":0,\"pts\":3,\"pm\":3,\"toi\":785.75,\"sog\":7,\"ppg\":0,\"shg\":1},{\"id\":8481725,\"name\":\"Elmer Soderblom\",\"pos\":\"L\",\"no\":25,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":759,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8482148,\"name\":\"Hendrix Lapierre\",\"pos\":\"C\",\"no\":22,\"gp\":4,\"g\":1,\"a\":2,\"pts\":3,\"pm\":-2,\"toi\":726,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8482475,\"name\":\"Egor Chinakhov\",\"pos\":\"R\",\"no\":59,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":0,\"toi\":966.5,\"sog\":7,\"ppg\":1,\"shg\":0},{\"id\":8482758,\"name\":\"Ville Koivunen\",\"pos\":\"R\",\"no\":41,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":5,\"toi\":829.3333,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8483398,\"name\":\"Declan Carlile\",\"pos\":\"D\",\"no\":72,\"gp\":4,\"g\":2,\"a\":2,\"pts\":4,\"pm\":1,\"toi\":1102.25,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8483808,\"name\":\"Andrei Kuzmenko\",\"pos\":\"L\",\"no\":62,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":720,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8485414,\"name\":\"Ben Kindel\",\"pos\":\"C\",\"no\":81,\"gp\":3,\"g\":2,\"a\":2,\"pts\":4,\"pm\":-1,\"toi\":1050.3333,\"sog\":9,\"ppg\":1,\"shg\":0}],\"VAN\":[{\"id\":8474568,\"name\":\"Luke Schenn\",\"pos\":\"D\",\"no\":2,\"gp\":4,\"g\":0,\"a\":2,\"pts\":2,\"pm\":4,\"toi\":744.5,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8475848,\"name\":\"Brendan Gallagher\",\"pos\":\"R\",\"no\":7,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":596,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8476467,\"name\":\"Jamie Oleksiak\",\"pos\":\"D\",\"no\":4,\"gp\":4,\"g\":1,\"a\":2,\"pts\":3,\"pm\":-1,\"toi\":1209.5,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8478444,\"name\":\"Brock Boeser\",\"pos\":\"R\",\"no\":6,\"gp\":4,\"g\":1,\"a\":2,\"pts\":3,\"pm\":-1,\"toi\":1041,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8478498,\"name\":\"Jake DeBrusk\",\"pos\":\"L\",\"no\":74,\"gp\":2,\"g\":0,\"a\":1,\"pts\":1,\"pm\":0,\"toi\":936,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8479425,\"name\":\"Filip Hronek\",\"pos\":\"D\",\"no\":17,\"gp\":4,\"g\":0,\"a\":5,\"pts\":5,\"pm\":3,\"toi\":1551.75,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8480012,\"name\":\"Elias Pettersson\",\"pos\":\"C\",\"no\":40,\"gp\":4,\"g\":2,\"a\":4,\"pts\":6,\"pm\":2,\"toi\":1198,\"sog\":7,\"ppg\":2,\"shg\":0},{\"id\":8481024,\"name\":\"Linus Karlsson\",\"pos\":\"C\",\"no\":94,\"gp\":4,\"g\":0,\"a\":4,\"pts\":4,\"pm\":0,\"toi\":886,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8481032,\"name\":\"Paul Cotter\",\"pos\":\"L\",\"no\":47,\"gp\":4,\"g\":4,\"a\":2,\"pts\":6,\"pm\":4,\"toi\":913.5,\"sog\":7,\"ppg\":1,\"shg\":1},{\"id\":8482055,\"name\":\"Drew O'Connor\",\"pos\":\"L\",\"no\":18,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":-2,\"toi\":980.75,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8482079,\"name\":\"Marco Rossi\",\"pos\":\"C\",\"no\":23,\"gp\":4,\"g\":3,\"a\":1,\"pts\":4,\"pm\":-1,\"toi\":1034,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8482691,\"name\":\"Aatu Räty\",\"pos\":\"C\",\"no\":54,\"gp\":2,\"g\":1,\"a\":0,\"pts\":1,\"pm\":1,\"toi\":583,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8483395,\"name\":\"Arshdeep Bains\",\"pos\":\"L\",\"no\":13,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":1,\"toi\":712.25,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8483476,\"name\":\"Jonathan Lekkerimäki\",\"pos\":\"R\",\"no\":88,\"gp\":4,\"g\":2,\"a\":1,\"pts\":3,\"pm\":2,\"toi\":696.5,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8483499,\"name\":\"Liam Ohgren\",\"pos\":\"L\",\"no\":92,\"gp\":4,\"g\":1,\"a\":3,\"pts\":4,\"pm\":1,\"toi\":1024.25,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8483678,\"name\":\"Elias Pettersson\",\"pos\":\"D\",\"no\":25,\"gp\":4,\"g\":1,\"a\":0,\"pts\":1,\"pm\":3,\"toi\":962.25,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8484136,\"name\":\"Max Sasson\",\"pos\":\"C\",\"no\":63,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":-1,\"toi\":882.75,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8484240,\"name\":\"Tom Willander\",\"pos\":\"D\",\"no\":5,\"gp\":4,\"g\":0,\"a\":3,\"pts\":3,\"pm\":-1,\"toi\":1247.25,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8484798,\"name\":\"Zeev Buium\",\"pos\":\"D\",\"no\":8,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":1300,\"sog\":5,\"ppg\":0,\"shg\":0}],\"TOR\":[{\"id\":8475166,\"name\":\"John Tavares\",\"pos\":\"C\",\"no\":91,\"gp\":4,\"g\":1,\"a\":2,\"pts\":3,\"pm\":-2,\"toi\":1055.75,\"sog\":14,\"ppg\":0,\"shg\":0},{\"id\":8475171,\"name\":\"Oliver Ekman-Larsson\",\"pos\":\"D\",\"no\":95,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":1023,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8475690,\"name\":\"Chris Tanev\",\"pos\":\"D\",\"no\":8,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":1131,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8476853,\"name\":\"Morgan Rielly\",\"pos\":\"D\",\"no\":44,\"gp\":4,\"g\":0,\"a\":3,\"pts\":3,\"pm\":-2,\"toi\":1205.25,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8476925,\"name\":\"Colton Sissons\",\"pos\":\"C\",\"no\":15,\"gp\":4,\"g\":1,\"a\":0,\"pts\":1,\"pm\":-1,\"toi\":815.75,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8476927,\"name\":\"Teddy Blueger\",\"pos\":\"C\",\"no\":73,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":638.75,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8476931,\"name\":\"Jake McCabe\",\"pos\":\"D\",\"no\":22,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":1045.25,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8477426,\"name\":\"Nick Paul\",\"pos\":\"L\",\"no\":20,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-4,\"toi\":926.25,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8477939,\"name\":\"William Nylander\",\"pos\":\"R\",\"no\":88,\"gp\":4,\"g\":3,\"a\":3,\"pts\":6,\"pm\":0,\"toi\":1209.25,\"sog\":9,\"ppg\":1,\"shg\":0},{\"id\":8478178,\"name\":\"Darren Raddysh\",\"pos\":\"D\",\"no\":43,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-3,\"toi\":1395,\"sog\":11,\"ppg\":0,\"shg\":0},{\"id\":8478458,\"name\":\"Jack Roslovic\",\"pos\":\"C\",\"no\":96,\"gp\":4,\"g\":1,\"a\":2,\"pts\":3,\"pm\":2,\"toi\":985.5,\"sog\":10,\"ppg\":0,\"shg\":0},{\"id\":8479318,\"name\":\"Auston Matthews\",\"pos\":\"C\",\"no\":34,\"gp\":4,\"g\":2,\"a\":3,\"pts\":5,\"pm\":1,\"toi\":1344.25,\"sog\":14,\"ppg\":0,\"shg\":0},{\"id\":8479442,\"name\":\"Troy Stecher\",\"pos\":\"D\",\"no\":28,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":1060,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8479520,\"name\":\"Brandon Duhaime\",\"pos\":\"L\",\"no\":24,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":674,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8479772,\"name\":\"Zack MacEwen\",\"pos\":\"R\",\"no\":19,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":325,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8480870,\"name\":\"Bo Groulx\",\"pos\":\"C\",\"no\":29,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":494,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8480893,\"name\":\"Kirill Marchenko\",\"pos\":\"R\",\"no\":null,\"gp\":4,\"g\":1,\"a\":2,\"pts\":3,\"pm\":-2,\"toi\":1191.25,\"sog\":12,\"ppg\":1,\"shg\":0},{\"id\":8484158,\"name\":\"Easton Cowan\",\"pos\":\"R\",\"no\":53,\"gp\":4,\"g\":1,\"a\":2,\"pts\":3,\"pm\":1,\"toi\":862.25,\"sog\":7,\"ppg\":1,\"shg\":0},{\"id\":8486067,\"name\":\"Gavin McKenna\",\"pos\":\"L\",\"no\":92,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":-2,\"toi\":875.5,\"sog\":7,\"ppg\":0,\"shg\":0}],\"BOS\":[{\"id\":8476374,\"name\":\"Sean Kuraly\",\"pos\":\"C\",\"no\":52,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":733,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8476854,\"name\":\"Hampus Lindholm\",\"pos\":\"D\",\"no\":27,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":1,\"toi\":1210.75,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8477365,\"name\":\"Connor Clifton\",\"pos\":\"D\",\"no\":75,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-1,\"toi\":1190.25,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8477496,\"name\":\"Elias Lindholm\",\"pos\":\"C\",\"no\":28,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":-1,\"toi\":965,\"sog\":9,\"ppg\":0,\"shg\":0},{\"id\":8477507,\"name\":\"Nikita Zadorov\",\"pos\":\"D\",\"no\":91,\"gp\":4,\"g\":0,\"a\":2,\"pts\":2,\"pm\":-1,\"toi\":1173,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8477956,\"name\":\"David Pastrnak\",\"pos\":\"R\",\"no\":88,\"gp\":4,\"g\":0,\"a\":2,\"pts\":2,\"pm\":-1,\"toi\":1224.5,\"sog\":15,\"ppg\":0,\"shg\":0},{\"id\":8478401,\"name\":\"Pavel Zacha\",\"pos\":\"C\",\"no\":18,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":1116.5,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8478840,\"name\":\"Will Borgen\",\"pos\":\"D\",\"no\":17,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":3,\"toi\":1095.25,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8479661,\"name\":\"Tanner Jeannot\",\"pos\":\"L\",\"no\":84,\"gp\":4,\"g\":1,\"a\":0,\"pts\":1,\"pm\":0,\"toi\":636.25,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8479987,\"name\":\"Morgan Geekie\",\"pos\":\"C\",\"no\":39,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":0,\"toi\":1123.5,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8479999,\"name\":\"Casey Mittelstadt\",\"pos\":\"C\",\"no\":11,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":880.75,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8480355,\"name\":\"Mark Kastelic\",\"pos\":\"C\",\"no\":47,\"gp\":4,\"g\":1,\"a\":2,\"pts\":3,\"pm\":1,\"toi\":655.5,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8481219,\"name\":\"Jonathan Aspirot\",\"pos\":\"D\",\"no\":45,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":998,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8482175,\"name\":\"JJ Peterka\",\"pos\":\"R\",\"no\":10,\"gp\":4,\"g\":2,\"a\":0,\"pts\":2,\"pm\":0,\"toi\":1098,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8482177,\"name\":\"Marat Khusnutdinov\",\"pos\":\"C\",\"no\":92,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":803.25,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8482511,\"name\":\"Mason Lohrei\",\"pos\":\"D\",\"no\":6,\"gp\":4,\"g\":0,\"a\":2,\"pts\":2,\"pm\":0,\"toi\":1248.75,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8483017,\"name\":\"Frederic Brunet\",\"pos\":\"D\",\"no\":42,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":1123,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8483489,\"name\":\"Fraser Minten\",\"pos\":\"C\",\"no\":93,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":0,\"toi\":935.5,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8483505,\"name\":\"Matthew Poitras\",\"pos\":\"C\",\"no\":51,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":688,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8485395,\"name\":\"James Hagens\",\"pos\":\"C\",\"no\":44,\"gp\":4,\"g\":2,\"a\":0,\"pts\":2,\"pm\":-1,\"toi\":829.75,\"sog\":7,\"ppg\":0,\"shg\":0}],\"MTL\":[{\"id\":8475184,\"name\":\"Chris Kreider\",\"pos\":\"L\",\"no\":22,\"gp\":3,\"g\":1,\"a\":3,\"pts\":4,\"pm\":2,\"toi\":876,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8476479,\"name\":\"Phillip Danault\",\"pos\":\"C\",\"no\":24,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":817,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8476875,\"name\":\"Mike Matheson\",\"pos\":\"D\",\"no\":8,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-3,\"toi\":1481,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8476981,\"name\":\"Josh Anderson\",\"pos\":\"R\",\"no\":17,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":0,\"toi\":751,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8478133,\"name\":\"Jake Evans\",\"pos\":\"C\",\"no\":71,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":875,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8478851,\"name\":\"Alexandre Carrier\",\"pos\":\"D\",\"no\":45,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":3,\"toi\":972.3333,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8480018,\"name\":\"Nick Suzuki\",\"pos\":\"C\",\"no\":14,\"gp\":3,\"g\":2,\"a\":4,\"pts\":6,\"pm\":4,\"toi\":1265,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8480074,\"name\":\"Alexandre Texier\",\"pos\":\"L\",\"no\":85,\"gp\":3,\"g\":0,\"a\":2,\"pts\":2,\"pm\":0,\"toi\":665.6667,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8480865,\"name\":\"Noah Dobson\",\"pos\":\"D\",\"no\":53,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-2,\"toi\":1385.6667,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8481523,\"name\":\"Kirby Dach\",\"pos\":\"C\",\"no\":77,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-2,\"toi\":648.3333,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8481540,\"name\":\"Cole Caufield\",\"pos\":\"R\",\"no\":13,\"gp\":3,\"g\":2,\"a\":0,\"pts\":2,\"pm\":2,\"toi\":1210,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8481593,\"name\":\"Jayden Struble\",\"pos\":\"D\",\"no\":47,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":725.3333,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8481618,\"name\":\"Alex Newhook\",\"pos\":\"C\",\"no\":15,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-1,\"toi\":970.6667,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8482737,\"name\":\"Zachary Bolduc\",\"pos\":\"R\",\"no\":76,\"gp\":3,\"g\":3,\"a\":0,\"pts\":3,\"pm\":2,\"toi\":734,\"sog\":5,\"ppg\":1,\"shg\":0},{\"id\":8482964,\"name\":\"Arber Xhekaj\",\"pos\":\"D\",\"no\":72,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":705,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8483457,\"name\":\"Lane Hutson\",\"pos\":\"D\",\"no\":48,\"gp\":3,\"g\":0,\"a\":4,\"pts\":4,\"pm\":2,\"toi\":1651.3333,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8483515,\"name\":\"Juraj Slafkovský\",\"pos\":\"L\",\"no\":20,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":1,\"toi\":1116,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8484403,\"name\":\"Florian Xhekaj\",\"pos\":\"L\",\"no\":63,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-3,\"toi\":528,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8484984,\"name\":\"Ivan Demidov\",\"pos\":\"R\",\"no\":93,\"gp\":2,\"g\":1,\"a\":1,\"pts\":2,\"pm\":0,\"toi\":937,\"sog\":4,\"ppg\":0,\"shg\":0}],\"NSH\":[{\"id\":8474564,\"name\":\"Steven Stamkos\",\"pos\":\"C\",\"no\":91,\"gp\":3,\"g\":3,\"a\":1,\"pts\":4,\"pm\":-1,\"toi\":1170.3333,\"sog\":8,\"ppg\":2,\"shg\":0},{\"id\":8474600,\"name\":\"Roman Josi\",\"pos\":\"D\",\"no\":59,\"gp\":3,\"g\":1,\"a\":2,\"pts\":3,\"pm\":-1,\"toi\":1521.3333,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8475158,\"name\":\"Ryan O'Reilly\",\"pos\":\"C\",\"no\":90,\"gp\":3,\"g\":0,\"a\":2,\"pts\":2,\"pm\":-3,\"toi\":1301.3333,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8476539,\"name\":\"Jonathan Marchessault\",\"pos\":\"R\",\"no\":81,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":939.6667,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8476869,\"name\":\"Brady Skjei\",\"pos\":\"D\",\"no\":76,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-1,\"toi\":1237,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8476887,\"name\":\"Filip Forsberg\",\"pos\":\"L\",\"no\":9,\"gp\":3,\"g\":0,\"a\":3,\"pts\":3,\"pm\":1,\"toi\":1243,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8477021,\"name\":\"Alexander Kerfoot\",\"pos\":\"C\",\"no\":14,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-3,\"toi\":971,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8479525,\"name\":\"Ross Colton\",\"pos\":\"C\",\"no\":79,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":808.6667,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8479980,\"name\":\"Nicolas Hague\",\"pos\":\"D\",\"no\":41,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":1111.6667,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8480246,\"name\":\"Nick Perbix\",\"pos\":\"D\",\"no\":48,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-3,\"toi\":1150.6667,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8480835,\"name\":\"Jack Drury\",\"pos\":\"C\",\"no\":18,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":840.6667,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8481535,\"name\":\"Nils Hoglander\",\"pos\":\"L\",\"no\":21,\"gp\":3,\"g\":3,\"a\":0,\"pts\":3,\"pm\":1,\"toi\":655.6667,\"sog\":4,\"ppg\":1,\"shg\":0},{\"id\":8481726,\"name\":\"Adam Edstrom\",\"pos\":\"C\",\"no\":84,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":780,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8482072,\"name\":\"Jack Ahcan\",\"pos\":\"D\",\"no\":47,\"gp\":2,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":413.5,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8482145,\"name\":\"Mavrik Bourque\",\"pos\":\"C\",\"no\":22,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":1095,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8482482,\"name\":\"Adam Wilsby\",\"pos\":\"D\",\"no\":2,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":0,\"toi\":914.3333,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8482715,\"name\":\"Ryan Ufko\",\"pos\":\"D\",\"no\":null,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":927,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8482806,\"name\":\"William Trudeau\",\"pos\":\"D\",\"no\":85,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":686.5,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8483513,\"name\":\"Reid Schaefer\",\"pos\":\"L\",\"no\":49,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":695,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8484241,\"name\":\"Matthew Wood\",\"pos\":\"R\",\"no\":71,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":0,\"toi\":1007.3333,\"sog\":4,\"ppg\":0,\"shg\":0}],\"CBJ\":[{\"id\":8475745,\"name\":\"Charlie Coyle\",\"pos\":\"C\",\"no\":3,\"gp\":2,\"g\":0,\"a\":3,\"pts\":3,\"pm\":2,\"toi\":1034,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8475790,\"name\":\"Erik Gudbranson\",\"pos\":\"D\",\"no\":44,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":1029.5,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8477369,\"name\":\"Carson Soucy\",\"pos\":\"D\",\"no\":7,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":1101.5,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8477497,\"name\":\"Sean Monahan\",\"pos\":\"C\",\"no\":23,\"gp\":2,\"g\":1,\"a\":0,\"pts\":1,\"pm\":-1,\"toi\":972,\"sog\":2,\"ppg\":1,\"shg\":0},{\"id\":8477501,\"name\":\"Valeri Nichushkin\",\"pos\":\"R\",\"no\":43,\"gp\":2,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-2,\"toi\":976,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8478046,\"name\":\"Danton Heinen\",\"pos\":\"L\",\"no\":58,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":708,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8478460,\"name\":\"Zach Werenski\",\"pos\":\"D\",\"no\":8,\"gp\":2,\"g\":0,\"a\":2,\"pts\":2,\"pm\":2,\"toi\":1814.5,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8478856,\"name\":\"Conor Garland\",\"pos\":\"R\",\"no\":83,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":746,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8479066,\"name\":\"Ryan Lomberg\",\"pos\":\"L\",\"no\":94,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":553.5,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8479671,\"name\":\"Mathieu Olivier\",\"pos\":\"R\",\"no\":24,\"gp\":2,\"g\":1,\"a\":0,\"pts\":1,\"pm\":2,\"toi\":897.5,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8481161,\"name\":\"Jake Christiansen\",\"pos\":\"D\",\"no\":2,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":506,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8481716,\"name\":\"Dmitri Voronkov\",\"pos\":\"L\",\"no\":10,\"gp\":2,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-1,\"toi\":707,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8482126,\"name\":\"Emil Andrae\",\"pos\":\"D\",\"no\":36,\"gp\":2,\"g\":0,\"a\":1,\"pts\":1,\"pm\":2,\"toi\":880,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8482660,\"name\":\"Kent Johnson\",\"pos\":\"C\",\"no\":91,\"gp\":2,\"g\":1,\"a\":1,\"pts\":2,\"pm\":1,\"toi\":963.5,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8482705,\"name\":\"Cole Sillinger\",\"pos\":\"C\",\"no\":4,\"gp\":2,\"g\":1,\"a\":0,\"pts\":1,\"pm\":2,\"toi\":861,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8482720,\"name\":\"Matthew Knies\",\"pos\":\"L\",\"no\":89,\"gp\":2,\"g\":2,\"a\":2,\"pts\":4,\"pm\":1,\"toi\":1015,\"sog\":5,\"ppg\":1,\"shg\":0},{\"id\":8483485,\"name\":\"Denton Mateychuk\",\"pos\":\"D\",\"no\":5,\"gp\":2,\"g\":0,\"a\":1,\"pts\":1,\"pm\":0,\"toi\":1667.5,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8484166,\"name\":\"Adam Fantilli\",\"pos\":\"C\",\"no\":19,\"gp\":2,\"g\":1,\"a\":0,\"pts\":1,\"pm\":1,\"toi\":1139.5,\"sog\":3,\"ppg\":0,\"shg\":0}],\"NYI\":[{\"id\":8475151,\"name\":\"Kyle Palmieri\",\"pos\":\"C\",\"no\":21,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":996.3333,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8475170,\"name\":\"Brayden Schenn\",\"pos\":\"C\",\"no\":10,\"gp\":3,\"g\":1,\"a\":3,\"pts\":4,\"pm\":2,\"toi\":907.6667,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8475231,\"name\":\"Casey Cizikas\",\"pos\":\"C\",\"no\":53,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":2,\"toi\":740,\"sog\":4,\"ppg\":0,\"shg\":1},{\"id\":8476292,\"name\":\"Ondrej Palat\",\"pos\":\"L\",\"no\":81,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":0,\"toi\":690,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8476419,\"name\":\"Jean-Gabriel Pageau\",\"pos\":\"C\",\"no\":44,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-2,\"toi\":869.6667,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8476917,\"name\":\"Adam Pelech\",\"pos\":\"D\",\"no\":3,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":2,\"toi\":1213.3333,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8477407,\"name\":\"Anthony Duclair\",\"pos\":\"L\",\"no\":11,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":768.6667,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8477500,\"name\":\"Bo Horvat\",\"pos\":\"C\",\"no\":14,\"gp\":3,\"g\":2,\"a\":1,\"pts\":3,\"pm\":-1,\"toi\":1177,\"sog\":10,\"ppg\":2,\"shg\":0},{\"id\":8477506,\"name\":\"Ryan Pulock\",\"pos\":\"D\",\"no\":6,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":1039.6667,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8477950,\"name\":\"Tony DeAngelo\",\"pos\":\"D\",\"no\":77,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":1063.3333,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8479378,\"name\":\"Logan Stanley\",\"pos\":\"D\",\"no\":8,\"gp\":3,\"g\":0,\"a\":2,\"pts\":2,\"pm\":2,\"toi\":1072.3333,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8481014,\"name\":\"Alexander Romanov\",\"pos\":\"D\",\"no\":28,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":2,\"toi\":994,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8481601,\"name\":\"Simon Holmstrom\",\"pos\":\"R\",\"no\":92,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":0,\"toi\":1044.6667,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8481711,\"name\":\"Matias Maccelli\",\"pos\":\"L\",\"no\":63,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":0,\"toi\":926,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8482476,\"name\":\"Emil Heineman\",\"pos\":\"L\",\"no\":51,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":0,\"toi\":933,\"sog\":2,\"ppg\":0,\"shg\":1},{\"id\":8484221,\"name\":\"Calum Ritchie\",\"pos\":\"C\",\"no\":64,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":2,\"toi\":884,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8485366,\"name\":\"Matthew Schaefer\",\"pos\":\"D\",\"no\":48,\"gp\":3,\"g\":0,\"a\":2,\"pts\":2,\"pm\":0,\"toi\":1467.3333,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8485388,\"name\":\"Victor Eklund\",\"pos\":\"R\",\"no\":38,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":2,\"toi\":790.3333,\"sog\":5,\"ppg\":0,\"shg\":0}],\"DAL\":[{\"id\":8473994,\"name\":\"Jamie Benn\",\"pos\":\"L\",\"no\":14,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":1,\"toi\":751.6667,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8474574,\"name\":\"Tyler Myers\",\"pos\":\"D\",\"no\":57,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":899.6667,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8475794,\"name\":\"Tyler Seguin\",\"pos\":\"C\",\"no\":91,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":879,\"sog\":9,\"ppg\":0,\"shg\":0},{\"id\":8476278,\"name\":\"Colin Blackwell\",\"pos\":\"C\",\"no\":15,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":449,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8476889,\"name\":\"Radek Faksa\",\"pos\":\"C\",\"no\":12,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":681.6667,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8476902,\"name\":\"Esa Lindell\",\"pos\":\"D\",\"no\":23,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":3,\"toi\":1136,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8478420,\"name\":\"Mikko Rantanen\",\"pos\":\"R\",\"no\":96,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":1,\"toi\":1273,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8478449,\"name\":\"Roope Hintz\",\"pos\":\"C\",\"no\":24,\"gp\":3,\"g\":0,\"a\":2,\"pts\":2,\"pm\":1,\"toi\":970.3333,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8479351,\"name\":\"Sam Steel\",\"pos\":\"C\",\"no\":18,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":0,\"toi\":844,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8480027,\"name\":\"Jason Robertson\",\"pos\":\"L\",\"no\":21,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":0,\"toi\":1125,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8480036,\"name\":\"Miro Heiskanen\",\"pos\":\"D\",\"no\":4,\"gp\":3,\"g\":2,\"a\":0,\"pts\":2,\"pm\":2,\"toi\":1439,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8480840,\"name\":\"Oskar Bäck\",\"pos\":\"C\",\"no\":10,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":669.6667,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8480878,\"name\":\"Nils Lundkvist\",\"pos\":\"D\",\"no\":5,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":1035,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8481581,\"name\":\"Thomas Harley\",\"pos\":\"D\",\"no\":55,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":1369,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8481641,\"name\":\"Joel Kiviranta\",\"pos\":\"L\",\"no\":22,\"gp\":2,\"g\":1,\"a\":0,\"pts\":1,\"pm\":1,\"toi\":627.5,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8482740,\"name\":\"Wyatt Johnston\",\"pos\":\"C\",\"no\":53,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":0,\"toi\":1228,\"sog\":9,\"ppg\":0,\"shg\":0},{\"id\":8483425,\"name\":\"Lian Bichsel\",\"pos\":\"D\",\"no\":6,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":1012.3333,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8484829,\"name\":\"Justin Hryckowian\",\"pos\":\"C\",\"no\":49,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":958.6667,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8484938,\"name\":\"Arttu Hyry\",\"pos\":\"R\",\"no\":25,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":850.6667,\"sog\":3,\"ppg\":0,\"shg\":0}],\"DET\":[{\"id\":8475279,\"name\":\"Ben Chiarot\",\"pos\":\"D\",\"no\":8,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":1082.6667,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8475753,\"name\":\"Justin Faulk\",\"pos\":\"D\",\"no\":72,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":3,\"toi\":1187.3333,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8477429,\"name\":\"Andrew Copp\",\"pos\":\"C\",\"no\":18,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-1,\"toi\":1288.3333,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8477456,\"name\":\"J.T. Compher\",\"pos\":\"L\",\"no\":37,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":879.5,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8477946,\"name\":\"Dylan Larkin\",\"pos\":\"C\",\"no\":71,\"gp\":1,\"g\":1,\"a\":1,\"pts\":2,\"pm\":0,\"toi\":1241,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8477971,\"name\":\"Andreas Englund\",\"pos\":\"D\",\"no\":24,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":435,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8478042,\"name\":\"Viktor Arvidsson\",\"pos\":\"L\",\"no\":33,\"gp\":3,\"g\":2,\"a\":1,\"pts\":3,\"pm\":-1,\"toi\":1100.3333,\"sog\":8,\"ppg\":2,\"shg\":0},{\"id\":8478434,\"name\":\"Keegan Kolesar\",\"pos\":\"R\",\"no\":55,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":726.3333,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8478891,\"name\":\"Mason Appleton\",\"pos\":\"C\",\"no\":22,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":590.5,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8479337,\"name\":\"Alex DeBrincat\",\"pos\":\"R\",\"no\":93,\"gp\":3,\"g\":2,\"a\":2,\"pts\":4,\"pm\":2,\"toi\":1234.6667,\"sog\":8,\"ppg\":1,\"shg\":0},{\"id\":8479992,\"name\":\"Michael Rasmussen\",\"pos\":\"C\",\"no\":27,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":1022.6667,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8481542,\"name\":\"Moritz Seider\",\"pos\":\"D\",\"no\":53,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-2,\"toi\":1499.3333,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8481607,\"name\":\"Albert Johansson\",\"pos\":\"D\",\"no\":20,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":942,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8482078,\"name\":\"Lucas Raymond\",\"pos\":\"L\",\"no\":23,\"gp\":3,\"g\":0,\"a\":3,\"pts\":3,\"pm\":-2,\"toi\":1274.3333,\"sog\":10,\"ppg\":0,\"shg\":0},{\"id\":8482171,\"name\":\"William Wallinder\",\"pos\":\"D\",\"no\":54,\"gp\":1,\"g\":0,\"a\":1,\"pts\":1,\"pm\":2,\"toi\":547,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8482802,\"name\":\"Carter Mazur\",\"pos\":\"L\",\"no\":34,\"gp\":1,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":445,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8483464,\"name\":\"Marco Kasper\",\"pos\":\"C\",\"no\":92,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":650,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8483679,\"name\":\"Anton Johansson\",\"pos\":\"D\",\"no\":42,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":997.6667,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8484160,\"name\":\"Nate Danielson\",\"pos\":\"C\",\"no\":29,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":517.3333,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8484223,\"name\":\"Axel Sandin-Pellikka\",\"pos\":\"D\",\"no\":44,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":870.3333,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8484471,\"name\":\"Emmitt Finnie\",\"pos\":\"C\",\"no\":58,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":1,\"toi\":992.3333,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8484794,\"name\":\"Michael Brandsegg-Nygård\",\"pos\":\"R\",\"no\":28,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":836.3333,\"sog\":10,\"ppg\":0,\"shg\":0}],\"STL\":[{\"id\":8475764,\"name\":\"Cam Fowler\",\"pos\":\"D\",\"no\":17,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":1382.3333,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8476892,\"name\":\"Colton Parayko\",\"pos\":\"D\",\"no\":55,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-1,\"toi\":1227.6667,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8477402,\"name\":\"Pavel Buchnevich\",\"pos\":\"L\",\"no\":89,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":1012.3333,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8477527,\"name\":\"Ross Johnston\",\"pos\":\"L\",\"no\":49,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":517,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8478443,\"name\":\"Brandon Carlo\",\"pos\":\"D\",\"no\":25,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":1020.3333,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8479346,\"name\":\"Dillon Dube\",\"pos\":\"C\",\"no\":65,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":704,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8480023,\"name\":\"Robert Thomas\",\"pos\":\"C\",\"no\":18,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-3,\"toi\":1200,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8480281,\"name\":\"Alexey Toropchenko\",\"pos\":\"R\",\"no\":13,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":308,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8480459,\"name\":\"Pius Suter\",\"pos\":\"C\",\"no\":22,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":1,\"toi\":879,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8481013,\"name\":\"Jonatan Berggren\",\"pos\":\"R\",\"no\":29,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":887,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8481580,\"name\":\"Connor McMichael\",\"pos\":\"L\",\"no\":77,\"gp\":3,\"g\":1,\"a\":2,\"pts\":3,\"pm\":-1,\"toi\":925,\"sog\":8,\"ppg\":1,\"shg\":0},{\"id\":8481598,\"name\":\"Philip Broberg\",\"pos\":\"D\",\"no\":6,\"gp\":3,\"g\":0,\"a\":2,\"pts\":2,\"pm\":-4,\"toi\":1316.3333,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8482077,\"name\":\"Dylan Holloway\",\"pos\":\"L\",\"no\":81,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-4,\"toi\":1019.6667,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8482089,\"name\":\"Jake Neighbours\",\"pos\":\"L\",\"no\":63,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":840.3333,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8482745,\"name\":\"Mason McTavish\",\"pos\":\"C\",\"no\":83,\"gp\":3,\"g\":2,\"a\":0,\"pts\":2,\"pm\":0,\"toi\":937.6667,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8482784,\"name\":\"Zach Dean\",\"pos\":\"C\",\"no\":52,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":757,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8483516,\"name\":\"Jimmy Snuggerud\",\"pos\":\"R\",\"no\":21,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":-1,\"toi\":1056,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8484164,\"name\":\"Dalibor Dvorsky\",\"pos\":\"R\",\"no\":15,\"gp\":3,\"g\":2,\"a\":0,\"pts\":2,\"pm\":0,\"toi\":723.3333,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8484188,\"name\":\"Theo Lindstein\",\"pos\":\"D\",\"no\":4,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":889.3333,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8484790,\"name\":\"Adam Jiricek\",\"pos\":\"D\",\"no\":36,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":1090,\"sog\":5,\"ppg\":0,\"shg\":0}],\"NJD\":[{\"id\":8475455,\"name\":\"Brenden Dillon\",\"pos\":\"D\",\"no\":5,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":797.3333,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8476462,\"name\":\"Dougie Hamilton\",\"pos\":\"D\",\"no\":7,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":-5,\"toi\":1331,\"sog\":10,\"ppg\":0,\"shg\":0},{\"id\":8476474,\"name\":\"Stefan Noesen\",\"pos\":\"R\",\"no\":11,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":444,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8477488,\"name\":\"Brett Pesce\",\"pos\":\"D\",\"no\":22,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":1187,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8477511,\"name\":\"Anthony Mantha\",\"pos\":\"R\",\"no\":39,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":900,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8478399,\"name\":\"Jonas Siegenthaler\",\"pos\":\"D\",\"no\":71,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-4,\"toi\":1133.6667,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8478414,\"name\":\"Timo Meier\",\"pos\":\"R\",\"no\":28,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-1,\"toi\":1097.3333,\"sog\":18,\"ppg\":0,\"shg\":0},{\"id\":8478542,\"name\":\"Evan Rodrigues\",\"pos\":\"C\",\"no\":17,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-4,\"toi\":985.6667,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8479407,\"name\":\"Jesper Bratt\",\"pos\":\"L\",\"no\":63,\"gp\":3,\"g\":0,\"a\":2,\"pts\":2,\"pm\":-1,\"toi\":1122.6667,\"sog\":10,\"ppg\":0,\"shg\":0},{\"id\":8479996,\"name\":\"Cody Glass\",\"pos\":\"C\",\"no\":12,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":649.6667,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8480002,\"name\":\"Nico Hischier\",\"pos\":\"C\",\"no\":13,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":1227.6667,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8480003,\"name\":\"Jesper Boqvist\",\"pos\":\"C\",\"no\":70,\"gp\":1,\"g\":1,\"a\":0,\"pts\":1,\"pm\":0,\"toi\":589,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8480990,\"name\":\"Declan Chisholm\",\"pos\":\"D\",\"no\":47,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-1,\"toi\":846,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8481559,\"name\":\"Jack Hughes\",\"pos\":\"C\",\"no\":86,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":-1,\"toi\":1367,\"sog\":13,\"ppg\":0,\"shg\":0},{\"id\":8481721,\"name\":\"Arseny Gritsyuk\",\"pos\":\"R\",\"no\":81,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-3,\"toi\":917.6667,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8482110,\"name\":\"Dawson Mercer\",\"pos\":\"C\",\"no\":91,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":844.6667,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8482146,\"name\":\"Luke Evangelista\",\"pos\":\"R\",\"no\":77,\"gp\":3,\"g\":2,\"a\":1,\"pts\":3,\"pm\":1,\"toi\":1107.6667,\"sog\":9,\"ppg\":1,\"shg\":0},{\"id\":8482684,\"name\":\"Luke Hughes\",\"pos\":\"D\",\"no\":43,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":0,\"toi\":1443.6667,\"sog\":11,\"ppg\":0,\"shg\":0},{\"id\":8483695,\"name\":\"Amadeus Lombardi\",\"pos\":\"C\",\"no\":93,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":529.3333,\"sog\":4,\"ppg\":0,\"shg\":0}],\"CHI\":[{\"id\":8474013,\"name\":\"Ian Cole\",\"pos\":\"D\",\"no\":28,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":2,\"toi\":1016.75,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8474141,\"name\":\"Patrick Kane\",\"pos\":\"R\",\"no\":88,\"gp\":4,\"g\":1,\"a\":0,\"pts\":1,\"pm\":-4,\"toi\":1212.75,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8476882,\"name\":\"Teuvo Teravainen\",\"pos\":\"C\",\"no\":86,\"gp\":3,\"g\":0,\"a\":2,\"pts\":2,\"pm\":1,\"toi\":737.6667,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8477479,\"name\":\"Tyler Bertuzzi\",\"pos\":\"L\",\"no\":59,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":1,\"toi\":1038.5,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8477987,\"name\":\"Ryan Donato\",\"pos\":\"C\",\"no\":8,\"gp\":4,\"g\":1,\"a\":0,\"pts\":1,\"pm\":-5,\"toi\":654,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8478233,\"name\":\"Andrew Mangiapane\",\"pos\":\"L\",\"no\":26,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":323,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8478413,\"name\":\"Jordan Greenway\",\"pos\":\"L\",\"no\":12,\"gp\":4,\"g\":1,\"a\":0,\"pts\":1,\"pm\":1,\"toi\":849,\"sog\":9,\"ppg\":0,\"shg\":0},{\"id\":8481524,\"name\":\"Bowen Byram\",\"pos\":\"D\",\"no\":24,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-3,\"toi\":1426.6667,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8481568,\"name\":\"Alex Vlasic\",\"pos\":\"D\",\"no\":72,\"gp\":4,\"g\":0,\"a\":2,\"pts\":2,\"pm\":1,\"toi\":1240,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8482062,\"name\":\"Cole Smith\",\"pos\":\"R\",\"no\":22,\"gp\":4,\"g\":1,\"a\":0,\"pts\":1,\"pm\":2,\"toi\":889.25,\"sog\":3,\"ppg\":0,\"shg\":1},{\"id\":8482176,\"name\":\"Wyatt Kaiser\",\"pos\":\"D\",\"no\":44,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-2,\"toi\":1220,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8482807,\"name\":\"Ethan Del Mastro\",\"pos\":\"D\",\"no\":38,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":901,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8483450,\"name\":\"Ryan Greene\",\"pos\":\"C\",\"no\":20,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":2,\"toi\":920.75,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8483466,\"name\":\"Kevin Korchinski\",\"pos\":\"D\",\"no\":14,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":681,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8483493,\"name\":\"Frank Nazar\",\"pos\":\"C\",\"no\":91,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":-4,\"toi\":1124,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8483506,\"name\":\"Sam Rinzel\",\"pos\":\"D\",\"no\":6,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":-2,\"toi\":1070.3333,\"sog\":6,\"ppg\":1,\"shg\":0},{\"id\":8484185,\"name\":\"Nick Lardis\",\"pos\":\"L\",\"no\":76,\"gp\":4,\"g\":0,\"a\":2,\"pts\":2,\"pm\":-5,\"toi\":590.5,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8484197,\"name\":\"Oliver Moore\",\"pos\":\"C\",\"no\":11,\"gp\":4,\"g\":1,\"a\":0,\"pts\":1,\"pm\":-2,\"toi\":707,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8484390,\"name\":\"Roman Kantserov\",\"pos\":\"R\",\"no\":80,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-4,\"toi\":1096.75,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8484783,\"name\":\"Artyom Levshunov\",\"pos\":\"D\",\"no\":55,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-1,\"toi\":1226.25,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8485391,\"name\":\"Anton Frondell\",\"pos\":\"C\",\"no\":16,\"gp\":4,\"g\":1,\"a\":3,\"pts\":4,\"pm\":0,\"toi\":1058.5,\"sog\":6,\"ppg\":0,\"shg\":0}],\"PHI\":[{\"id\":8476372,\"name\":\"Nick Seeler\",\"pos\":\"D\",\"no\":24,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":1085,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8476461,\"name\":\"Sean Couturier\",\"pos\":\"C\",\"no\":14,\"gp\":4,\"g\":0,\"a\":2,\"pts\":2,\"pm\":0,\"toi\":969.75,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8477499,\"name\":\"Rasmus Ristolainen\",\"pos\":\"D\",\"no\":55,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":0,\"toi\":1096.6667,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8477948,\"name\":\"Travis Sanheim\",\"pos\":\"D\",\"no\":6,\"gp\":4,\"g\":1,\"a\":1,\"pts\":2,\"pm\":-4,\"toi\":1472.75,\"sog\":9,\"ppg\":0,\"shg\":0},{\"id\":8477989,\"name\":\"Christian Dvorak\",\"pos\":\"C\",\"no\":22,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-1,\"toi\":969,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8478439,\"name\":\"Travis Konecny\",\"pos\":\"R\",\"no\":11,\"gp\":4,\"g\":0,\"a\":2,\"pts\":2,\"pm\":-4,\"toi\":1004.75,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8478569,\"name\":\"Noel Acciari\",\"pos\":\"C\",\"no\":52,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-3,\"toi\":922,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8479336,\"name\":\"Carl Grundstrom\",\"pos\":\"R\",\"no\":91,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":667,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8480015,\"name\":\"Owen Tippett\",\"pos\":\"R\",\"no\":74,\"gp\":4,\"g\":1,\"a\":0,\"pts\":1,\"pm\":0,\"toi\":930.25,\"sog\":9,\"ppg\":0,\"shg\":0},{\"id\":8480220,\"name\":\"Noah Cates\",\"pos\":\"L\",\"no\":27,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-3,\"toi\":748.5,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8481122,\"name\":\"Simon Benoit\",\"pos\":\"D\",\"no\":44,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":876.6667,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8481533,\"name\":\"Trevor Zegras\",\"pos\":\"C\",\"no\":46,\"gp\":4,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-3,\"toi\":1122.25,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8481546,\"name\":\"Cam York\",\"pos\":\"D\",\"no\":8,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-5,\"toi\":1362.5,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8482142,\"name\":\"Jamie Drysdale\",\"pos\":\"D\",\"no\":9,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-4,\"toi\":1210.75,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8482159,\"name\":\"Tyson Foerster\",\"pos\":\"R\",\"no\":71,\"gp\":4,\"g\":1,\"a\":0,\"pts\":1,\"pm\":-6,\"toi\":1104,\"sog\":10,\"ppg\":0,\"shg\":0},{\"id\":8483460,\"name\":\"David Jiricek\",\"pos\":\"D\",\"no\":5,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":926,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8483731,\"name\":\"Alex Bump\",\"pos\":\"L\",\"no\":null,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":728,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8484142,\"name\":\"Denver Barkey\",\"pos\":\"C\",\"no\":86,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":786,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8484387,\"name\":\"Matvei Michkov\",\"pos\":\"R\",\"no\":39,\"gp\":4,\"g\":1,\"a\":0,\"pts\":1,\"pm\":-3,\"toi\":929.75,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8485406,\"name\":\"Porter Martone\",\"pos\":\"R\",\"no\":94,\"gp\":4,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":782.5,\"sog\":2,\"ppg\":0,\"shg\":0}],\"LAK\":[{\"id\":8470621,\"name\":\"Corey Perry\",\"pos\":\"R\",\"no\":90,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":1,\"toi\":649.5,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8474563,\"name\":\"Drew Doughty\",\"pos\":\"D\",\"no\":8,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-1,\"toi\":1193,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8475208,\"name\":\"Brian Dumoulin\",\"pos\":\"D\",\"no\":2,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":-1,\"toi\":918.3333,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8475287,\"name\":\"Erik Haula\",\"pos\":\"L\",\"no\":56,\"gp\":3,\"g\":1,\"a\":2,\"pts\":3,\"pm\":-1,\"toi\":926.3333,\"sog\":8,\"ppg\":0,\"shg\":0},{\"id\":8475692,\"name\":\"Mats Zuccarello\",\"pos\":\"R\",\"no\":36,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":1091,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8476441,\"name\":\"Joel Edmundson\",\"pos\":\"D\",\"no\":6,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":843,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8476469,\"name\":\"Joel Armia\",\"pos\":\"R\",\"no\":40,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":0,\"toi\":777,\"sog\":4,\"ppg\":0,\"shg\":1},{\"id\":8476872,\"name\":\"Scott Laughton\",\"pos\":\"C\",\"no\":21,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-1,\"toi\":838.3333,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8476879,\"name\":\"Cody Ceci\",\"pos\":\"D\",\"no\":5,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":3,\"toi\":1064.3333,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8476979,\"name\":\"Erik Gustafsson\",\"pos\":\"D\",\"no\":64,\"gp\":2,\"g\":0,\"a\":1,\"pts\":1,\"pm\":0,\"toi\":967,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8477960,\"name\":\"Adrian Kempe\",\"pos\":\"R\",\"no\":9,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":-3,\"toi\":1261.6667,\"sog\":12,\"ppg\":1,\"shg\":0},{\"id\":8478550,\"name\":\"Artemi Panarin\",\"pos\":\"L\",\"no\":10,\"gp\":3,\"g\":2,\"a\":1,\"pts\":3,\"pm\":-4,\"toi\":1260.6667,\"sog\":10,\"ppg\":0,\"shg\":0},{\"id\":8479675,\"name\":\"Trevor Moore\",\"pos\":\"L\",\"no\":12,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":-1,\"toi\":945,\"sog\":6,\"ppg\":0,\"shg\":1},{\"id\":8479998,\"name\":\"Mikey Anderson\",\"pos\":\"D\",\"no\":44,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-1,\"toi\":1037,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8481532,\"name\":\"Alex Turcotte\",\"pos\":\"C\",\"no\":15,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":1,\"toi\":846.3333,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8481732,\"name\":\"Andre Lee\",\"pos\":\"L\",\"no\":47,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":476,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8482124,\"name\":\"Quinton Byfield\",\"pos\":\"R\",\"no\":55,\"gp\":3,\"g\":1,\"a\":1,\"pts\":2,\"pm\":-4,\"toi\":1256.3333,\"sog\":7,\"ppg\":1,\"shg\":0},{\"id\":8482155,\"name\":\"Alex Laferriere\",\"pos\":\"R\",\"no\":14,\"gp\":3,\"g\":1,\"a\":2,\"pts\":3,\"pm\":1,\"toi\":988.6667,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8482726,\"name\":\"Samuel Helenius\",\"pos\":\"C\",\"no\":79,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":419,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8482730,\"name\":\"Brandt Clarke\",\"pos\":\"D\",\"no\":92,\"gp\":3,\"g\":0,\"a\":2,\"pts\":2,\"pm\":-4,\"toi\":1178.6667,\"sog\":6,\"ppg\":0,\"shg\":0}],\"CGY\":[{\"id\":8474150,\"name\":\"Mikael Backlund\",\"pos\":\"C\",\"no\":11,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-3,\"toi\":1026.6667,\"sog\":9,\"ppg\":0,\"shg\":0},{\"id\":8476458,\"name\":\"Ryan Strome\",\"pos\":\"C\",\"no\":22,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":-3,\"toi\":838.6667,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8477810,\"name\":\"Joel Hanley\",\"pos\":\"D\",\"no\":44,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":978,\"sog\":0,\"ppg\":0,\"shg\":0},{\"id\":8478136,\"name\":\"Jake Middleton\",\"pos\":\"D\",\"no\":55,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-3,\"toi\":1107,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8480028,\"name\":\"Morgan Frost\",\"pos\":\"C\",\"no\":16,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":-6,\"toi\":929,\"sog\":8,\"ppg\":1,\"shg\":0},{\"id\":8480727,\"name\":\"Zach Whitecloud\",\"pos\":\"D\",\"no\":28,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-5,\"toi\":1264.6667,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8480797,\"name\":\"Joel Farabee\",\"pos\":\"L\",\"no\":86,\"gp\":3,\"g\":0,\"a\":2,\"pts\":2,\"pm\":-4,\"toi\":972.3333,\"sog\":6,\"ppg\":0,\"shg\":0},{\"id\":8480860,\"name\":\"Kevin Bahl\",\"pos\":\"D\",\"no\":7,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-3,\"toi\":1270.3333,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8481028,\"name\":\"Martin Pospisil\",\"pos\":\"C\",\"no\":76,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-3,\"toi\":774,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8481068,\"name\":\"Yegor Sharangovich\",\"pos\":\"C\",\"no\":17,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-2,\"toi\":990.6667,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8482074,\"name\":\"Connor Zary\",\"pos\":\"C\",\"no\":null,\"gp\":2,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-2,\"toi\":817.5,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8482165,\"name\":\"Yan Kuznetsov\",\"pos\":\"D\",\"no\":37,\"gp\":2,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-3,\"toi\":1131,\"sog\":4,\"ppg\":0,\"shg\":0},{\"id\":8482679,\"name\":\"Matt Coronato\",\"pos\":\"R\",\"no\":27,\"gp\":3,\"g\":1,\"a\":0,\"pts\":1,\"pm\":-6,\"toi\":1048,\"sog\":7,\"ppg\":1,\"shg\":0},{\"id\":8482747,\"name\":\"Brennan Othmann\",\"pos\":\"L\",\"no\":78,\"gp\":1,\"g\":0,\"a\":0,\"pts\":0,\"pm\":0,\"toi\":630,\"sog\":1,\"ppg\":0,\"shg\":0},{\"id\":8483495,\"name\":\"Simon Nemec\",\"pos\":\"D\",\"no\":71,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-6,\"toi\":1250.3333,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8483609,\"name\":\"Adam Klapka\",\"pos\":\"R\",\"no\":43,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":617.6667,\"sog\":3,\"ppg\":0,\"shg\":0},{\"id\":8484180,\"name\":\"Samuel Honzek\",\"pos\":\"L\",\"no\":29,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-2,\"toi\":933.6667,\"sog\":2,\"ppg\":0,\"shg\":0},{\"id\":8484768,\"name\":\"Zayne Parekh\",\"pos\":\"D\",\"no\":19,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-6,\"toi\":1115.3333,\"sog\":7,\"ppg\":0,\"shg\":0},{\"id\":8484860,\"name\":\"Matvei Gridin\",\"pos\":\"R\",\"no\":92,\"gp\":3,\"g\":0,\"a\":1,\"pts\":1,\"pm\":-6,\"toi\":867.3333,\"sog\":5,\"ppg\":0,\"shg\":0},{\"id\":8484958,\"name\":\"Maxim Tsyplakov\",\"pos\":\"R\",\"no\":72,\"gp\":3,\"g\":0,\"a\":0,\"pts\":0,\"pm\":-3,\"toi\":725.3333,\"sog\":1,\"ppg\":0,\"shg\":0}]}"),
	goalies: {
		"NYR": [{
			"id": 8478048,
			"name": "Igor Shesterkin",
			"no": 31,
			"gp": 4,
			"gs": 4,
			"w": 3,
			"sv": .926316,
			"gaa": 1.754752,
			"so": 0
		}, {
			"id": 8482193,
			"name": "Dylan Garand",
			"no": 33,
			"gp": 1,
			"gs": 1,
			"w": 1,
			"sv": 1,
			"gaa": 0,
			"so": 1
		}],
		"EDM": [{
			"id": 8477465,
			"name": "Tristan Jarry",
			"no": 35,
			"gp": 1,
			"gs": 1,
			"w": 0,
			"sv": .73913,
			"gaa": 5.848903,
			"so": 0
		}, {
			"id": 8482221,
			"name": "Devon Levi",
			"no": 27,
			"gp": 3,
			"gs": 3,
			"w": 3,
			"sv": .863014,
			"gaa": 3.346347,
			"so": 0
		}],
		"WPG": [{
			"id": 8479973,
			"name": "Stuart Skinner",
			"no": 74,
			"gp": 3,
			"gs": 3,
			"w": 2,
			"sv": .92,
			"gaa": 2.617944,
			"so": 0
		}, {
			"id": 8483532,
			"name": "Clay Stevenson",
			"no": 33,
			"gp": 1,
			"gs": 1,
			"w": 1,
			"sv": .935484,
			"gaa": 2,
			"so": 0
		}],
		"UTA": [{
			"id": 8478872,
			"name": "Karel Vejmelka",
			"no": 70,
			"gp": 3,
			"gs": 3,
			"w": 2,
			"sv": .913043,
			"gaa": 2.01756,
			"so": 1
		}, {
			"id": 8482657,
			"name": "Sebastian Cossa",
			"no": 33,
			"gp": 1,
			"gs": 1,
			"w": 1,
			"sv": .947368,
			"gaa": 1,
			"so": 0
		}],
		"VGK": [{
			"id": 8478499,
			"name": "Adin Hill",
			"no": 33,
			"gp": 1,
			"gs": 1,
			"w": 1,
			"sv": .9,
			"gaa": 2,
			"so": 0
		}, {
			"id": 8479394,
			"name": "Carter Hart",
			"no": 79,
			"gp": 3,
			"gs": 3,
			"w": 2,
			"sv": .890411,
			"gaa": 2.702449,
			"so": 0
		}],
		"FLA": [{
			"id": 8474593,
			"name": "Jacob Markstrom",
			"no": 25,
			"gp": 3,
			"gs": 3,
			"w": 2,
			"sv": .927273,
			"gaa": 1.27231,
			"so": 1
		}, {
			"id": 8481033,
			"name": "Akira Schmid",
			"no": 40,
			"gp": 1,
			"gs": 1,
			"w": 0,
			"sv": .875,
			"gaa": 3.795467,
			"so": 0
		}],
		"MIN": [{
			"id": 8482661,
			"name": "Jesper Wallstedt",
			"no": 30,
			"gp": 3,
			"gs": 3,
			"w": 2,
			"sv": .933333,
			"gaa": 1.633987,
			"so": 0
		}],
		"CAR": [{
			"id": 8481611,
			"name": "Pyotr Kochetkov",
			"no": 52,
			"gp": 1,
			"gs": 1,
			"w": 1,
			"sv": .888889,
			"gaa": 1.909308,
			"so": 0
		}, {
			"id": 8483548,
			"name": "Brandon Bussi",
			"no": 32,
			"gp": 3,
			"gs": 3,
			"w": 1,
			"sv": .850746,
			"gaa": 3.244705,
			"so": 0
		}],
		"COL": [{
			"id": 8478406,
			"name": "Mackenzie Blackwood",
			"no": 39,
			"gp": 3,
			"gs": 3,
			"w": 2,
			"sv": .894737,
			"gaa": 2.678322,
			"so": 0
		}],
		"WSH": [{
			"id": 8479292,
			"name": "Charlie Lindgren",
			"no": 79,
			"gp": 1,
			"gs": 1,
			"w": 0,
			"sv": .931034,
			"gaa": 2.083333,
			"so": 0
		}, {
			"id": 8480313,
			"name": "Logan Thompson",
			"no": 48,
			"gp": 2,
			"gs": 2,
			"w": 2,
			"sv": .920635,
			"gaa": 2.502433,
			"so": 0
		}],
		"OTT": [{
			"id": 8476999,
			"name": "Linus Ullmark",
			"no": 35,
			"gp": 2,
			"gs": 2,
			"w": 2,
			"sv": .948718,
			"gaa": 1.2,
			"so": 0
		}, {
			"id": 8481035,
			"name": "Samuel Ersson",
			"no": 30,
			"gp": 2,
			"gs": 1,
			"w": 0,
			"sv": .886364,
			"gaa": 3.849444,
			"so": 0
		}],
		"TBL": [{
			"id": 8476883,
			"name": "Andrei Vasilevskiy",
			"no": 88,
			"gp": 3,
			"gs": 3,
			"w": 2,
			"sv": .9,
			"gaa": 2.047005,
			"so": 0
		}],
		"BUF": [{
			"id": 8480045,
			"name": "Ukko-Pekka Luukkonen",
			"no": 1,
			"gp": 2,
			"gs": 2,
			"w": 1,
			"sv": .783784,
			"gaa": 4.029099,
			"so": 0
		}, {
			"id": 8481551,
			"name": "Colten Ellis",
			"no": 92,
			"gp": 1,
			"gs": 1,
			"w": 1,
			"sv": .9,
			"gaa": 1.864319,
			"so": 0
		}],
		"ANA": [{
			"id": 8478024,
			"name": "Ville Husso",
			"no": 33,
			"gp": 1,
			"gs": 0,
			"w": 0,
			"sv": 1,
			"gaa": 0,
			"so": 0
		}, {
			"id": 8480843,
			"name": "Lukas Dostal",
			"no": 1,
			"gp": 3,
			"gs": 3,
			"w": 2,
			"sv": .871795,
			"gaa": 3.671971,
			"so": 0
		}],
		"SJS": [{
			"id": 8482137,
			"name": "Yaroslav Askarov",
			"no": 30,
			"gp": 3,
			"gs": 3,
			"w": 2,
			"sv": .862069,
			"gaa": 3.863697,
			"so": 0
		}],
		"SEA": [{
			"id": 8475831,
			"name": "Philipp Grubauer",
			"no": 31,
			"gp": 2,
			"gs": 1,
			"w": 0,
			"sv": .90625,
			"gaa": 2.275601,
			"so": 0
		}, {
			"id": 8478916,
			"name": "Joey Daccord",
			"no": 35,
			"gp": 3,
			"gs": 3,
			"w": 2,
			"sv": .911392,
			"gaa": 2.635156,
			"so": 0
		}],
		"PIT": [{
			"id": 8481668,
			"name": "Arturs Silovs",
			"no": 37,
			"gp": 3,
			"gs": 3,
			"w": 2,
			"sv": .859155,
			"gaa": 3.378061,
			"so": 1
		}, {
			"id": 8483703,
			"name": "Sergei Murashov",
			"no": 1,
			"gp": 1,
			"gs": 1,
			"w": 0,
			"sv": .914286,
			"gaa": 3.136799,
			"so": 0
		}],
		"VAN": [{
			"id": 8480947,
			"name": "Kevin Lankinen",
			"no": 32,
			"gp": 3,
			"gs": 3,
			"w": 1,
			"sv": .823529,
			"gaa": 6.5048,
			"so": 0
		}, {
			"id": 8482447,
			"name": "Leevi Meriläinen",
			"no": 31,
			"gp": 2,
			"gs": 1,
			"w": 1,
			"sv": .942857,
			"gaa": 1.323286,
			"so": 0
		}],
		"TOR": [{
			"id": 8475683,
			"name": "Sergei Bobrovsky",
			"no": 72,
			"gp": 2,
			"gs": 2,
			"w": 0,
			"sv": .886792,
			"gaa": 3.061658,
			"so": 0
		}, {
			"id": 8476932,
			"name": "Anthony Stolarz",
			"no": 41,
			"gp": 2,
			"gs": 2,
			"w": 2,
			"sv": .903846,
			"gaa": 2.436383,
			"so": 0
		}],
		"BOS": [{
			"id": 8480022,
			"name": "Michael DiPietro",
			"no": 30,
			"gp": 1,
			"gs": 1,
			"w": 0,
			"sv": .896552,
			"gaa": 3.109703,
			"so": 0
		}, {
			"id": 8480280,
			"name": "Jeremy Swayman",
			"no": 1,
			"gp": 3,
			"gs": 3,
			"w": 2,
			"sv": .91358,
			"gaa": 2.302421,
			"so": 1
		}],
		"MTL": [{
			"id": 8482487,
			"name": "Jakub Dobes",
			"no": 75,
			"gp": 3,
			"gs": 3,
			"w": 1,
			"sv": .855556,
			"gaa": 4.434758,
			"so": 0
		}],
		"NSH": [{
			"id": 8477424,
			"name": "Juuse Saros",
			"no": 74,
			"gp": 3,
			"gs": 3,
			"w": 1,
			"sv": .907216,
			"gaa": 2.95324,
			"so": 0
		}],
		"CBJ": [{
			"id": 8482982,
			"name": "Jet Greaves",
			"no": 73,
			"gp": 2,
			"gs": 2,
			"w": 1,
			"sv": .877193,
			"gaa": 3.5,
			"so": 0
		}],
		"NYI": [{
			"id": 8473575,
			"name": "Semyon Varlamov",
			"no": 40,
			"gp": 1,
			"gs": 1,
			"w": 0,
			"sv": .863636,
			"gaa": 3.028603,
			"so": 0
		}, {
			"id": 8478009,
			"name": "Ilya Sorokin",
			"no": 30,
			"gp": 2,
			"gs": 2,
			"w": 1,
			"sv": .968254,
			"gaa": 1.017524,
			"so": 1
		}],
		"DAL": [{
			"id": 8479193,
			"name": "Casey DeSmith",
			"no": 1,
			"gp": 1,
			"gs": 1,
			"w": 0,
			"sv": .923077,
			"gaa": 2.054795,
			"so": 0
		}, {
			"id": 8479979,
			"name": "Jake Oettinger",
			"no": 29,
			"gp": 2,
			"gs": 2,
			"w": 1,
			"sv": .942857,
			"gaa": 1.014513,
			"so": 1
		}],
		"DET": [{
			"id": 8476434,
			"name": "John Gibson",
			"no": 36,
			"gp": 3,
			"gs": 3,
			"w": 1,
			"sv": .902778,
			"gaa": 2.384783,
			"so": 0
		}],
		"STL": [{
			"id": 8476412,
			"name": "Jordan Binnington",
			"no": 50,
			"gp": 1,
			"gs": 1,
			"w": 0,
			"sv": .833333,
			"gaa": 6,
			"so": 0
		}, {
			"id": 8480981,
			"name": "Joel Hofer",
			"no": 30,
			"gp": 2,
			"gs": 2,
			"w": 1,
			"sv": .954545,
			"gaa": 1.014942,
			"so": 1
		}],
		"NJD": [{
			"id": 8474596,
			"name": "Jake Allen",
			"no": 34,
			"gp": 2,
			"gs": 2,
			"w": 1,
			"sv": .875,
			"gaa": 3.474903,
			"so": 0
		}, {
			"id": 8482076,
			"name": "Nico Daws",
			"no": 50,
			"gp": 1,
			"gs": 1,
			"w": 0,
			"sv": .8125,
			"gaa": 6.013363,
			"so": 0
		}],
		"CHI": [{
			"id": 8481519,
			"name": "Spencer Knight",
			"no": 30,
			"gp": 3,
			"gs": 3,
			"w": 1,
			"sv": .89011,
			"gaa": 3.355705,
			"so": 0
		}, {
			"id": 8482821,
			"name": "Arvid Soderblom",
			"no": 40,
			"gp": 1,
			"gs": 1,
			"w": 0,
			"sv": .8125,
			"gaa": 6,
			"so": 0
		}],
		"PHI": [{
			"id": 8478435,
			"name": "Dan Vladar",
			"no": 80,
			"gp": 2,
			"gs": 2,
			"w": 0,
			"sv": .863014,
			"gaa": 5.124555,
			"so": 0
		}, {
			"id": 8479361,
			"name": "Joseph Woll",
			"no": 53,
			"gp": 2,
			"gs": 2,
			"w": 0,
			"sv": .928571,
			"gaa": 2.865862,
			"so": 0
		}],
		"LAK": [{
			"id": 8475311,
			"name": "Darcy Kuemper",
			"no": 35,
			"gp": 2,
			"gs": 2,
			"w": 0,
			"sv": .830508,
			"gaa": 5.11291,
			"so": 0
		}, {
			"id": 8476341,
			"name": "Anton Forsberg",
			"no": 31,
			"gp": 1,
			"gs": 1,
			"w": 0,
			"sv": .8,
			"gaa": 4.772004,
			"so": 0
		}],
		"CGY": [{
			"id": 8481692,
			"name": "Dustin Wolf",
			"no": 32,
			"gp": 2,
			"gs": 2,
			"w": 0,
			"sv": .79661,
			"gaa": 6.008345,
			"so": 0
		}, {
			"id": 8482445,
			"name": "Devin Cooley",
			"no": 1,
			"gp": 1,
			"gs": 1,
			"w": 0,
			"sv": .88,
			"gaa": 3.011712,
			"so": 0
		}]
	}
};
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var refreshLeague = createServerFn({ method: "GET" }).handler(createSsrRpc("7e6aed5e96cb1255b10a335ec3bbb006704811037f21a4991df023e2144a9cd8"));
var refreshClub = createServerFn({ method: "POST" }).validator((abbrev) => {
	const clean = abbrev.toUpperCase();
	if (!/^[A-Z]{2,4}$/.test(clean)) throw new Error("Unknown club");
	return clean;
}).handler(createSsrRpc("e479f52be1dcc5c836803e756abe71c5a4f4226dcaa2d773d2c4f04733980805"));
var BOARDS = [
	{
		id: "overall",
		label: "Overall",
		stat: "PTS",
		blurb: "The NHL table, best to worst."
	},
	{
		id: "offense",
		label: "Offense",
		stat: "GF/GP",
		blurb: "Who scores the most per night."
	},
	{
		id: "defense",
		label: "Defense",
		stat: "GA/GP",
		blurb: "Who gives up the least."
	},
	{
		id: "pk",
		label: "Penalty kill",
		stat: "PK%",
		blurb: "Best at killing penalties."
	},
	{
		id: "pp",
		label: "Power play",
		stat: "PP%",
		blurb: "Best with the extra attacker."
	},
	{
		id: "diff",
		label: "Goal diff",
		stat: "DIFF",
		blurb: "Goals scored minus goals allowed."
	},
	{
		id: "form",
		label: "Last 10",
		stat: "L10",
		blurb: "Points over the latest games."
	},
	{
		id: "shots",
		label: "Shot share",
		stat: "SAT%",
		blurb: "Who is directing the play."
	},
	{
		id: "faceoff",
		label: "Faceoffs",
		stat: "FO%",
		blurb: "Who wins the draws."
	},
	{
		id: "home",
		label: "Home",
		stat: "HOME",
		blurb: "Points pace in their own barn."
	},
	{
		id: "road",
		label: "Road",
		stat: "ROAD",
		blurb: "Points pace away from home."
	}
];
var STATS = {
	PTS: {
		title: "Points",
		body: "The standings currency. A win is worth 2 points. An overtime or shootout loss is still worth 1. A regulation loss is worth 0. Most points sits first."
	},
	GP: {
		title: "Games played",
		body: "How many games count in these numbers. Early in the year a hot team can be a tiny sample, so check games played before you crown anyone."
	},
	"W-L-OTL": {
		title: "Record",
		body: "Wins, regulation losses, and overtime or shootout losses. That last number still earned a point. Read 4-1-0 as four wins and one regulation loss."
	},
	"P%": {
		title: "Points percentage",
		body: "Points divided by the maximum available, which is 2 per game. It lets you compare clubs that have not played the same number of games. .650 is a strong pace. .500 is average."
	},
	GF: {
		title: "Goals for",
		body: "Total goals this team has scored. A raw total, so a team with more games can look better than it is. Pair it with goals per game."
	},
	GA: {
		title: "Goals against",
		body: "Total goals this team has allowed. Lower is better. Goalies, defense, and just plain luck all live in this number."
	},
	DIFF: {
		title: "Goal differential",
		body: "Goals scored minus goals allowed. A plus team is outscoring opponents. When points are tied, differential is a common tiebreaker because it measures how they got those points."
	},
	"GF/GP": {
		title: "Goals for per game",
		body: "Scoring rate. How many goals this club scores on a typical night. The best offenses usually live above 3.30. This is the Offense board."
	},
	"GA/GP": {
		title: "Goals against per game",
		body: "How many goals this club gives up per night. Lower is a better defense. Under 2.70 is stingy. This is the Defense board, ranked from least to most."
	},
	"PP%": {
		title: "Power play percentage",
		body: "When the other team takes a penalty, you skate with an extra player. Power-play percentage is how often you score on those chances. About 20% is league average. Above 25% is a weapon."
	},
	"PK%": {
		title: "Penalty kill percentage",
		body: "When you take a penalty, you skate short-handed. Penalty-kill percentage is how often you stop the other team from scoring. About 80% is average. The Penalty Kill board ranks this from best to worst."
	},
	ROW: {
		title: "Regulation and overtime wins",
		body: "Wins that did not need a shootout. A shootout is closer to a coin flip, so the league uses regulation wins as a tiebreaker when points are even."
	},
	L10: {
		title: "Last 10 games",
		body: "Points earned in the last 10 games, or fewer if the season just started. A full-season table can hide a team that just got hot, or one that is sliding."
	},
	STREAK: {
		title: "Streak",
		body: "The current run. W3 means three wins in a row. L2 means two losses in a row. Overtime losses count as losses on the streak."
	},
	"SAT%": {
		title: "Shot-attempt share",
		body: "Also called Corsi. The share of shot attempts (shots, misses, and blocks) this team takes at even strength. Above 50% means they are playing more in the other end. It is a possession clue, not the score."
	},
	"FO%": {
		title: "Faceoff win percentage",
		body: "How often the team wins the puck drop. It helps in your own zone and on the power play. It is not the same thing as winning the game."
	},
	"SV%": {
		title: "Save percentage",
		body: "Shots a goalie stops, divided by shots faced. .900 is playable, .910 is solid, .920 and up is excellent. One soft goal swings this a lot in October."
	},
	GAA: {
		title: "Goals-against average",
		body: "Goals allowed per 60 minutes. Lower is better. It depends on the team in front of the goalie, not just the goalie."
	},
	"+/-": {
		title: "Plus-minus",
		body: "The skater is plus-1 when on the ice for an even-strength or short-handed goal for, and minus-1 for one against. Linemates and role change it, so read it next to ice time."
	},
	TOI: {
		title: "Time on ice",
		body: "Average minutes per game. Coaches give trusted players more of the night. Line projections here lean on ice time plus points, not on rumors."
	},
	WIN: {
		title: "Win probability",
		body: "Taken from the listed American moneyline, then the sportsbook's cut is removed so the two sides add up to 100%. A 60% side is a clear favorite, not a promise. Goalies and injuries can move it before puck drop."
	},
	HOME: {
		title: "Home points pace",
		body: "Points percentage in home games only. Some clubs are a different team in their own building. A short home sample can look extreme."
	},
	ROAD: {
		title: "Road points pace",
		body: "Points percentage away from home. Travel, the last change, and the crowd all make the road harder. This board ranks who still collects points on the road."
	},
	HITS: {
		title: "Hits",
		body: "Body checks the team has thrown. A style stat. More hits does not mean a better team. Some fast clubs barely finish checks."
	},
	BLK: {
		title: "Blocked shots",
		body: "Shot attempts this team has gotten in the way of. A mark of shot-blocking commitment, often from the penalty kill and a team protecting a lead."
	}
};
var DIV_ORDER = [
	"Atlantic",
	"Metropolitan",
	"Central",
	"Pacific"
];
function divisionOrder(name) {
	const i = DIV_ORDER.indexOf(name);
	return i === -1 ? 9 : i;
}
function record(t) {
	return `${t.w}-${t.l}-${t.otl}`;
}
function pct(n, digits = 1) {
	if (n == null || Number.isNaN(n)) return "—";
	return `${(n * 100).toFixed(digits)}%`;
}
function pace(pts, gp) {
	if (!gp) return null;
	return pts / (gp * 2);
}
function perGame(total, gp) {
	if (!gp) return null;
	return total / gp;
}
function fmtRate(n, digits = 2) {
	if (n == null || Number.isNaN(n)) return "—";
	return n.toFixed(digits);
}
function signed(n) {
	if (n > 0) return `+${n}`;
	return String(n);
}
function fmtToi(seconds) {
	if (!seconds) return "0:00";
	const m = Math.floor(seconds / 60);
	const s = Math.round(seconds % 60);
	return `${m}:${String(s).padStart(2, "0")}`;
}
function fmtWhen(iso) {
	if (!iso) return "TBD";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "TBD";
	return `${new Intl.DateTimeFormat("en-US", {
		timeZone: "America/New_York",
		weekday: "short",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	}).format(d)} ET`;
}
function shortDay(iso, today) {
	if (iso === today) return "Today";
	const [y, m, d] = iso.split("-").map(Number);
	return new Date(y, m - 1, d).toLocaleDateString("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric"
	});
}
function americanToRaw(odds) {
	if (odds < 0) return -odds / (-odds + 100);
	return 100 / (odds + 100);
}
function fairProb(game) {
	if (game.away.odds == null || game.home.odds == null) return null;
	const a = americanToRaw(game.away.odds);
	const h = americanToRaw(game.home.odds);
	const s = a + h;
	if (!s) return null;
	return {
		away: a / s,
		home: h / s
	};
}
function moneyline(odds) {
	if (odds == null) return "—";
	return odds > 0 ? `+${odds}` : String(odds);
}
function scoreTeam(t, board, prior, usePrior) {
	if (usePrior) {
		if (!prior) return null;
		if (board === "overall") return prior.seq;
		if (board === "offense") return perGame(prior.gf, prior.gp);
		if (board === "defense") return perGame(prior.ga, prior.gp);
		if (board === "diff") return prior.gp ? prior.gf - prior.ga : null;
		if (board === "form") return prior.l10Pts;
		if (board === "home") return pace(prior.homePts, prior.homeGp);
		if (board === "road") return pace(prior.roadPts, prior.roadGp);
		return null;
	}
	if (board === "overall") return t.seq;
	if (board === "offense") return perGame(t.gf, t.gp);
	if (board === "defense") return perGame(t.ga, t.gp);
	if (board === "pk") return t.pk;
	if (board === "pp") return t.pp;
	if (board === "diff") return t.diff;
	if (board === "form") return t.l10Pts;
	if (board === "shots") return t.sat;
	if (board === "faceoff") return t.fo;
	if (board === "home") return pace(t.homePts, t.homeGp);
	if (board === "road") return pace(t.roadPts, t.roadGp);
	return null;
}
var LOW = /* @__PURE__ */ new Set(["overall", "defense"]);
function rankBoard(teams, board, prior) {
	const scored = teams.map((team) => ({
		team,
		value: scoreTeam(team, board, prior?.[team.abbrev], Boolean(prior)),
		better: LOW.has(board) ? "low" : "high"
	}));
	scored.sort((a, b) => {
		if (a.value == null && b.value == null) return a.team.seq - b.team.seq;
		if (a.value == null) return 1;
		if (b.value == null) return -1;
		if (a.value !== b.value) return a.better === "low" ? a.value - b.value : b.value - a.value;
		if (board === "overall") return b.team.rw - a.team.rw || b.team.diff - a.team.diff;
		return a.team.seq - b.team.seq;
	});
	return scored.map((s, i) => ({
		team: s.team,
		rank: i + 1,
		value: s.value
	}));
}
function boardValueLabel(board, team) {
	if (board === "overall") return `${team.pts} pts`;
	if (board === "offense") return fmtRate(perGame(team.gf, team.gp));
	if (board === "defense") return fmtRate(perGame(team.ga, team.gp));
	if (board === "pk") return pct(team.pk);
	if (board === "pp") return pct(team.pp);
	if (board === "diff") return signed(team.diff);
	if (board === "form") return `${team.l10Pts} pts`;
	if (board === "shots") return pct(team.sat);
	if (board === "faceoff") return pct(team.fo);
	if (board === "home") return pct(pace(team.homePts, team.homeGp));
	return pct(pace(team.roadPts, team.roadGp));
}
function movement(teams, board, prior) {
	const now = rankBoard(teams, board);
	const out = {};
	if (!prior || !Object.keys(prior).length) {
		for (const row of now) out[row.team.abbrev] = null;
		return out;
	}
	const then = rankBoard(teams, board, prior);
	const thenRank = new Map(then.map((r) => [r.team.abbrev, r.rank]));
	for (const row of now) {
		const prev = thenRank.get(row.team.abbrev);
		if (prev == null || then.find((t) => t.team.abbrev === row.team.abbrev)?.value == null) out[row.team.abbrev] = null;
		else out[row.team.abbrev] = prev - row.rank;
	}
	return out;
}
var SCRATCH = /out|injured reserve|\bir\b|ltir|season/i;
function slot(p, note) {
	return {
		id: p.id,
		name: p.name,
		pos: p.pos,
		no: p.no,
		note
	};
}
function injuredMatch(name, injuries) {
	const n = norm(name);
	return injuries.find((i) => {
		const p = norm(i.player);
		return p === n || n.endsWith(p) || p.endsWith(n);
	});
}
function norm(s) {
	return s.toLowerCase().replace(/[^a-z\s]/g, "").replace(/\s+/g, " ").trim();
}
function projectLineup(skaters, goalies, injuries) {
	const flagged = injuries.map((i) => ({
		name: i.player,
		status: i.status
	}));
	const isScratch = (name) => {
		const hit = injuredMatch(name, injuries);
		return hit ? SCRATCH.test(hit.status) : false;
	};
	const pool = skaters.filter((s) => s.pos !== "G" && !isScratch(s.name));
	const score = (s) => s.pts * 4 + s.toi / 60 + s.g * .5;
	const forwards = pool.filter((s) => s.pos !== "D").sort((a, b) => score(b) - score(a) || b.toi - a.toi);
	const defense = pool.filter((s) => s.pos === "D").sort((a, b) => b.toi - a.toi || score(b) - score(a));
	const centers = [];
	const wings = [];
	for (const f of forwards) if (f.pos === "C") centers.push(f);
	else wings.push(f);
	const used = /* @__PURE__ */ new Set();
	const lines = [];
	for (let i = 0; i < 4; i++) {
		const c = centers.find((p) => !used.has(p.id)) ?? wings.find((p) => !used.has(p.id));
		if (!c) break;
		used.add(c.id);
		const ws = [];
		for (const w of wings) {
			if (used.has(w.id)) continue;
			ws.push(w);
			used.add(w.id);
			if (ws.length === 2) break;
		}
		if (ws.length < 2) {
			const extra = forwards.find((p) => !used.has(p.id));
			if (extra) {
				ws.push(extra);
				used.add(extra.id);
			}
		}
		const players = [c, ...ws];
		const names = players.map((p) => p.name.split(" ").slice(-1)[0]).join(" · ");
		lines.push({
			label: `Line ${i + 1}`,
			players: players.map((p) => slot(p, p.id === c.id ? `${p.pts} pts · ${fmtToi(p.toi)}` : `${p.pts} pts`)),
			why: `${names}. ${c.name.split(" ").slice(-1)[0]} takes the middle${c.pos === "C" ? " as a natural center" : " because the center depth is thin"} with ${c.pts} points in ${c.gp} games and ${fmtToi(c.toi)} a night.`
		});
	}
	const pairs = [];
	const pairNames = [
		"Top pair",
		"Second pair",
		"Third pair"
	];
	for (let i = 0; i < 3; i++) {
		const a = defense[i * 2];
		const b = defense[i * 2 + 1];
		if (!a) break;
		const players = [a, b].filter(Boolean);
		pairs.push({
			label: pairNames[i],
			players: players.map((p) => slot(p, fmtToi(p.toi))),
			why: players.map((p) => `${p.name.split(" ").slice(-1)[0]} at ${fmtToi(p.toi)}`).join(" with ") + ". Pairs follow even-strength minutes, heaviest first, not the power-play units."
		});
	}
	const sortedG = [...goalies].filter((g) => !isScratch(g.name)).sort((a, b) => b.gs - a.gs || b.gp - a.gp);
	const starter = sortedG[0];
	const backup = sortedG[1] ?? null;
	const scratchedNames = injuries.filter((i) => SCRATCH.test(i.status)).map((i) => i.player);
	const scratchLabel = scratchedNames.length === 0 ? "Nobody on the current injury wire is a hard scratch, so the ice-time leaders stay in." : `${scratchedNames.slice(0, 5).join(", ")}${scratchedNames.length > 5 ? ` and ${scratchedNames.length - 5} more` : ""} ${scratchedNames.length === 1 ? "is" : "are"} off the card because the injury wire lists them out.`;
	return {
		lines,
		pairs,
		starter: starter ? {
			...starter,
			why: `${starter.name} gets the nod with ${starter.gs || starter.gp} starts${starter.sv != null ? ` and a ${pct(starter.sv)} save rate` : ""}. The other goalie is the backup unless the club has already announced a switch.`
		} : null,
		backup,
		flagged,
		why: `This is a projected card, not the morning skate. Forwards are ordered by points, then ice time. Centers stay at center when the roster allows. Defense is paired by average minutes. ${scratchLabel} Day-to-day players stay in and are flagged.`
	};
}
function nextGameFor(games, abbrev, today) {
	return games.filter((g) => g.date >= today && (g.away.abbrev === abbrev || g.home.abbrev === abbrev)).sort((a, b) => a.start.localeCompare(b.start))[0];
}
var seed = nhl_default;
var LeagueContext = (0, import_react.createContext)(null);
function useLeague() {
	const ctx = (0, import_react.useContext)(LeagueContext);
	if (!ctx) throw new Error("League missing");
	return ctx;
}
var FavContext = (0, import_react.createContext)(null);
function useFav() {
	const ctx = (0, import_react.useContext)(FavContext);
	if (!ctx) throw new Error("Favourite missing");
	return ctx;
}
var InfoContext = (0, import_react.createContext)(() => {});
function useInfo() {
	return (0, import_react.useContext)(InfoContext);
}
var FAV_KEY = "rinkboard-fav";
function Providers({ children }) {
	const [data, setData] = (0, import_react.useState)(seed);
	const [status, setStatus] = (0, import_react.useState)("snapshot");
	const [fav, setFavState] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [stat, setStat] = (0, import_react.useState)(null);
	const refresh = (0, import_react.useCallback)(() => {
		setStatus((s) => s === "updating" ? s : "updating");
		refreshLeague().then((live) => {
			if (!live || live.teams.length < 32) {
				setStatus("offline");
				return;
			}
			setData((prev) => ({
				...live,
				skaters: Object.keys(live.skaters).length ? live.skaters : prev.skaters,
				goalies: Object.keys(live.goalies).length ? live.goalies : prev.goalies
			}));
			setStatus("live");
		}).catch(() => setStatus("offline"));
	}, []);
	const loadClub = (0, import_react.useCallback)((abbrev) => {
		refreshClub({ data: abbrev }).then((club) => {
			if (!club.skaters.length && !club.goalies.length) return;
			setData((prev) => ({
				...prev,
				skaters: {
					...prev.skaters,
					[abbrev]: club.skaters
				},
				goalies: {
					...prev.goalies,
					[abbrev]: club.goalies
				}
			}));
		}).catch(() => {});
	}, []);
	(0, import_react.useEffect)(() => {
		const saved = localStorage.getItem(FAV_KEY);
		if (saved && seed.teams.some((t) => t.abbrev === saved)) setFavState(saved);
		setReady(true);
		refresh();
	}, [refresh]);
	const setFav = (0, import_react.useCallback)((abbrev) => {
		setFavState(abbrev);
		if (abbrev) localStorage.setItem(FAV_KEY, abbrev);
		else localStorage.removeItem(FAV_KEY);
	}, []);
	const league = (0, import_react.useMemo)(() => ({
		data,
		status,
		refresh,
		loadClub
	}), [
		data,
		status,
		refresh,
		loadClub
	]);
	const copy = stat ? STATS[stat] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeagueContext.Provider, {
		value: league,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FavContext.Provider, {
			value: {
				fav,
				ready,
				setFav
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(InfoContext.Provider, {
				value: setStat,
				children: [children, copy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sheet-root",
					role: "presentation",
					onClick: () => setStat(null),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sheet",
						role: "dialog",
						"aria-modal": "true",
						"aria-labelledby": "stat-title",
						onClick: (e) => e.stopPropagation(),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "sheet-handle" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "For new fans"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								id: "stat-title",
								children: copy.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "sheet-body",
								children: copy.body
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn-block",
								onClick: () => setStat(null),
								children: "Got it"
							})
						]
					})
				}) : null]
			})
		})
	});
}
var styles_default = "/assets/styles-BX3hXxI6.css";
var APP_NAME = "Rinkboard";
var Route$6 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "NHL 32-team progress tracker. Overall, offense, defense, and special-teams ranks, a three-day slate, win odds, projected lineups, and injuries."
			},
			{
				name: "theme-color",
				content: "#07131c"
			},
			{
				name: "mobile-web-app-capable",
				content: "yes"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Source+Sans+3:wght@400;600;700&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Providers, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$5 = () => import("./routes-DkHteN_a.mjs");
var Route$5 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./injuries-CJffE-Ua.mjs");
var Route$4 = createFileRoute("/injuries")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./ranks-C04VGXaG.mjs");
var Route$3 = createFileRoute("/ranks")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./schedule-BBxabLj5.mjs");
var Route$2 = createFileRoute("/schedule")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./game._id-Cni1GaHC.mjs");
var Route$1 = createFileRoute("/game/$id")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./team._abbr-F7cEoIpb.mjs");
var Route = createFileRoute("/team/$abbr")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$5.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$6
	}),
	InjuriesRoute: Route$4.update({
		id: "/injuries",
		path: "/injuries",
		getParentRoute: () => Route$6
	}),
	RanksRoute: Route$3.update({
		id: "/ranks",
		path: "/ranks",
		getParentRoute: () => Route$6
	}),
	ScheduleRoute: Route$2.update({
		id: "/schedule",
		path: "/schedule",
		getParentRoute: () => Route$6
	}),
	GameIdRoute: Route$1.update({
		id: "/game/$id",
		path: "/game/$id",
		getParentRoute: () => Route$6
	}),
	TeamAbbrRoute: Route.update({
		id: "/team/$abbr",
		path: "/team/$abbr",
		getParentRoute: () => Route$6
	})
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { shortDay as C, record as S, pace as _, useInfo as a, projectLineup as b, STATS as c, fairProb as d, fmtRate as f, nextGameFor as g, movement as h, useFav as i, boardValueLabel as l, moneyline as m, Route as n, useLeague as o, fmtWhen as p, Route$1 as r, BOARDS as s, router_exports as t, divisionOrder as u, pct as v, signed as w, rankBoard as x, perGame as y };
