import { x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as fairProb, m as moneyline, o as useLeague, p as fmtWhen } from "./router-B4AT-FTg.mjs";
import { r as TeamMark } from "./marks-741WmyKR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/game-row-D5UQvwIC.js
var import_jsx_runtime = require_jsx_runtime();
function GameRow({ game }) {
	const { data } = useLeague();
	const team = (abbr) => data.teams.find((t) => t.abbrev === abbr);
	const away = team(game.away.abbrev);
	const home = team(game.home.abbrev);
	const prob = fairProb(game);
	const live = game.state === "live";
	const final = game.state === "final";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/game/$id",
		params: { id: String(game.id) },
		className: "game-row",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "game-meta",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: final ? "Final" : live ? "Live" : fmtWhen(game.start) }), game.networks[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: game.networks[0] }) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Side, {
				abbrev: game.away.abbrev,
				name: away?.common ?? game.away.abbrev,
				logo: away?.logo,
				score: final || live ? game.away.score : null,
				odds: moneyline(game.away.odds),
				pct: prob ? Math.round(prob.away * 100) : null,
				lead: prob ? prob.away >= prob.home : false
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Side, {
				abbrev: game.home.abbrev,
				name: home?.common ?? game.home.abbrev,
				logo: home?.logo,
				score: final || live ? game.home.score : null,
				odds: moneyline(game.home.odds),
				pct: prob ? Math.round(prob.home * 100) : null,
				lead: prob ? prob.home > prob.away : false
			}),
			!final && prob ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "prob",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: `${Math.round(prob.away * 100)}%` } })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "venue",
				children: game.venue
			})
		]
	});
}
function Side({ abbrev, name, logo, score, odds, pct, lead }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: lead ? "side is-lead" : "side",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamMark, {
				abbrev,
				logo,
				size: "sm"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "side-name",
				children: name
			}),
			score != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
				className: "score",
				children: score
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "odds",
				children: pct != null ? `${pct}%` : odds
			})
		]
	});
}
//#endregion
export { GameRow as t };
