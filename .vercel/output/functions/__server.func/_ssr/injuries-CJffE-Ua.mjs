import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useFav, o as useLeague } from "./router-B4AT-FTg.mjs";
import { t as Shell } from "./shell-DB4Uh-Wv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/injuries-CJffE-Ua.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Injuries() {
	const { data } = useLeague();
	const { fav } = useFav();
	const [q, setQ] = (0, import_react.useState)("");
	const [onlyFav, setOnlyFav] = (0, import_react.useState)(false);
	const rows = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		return data.injuries.filter((i) => {
			if (onlyFav && fav && i.abbrev !== fav) return false;
			if (!query) return true;
			const team = data.teams.find((t) => t.abbrev === i.abbrev);
			return i.player.toLowerCase().includes(query) || i.status.toLowerCase().includes(query) || i.detail.toLowerCase().includes(query) || (team?.common.toLowerCase().includes(query) ?? false) || i.abbrev.toLowerCase().includes(query);
		});
	}, [
		data,
		fav,
		onlyFav,
		q
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "section-head",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Injury wire" })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "legend",
			children: [data.injuries.length, " listings across the league. Out and injured reserve come off the projected lineup. Day-to-day stays on the card and gets a flag."]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "chips",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: !onlyFav ? "chip is-on" : "chip",
				onClick: () => setOnlyFav(false),
				children: "All clubs"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: onlyFav ? "chip is-on" : "chip",
				onClick: () => setOnlyFav(true),
				disabled: !fav,
				children: fav ? `${fav} only` : "Pick a club first"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: "search",
			value: q,
			onChange: (e) => setQ(e.target.value),
			placeholder: "Player, team, or injury",
			"aria-label": "Filter injuries"
		}),
		rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "muted-block",
			children: "No listings match."
		}) : null,
		rows.map((i) => {
			const team = data.teams.find((t) => t.abbrev === i.abbrev);
			const hard = /out|reserve|ir|ltir|season/i.test(i.status);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/team/$abbr",
				params: { abbr: i.abbrev },
				className: "injury",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: hard ? "tag hard" : "tag",
						children: i.status
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [i.player, i.pos ? ` · ${i.pos}` : ""] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						team?.common ?? i.abbrev,
						" · ",
						i.detail,
						i.note ? ` — ${i.note}` : ""
					] })
				]
			}, `${i.abbrev}-${i.player}`);
		})
	] });
}
//#endregion
export { Injuries as component };
