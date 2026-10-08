import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as projectLineup, o as useLeague, v as pct } from "./router-B4AT-FTg.mjs";
import { t as InfoBtn } from "./marks-741WmyKR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lineup-card-LbUgECoA.js
var import_jsx_runtime = require_jsx_runtime();
function LineupCard({ abbrev }) {
	const { data } = useLeague();
	const injuries = data.injuries.filter((i) => i.abbrev === abbrev);
	const projected = projectLineup(data.skaters[abbrev] ?? [], data.goalies[abbrev] ?? [], injuries);
	if (!projected.lines.length && !projected.starter) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "muted-block",
		children: "Roster card is still syncing for this club."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "stack",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "section-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Projected lineup" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoBtn, {
					id: "TOI",
					label: "time on ice"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "prose",
				children: projected.why
			}),
			projected.lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "unit",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: line.label }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: line.players.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num",
							children: p.no ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "who",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: p.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("em", { children: [
								p.pos,
								" · ",
								p.note
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
							name: p.name,
							injuries
						})
					] }, p.id)) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: line.why })
				]
			}, line.label)),
			projected.pairs.map((pair) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "unit",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: pair.label }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: pair.players.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "num",
						children: p.no ?? "—"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "who",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: p.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("em", { children: ["D · ", p.note] })]
					})] }, p.id)) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: pair.why })
				]
			}, pair.label)),
			projected.starter ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "unit",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Starter" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoBtn, {
						id: "SV%",
						label: "save percentage"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "num",
						children: projected.starter.no ?? "—"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "who",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: projected.starter.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("em", { children: [projected.starter.sv != null ? `${pct(projected.starter.sv)} SV` : "SV —", projected.starter.gaa != null ? ` · ${projected.starter.gaa.toFixed(2)} GAA` : ""] })]
					})] }), projected.backup ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "num",
						children: projected.backup.no ?? "—"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "who",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: projected.backup.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("em", { children: ["Backup", projected.backup.sv != null ? ` · ${pct(projected.backup.sv)}` : ""] })]
					})] }) : null] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: projected.starter.why })
				]
			}) : null
		]
	});
}
function Flag({ name, injuries }) {
	const hit = injuries.find((i) => {
		const a = i.player.toLowerCase();
		const b = name.toLowerCase();
		return a === b || b.endsWith(a) || a.endsWith(b);
	});
	if (!hit) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "flag",
		children: hit.status
	});
}
//#endregion
export { LineupCard as t };
