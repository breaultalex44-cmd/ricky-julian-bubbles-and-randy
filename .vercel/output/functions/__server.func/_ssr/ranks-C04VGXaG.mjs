import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as record, c as STATS, h as movement, l as boardValueLabel, o as useLeague, s as BOARDS, x as rankBoard } from "./router-B4AT-FTg.mjs";
import { t as Shell } from "./shell-DB4Uh-Wv.mjs";
import { n as Move, r as TeamMark, t as InfoBtn } from "./marks-741WmyKR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ranks-C04VGXaG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HISTORICAL = /* @__PURE__ */ new Set([
	"overall",
	"offense",
	"defense",
	"diff",
	"form",
	"home",
	"road"
]);
function Ranks() {
	const { data } = useLeague();
	const [board, setBoard] = (0, import_react.useState)("overall");
	const [conf, setConf] = (0, import_react.useState)("All");
	const [q, setQ] = (0, import_react.useState)("");
	const meta = BOARDS.find((b) => b.id === board) ?? BOARDS[0];
	const infoId = board === "overall" ? "PTS" : board === "offense" ? "GF/GP" : board === "defense" ? "GA/GP" : board === "pk" ? "PK%" : board === "pp" ? "PP%" : board === "diff" ? "DIFF" : board === "form" ? "L10" : board === "shots" ? "SAT%" : board === "faceoff" ? "FO%" : board === "home" ? "HOME" : "ROAD";
	const rows = (0, import_react.useMemo)(() => {
		const prior = HISTORICAL.has(board) ? data.priorCycle : void 0;
		const moves = movement(data.teams, board, prior);
		const query = q.trim().toLowerCase();
		return rankBoard(data.teams, board).filter((r) => {
			if (conf !== "All" && r.team.conference !== conf) return false;
			if (!query) return true;
			return r.team.name.toLowerCase().includes(query) || r.team.abbrev.toLowerCase().includes(query);
		}).map((r) => ({
			...r,
			delta: moves[r.team.abbrev] ?? null
		}));
	}, [
		board,
		conf,
		data,
		q
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "chips",
			role: "tablist",
			"aria-label": "Ranking boards",
			children: BOARDS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: b.id === board ? "chip is-on" : "chip",
				onClick: () => setBoard(b.id),
				children: b.label
			}, b.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "section-head",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
				meta.label,
				" · ",
				meta.stat
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoBtn, {
				id: infoId,
				label: STATS[infoId]?.title ?? meta.stat
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "legend",
			children: [
				meta.blurb,
				" ",
				HISTORICAL.has(board) ? `Arrows are spots gained or lost since the ${data.cycleLock} lock. Next lock is ${data.nextLock}.` : "This board is live. A dash means there is no two-day snapshot yet, so the move is not invented."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "chips",
			"aria-label": "Conference",
			children: [
				"All",
				"Eastern",
				"Western"
			].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: c === conf ? "chip is-on" : "chip",
				onClick: () => setConf(c),
				children: c === "All" ? "All 32" : c
			}, c))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: "search",
			value: q,
			onChange: (e) => setQ(e.target.value),
			placeholder: "Find a club",
			"aria-label": "Filter clubs"
		}),
		rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "muted-block",
			children: "Nobody matches that filter."
		}) : null,
		rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/team/$abbr",
			params: { abbr: r.team.abbrev },
			className: "rank-row",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rank-no",
					children: r.rank
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Move, { n: r.delta }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamMark, {
					abbrev: r.team.abbrev,
					logo: r.team.logo,
					size: "sm"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "rank-name",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: r.team.common }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("em", { children: [
						record(r.team),
						" · ",
						r.team.gp,
						" GP"
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rank-val",
					children: boardValueLabel(board, r.team)
				})
			]
		}, r.team.abbrev))
	] });
}
//#endregion
export { Ranks as component };
