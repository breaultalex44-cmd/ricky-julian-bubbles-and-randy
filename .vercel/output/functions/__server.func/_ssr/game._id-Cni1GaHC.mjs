import { b as useRouter, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useInfo, d as fairProb, m as moneyline, o as useLeague, p as fmtWhen, r as Route$1 } from "./router-B4AT-FTg.mjs";
import { t as Shell } from "./shell-DB4Uh-Wv.mjs";
import { r as TeamMark, t as InfoBtn } from "./marks-741WmyKR.mjs";
import { t as LineupCard } from "./lineup-card-LbUgECoA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/game._id-Cni1GaHC.js
var import_jsx_runtime = require_jsx_runtime();
function GamePage() {
	const { id } = Route$1.useParams();
	const router = useRouter();
	const { data } = useLeague();
	const open = useInfo();
	const game = data.games.find((g) => String(g.id) === id);
	if (!game) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "muted-block",
		children: "That game is outside the current window."
	}) });
	const away = data.teams.find((t) => t.abbrev === game.away.abbrev);
	const home = data.teams.find((t) => t.abbrev === game.home.abbrev);
	const prob = fairProb(game);
	const awayPct = prob ? Math.round(prob.away * 100) : null;
	const homePct = prob ? Math.round(prob.home * 100) : null;
	const favName = awayPct != null && homePct != null ? awayPct === homePct ? "even" : awayPct > homePct ? away?.common ?? game.away.abbrev : home?.common ?? game.home.abbrev : null;
	const favPct = awayPct != null && homePct != null ? Math.max(awayPct, homePct) : null;
	const hurt = data.injuries.filter((i) => i.abbrev === game.away.abbrev || i.abbrev === game.home.abbrev);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "back",
			onClick: () => router.history.back(),
			children: "Back"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "matchup",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamMark, {
					abbrev: game.away.abbrev,
					logo: away?.logo,
					size: "lg"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: { textAlign: "center" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: game.state === "final" ? "Final" : game.state === "live" ? "Live" : fmtWhen(game.start)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
						away?.common ?? game.away.abbrev,
						" at ",
						home?.common ?? game.home.abbrev
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamMark, {
					abbrev: game.home.abbrev,
					logo: home?.logo,
					size: "lg"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "legend",
			children: [game.venue, game.networks.length ? ` · ${game.networks.join(", ")}` : ""]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "section-head",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Who wins" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoBtn, {
				id: "WIN",
				label: "win probability"
			})]
		}),
		awayPct == null || homePct == null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "muted-block",
			children: "No moneyline is posted yet."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "game-row",
			onClick: () => open("WIN"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "side",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "side-name",
						children: away?.common
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
						className: "score",
						children: [awayPct, "%"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "side",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "side-name",
						children: home?.common
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
						className: "score",
						children: [homePct, "%"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "prob",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: `${awayPct}%` } })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "venue",
					children: [
						game.away.abbrev,
						" ",
						moneyline(game.away.odds),
						" · ",
						game.home.abbrev,
						" ",
						moneyline(game.home.odds),
						".",
						" ",
						favName === "even" ? "The fair price is a toss-up." : `${favName} are the ${favPct}% side after the book's cut is removed.`
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "section-head",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Injuries in this game" })
		}),
		hurt.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "muted-block",
			children: "No listings for either club."
		}) : null,
		hurt.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "injury",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: /out|reserve|ir|season/i.test(i.status) ? "tag hard" : "tag",
					children: i.status
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
					i.player,
					" · ",
					i.abbrev
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [i.detail, i.note ? ` — ${i.note}` : ""] })
			]
		}, `${i.abbrev}-${i.player}`)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "section-head",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: away?.common ?? game.away.abbrev })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineupCard, { abbrev: game.away.abbrev }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "section-head",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: home?.common ?? game.home.abbrev })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineupCard, { abbrev: game.home.abbrev })
	] });
}
//#endregion
export { GamePage as component };
