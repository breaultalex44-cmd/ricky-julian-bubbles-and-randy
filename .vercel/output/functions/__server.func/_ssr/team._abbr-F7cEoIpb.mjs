import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, b as useRouter, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Info } from "../_libs/lucide-react.mjs";
import { S as record, _ as pace, a as useInfo, d as fairProb, f as fmtRate, g as nextGameFor, h as movement, i as useFav, n as Route, o as useLeague, p as fmtWhen, s as BOARDS, v as pct, w as signed, x as rankBoard, y as perGame } from "./router-B4AT-FTg.mjs";
import { t as Shell } from "./shell-DB4Uh-Wv.mjs";
import { r as TeamMark } from "./marks-741WmyKR.mjs";
import { t as LineupCard } from "./lineup-card-LbUgECoA.mjs";
import { t as clubColors } from "./colors-3EFzpR0e.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/team._abbr-F7cEoIpb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TeamPage() {
	const { abbr } = Route.useParams();
	const router = useRouter();
	const { data, loadClub } = useLeague();
	const { fav, setFav } = useFav();
	const open = useInfo();
	const team = data.teams.find((t) => t.abbrev === abbr);
	(0, import_react.useEffect)(() => {
		loadClub(abbr);
	}, [abbr, loadClub]);
	if (!team) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "muted-block",
		children: "That club is not on the board."
	}) });
	const colors = clubColors(team.abbrev);
	const isFav = fav === team.abbrev;
	const moves = movement(data.teams, "overall", data.priorCycle)[team.abbrev];
	const next = nextGameFor(data.games, team.abbrev, data.asOf);
	const prob = next ? fairProb(next) : null;
	const side = next && prob ? next.away.abbrev === team.abbrev ? prob.away : prob.home : null;
	const opp = next ? next.away.abbrev === team.abbrev ? next.home.abbrev : next.away.abbrev : null;
	const oppName = data.teams.find((t) => t.abbrev === opp)?.common ?? opp;
	const hurt = data.injuries.filter((i) => i.abbrev === team.abbrev);
	const wire = data.news.filter((n) => n.teams.includes(team.abbrev));
	const ranks = BOARDS.map((b) => ({
		...b,
		rank: rankBoard(data.teams, b.id).find((r) => r.team.abbrev === team.abbrev)?.rank ?? null
	}));
	const cells = [
		{
			id: "PTS",
			label: "PTS",
			value: String(team.pts),
			sub: `${pct(team.ptPct, 1)} of points available`
		},
		{
			id: "W-L-OTL",
			label: "W-L-OTL",
			value: record(team),
			sub: `${team.gp} games`
		},
		{
			id: "GF/GP",
			label: "GF/GP",
			value: fmtRate(perGame(team.gf, team.gp)),
			sub: `${team.gf} goals`
		},
		{
			id: "GA/GP",
			label: "GA/GP",
			value: fmtRate(perGame(team.ga, team.gp)),
			sub: `${team.ga} allowed`
		},
		{
			id: "DIFF",
			label: "DIFF",
			value: signed(team.diff),
			sub: "Goals for minus against"
		},
		{
			id: "PP%",
			label: "PP%",
			value: pct(team.pp),
			sub: team.ppOpp ? `${team.ppG ?? 0} for ${team.ppOpp}` : void 0
		},
		{
			id: "PK%",
			label: "PK%",
			value: pct(team.pk),
			sub: team.shTimes ? `${team.pkGa ?? 0} allowed on ${team.shTimes}` : void 0
		},
		{
			id: "FO%",
			label: "FO%",
			value: pct(team.fo)
		},
		{
			id: "SAT%",
			label: "SAT%",
			value: pct(team.sat),
			sub: team.sf != null ? `${team.sf.toFixed(1)} shots for / gm` : void 0
		},
		{
			id: "L10",
			label: "L10",
			value: `${team.l10Pts} pts`,
			sub: team.l10Record
		},
		{
			id: "ROW",
			label: "ROW",
			value: String(team.row),
			sub: `${team.rw} in regulation`
		},
		{
			id: "STREAK",
			label: "Streak",
			value: team.streak || "—"
		},
		{
			id: "HOME",
			label: "Home",
			value: pct(pace(team.homePts, team.homeGp)),
			sub: `${team.homePts} pts in ${team.homeGp}`
		},
		{
			id: "ROAD",
			label: "Road",
			value: pct(pace(team.roadPts, team.roadGp)),
			sub: `${team.roadPts} pts in ${team.roadGp}`
		},
		{
			id: "HITS",
			label: "Hits",
			value: team.hits == null ? "—" : String(team.hits)
		},
		{
			id: "BLK",
			label: "Blocks",
			value: team.blocks == null ? "—" : String(team.blocks)
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "back",
			onClick: () => router.history.back(),
			children: "Back"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "hero",
			style: {
				background: colors.wash,
				["--ink"]: colors.ink
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: team.division
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hero-top",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamMark, {
					abbrev: team.abbrev,
					logo: team.logo,
					size: "lg"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: team.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "hero-record",
					children: [
						record(team),
						" · ",
						team.pts,
						" pts",
						moves == null || moves === 0 ? "" : moves > 0 ? ` · up ${moves} since ${data.cycleLock}` : ` · down ${Math.abs(moves)} since ${data.cycleLock}`
					]
				})] })]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: isFav ? "btn-block" : "btn-ghost",
			onClick: () => setFav(isFav ? null : team.abbrev),
			children: isFav ? "Favourite · showing on home" : "Set as favourite"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "chips",
			"aria-label": "Board ranks",
			children: ranks.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "chip",
				children: [
					r.label,
					" ",
					r.rank ?? "—"
				]
			}, r.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "section-head",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Stats" })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "legend",
			children: "Tap a stat. The note is written for someone new to the league."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "stat-grid",
			children: cells.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "stat-cell",
				onClick: () => open(c.id),
				"aria-label": `About ${c.label}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						c.label,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: c.value }),
					c.sub ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: c.sub }) : null
				]
			}, c.id))
		}),
		next ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "section-head",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Next game" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/game/$id",
			params: { id: String(next.id) },
			className: "news-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
				next.away.abbrev === team.abbrev ? "At" : "Vs",
				" ",
				oppName
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				fmtWhen(next.start),
				side != null ? ` · ${Math.round(side * 100)}% win chance` : "",
				" · ",
				next.venue
			] })]
		})] }) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineupCard, { abbrev: team.abbrev }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "section-head",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Injuries" })
		}),
		hurt.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "muted-block",
			children: "No active listings."
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
					i.pos ? ` · ${i.pos}` : "",
					" · ",
					i.detail
				] }),
				i.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: i.note }) : null
			]
		}, i.player)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "section-head",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Wire" })
		}),
		wire.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "muted-block",
			children: [
				"No story tagged to ",
				team.common,
				" right now."
			]
		}) : null,
		wire.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			className: "news-card",
			href: n.url,
			target: "_blank",
			rel: "noreferrer",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: n.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: n.dek })]
		}, n.id))
	] });
}
//#endregion
export { TeamPage as component };
