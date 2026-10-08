import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as record, d as fairProb, g as nextGameFor, h as movement, i as useFav, l as boardValueLabel, o as useLeague, p as fmtWhen, u as divisionOrder, x as rankBoard } from "./router-B4AT-FTg.mjs";
import { t as Shell } from "./shell-DB4Uh-Wv.mjs";
import { n as Move, r as TeamMark, t as InfoBtn } from "./marks-741WmyKR.mjs";
import { t as clubColors } from "./colors-3EFzpR0e.mjs";
import { t as GameRow } from "./game-row-D5UQvwIC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DkHteN_a.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ClubPicker({ onPick }) {
	const { data } = useLeague();
	const { setFav } = useFav();
	const [q, setQ] = (0, import_react.useState)("");
	const groups = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		const teams = data.teams.filter((t) => {
			if (!query) return true;
			return t.name.toLowerCase().includes(query) || t.common.toLowerCase().includes(query) || t.abbrev.toLowerCase().includes(query) || t.place.toLowerCase().includes(query);
		}).sort((a, b) => divisionOrder(a.division) - divisionOrder(b.division) || a.name.localeCompare(b.name));
		const map = /* @__PURE__ */ new Map();
		for (const t of teams) {
			const key = `${t.conference} · ${t.division}`;
			const list = map.get(key) ?? [];
			list.push(t);
			map.set(key, list);
		}
		return [...map.entries()];
	}, [data.teams, q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "section-head",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Pick your club" })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "prose",
			children: "They sit at the top of home, with their wire, next game, and rank."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: "search",
			value: q,
			onChange: (e) => setQ(e.target.value),
			placeholder: "Search all 32",
			"aria-label": "Search clubs",
			enterKeyHint: "search"
		}),
		groups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "muted-block",
			children: "No club matches that."
		}) : null,
		groups.map(([label, teams]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "picker-label",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "picker",
			children: teams.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "pick",
				style: { background: clubColors(t.abbrev).wash },
				onClick: () => {
					setFav(t.abbrev);
					onPick?.();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamMark, {
					abbrev: t.abbrev,
					logo: t.logo,
					size: "sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.common })]
			}, t.abbrev))
		})] }, label))
	] });
}
function ordinal(n) {
	const v = n % 100;
	if (v >= 11 && v <= 13) return `${n}th`;
	const s = n % 10;
	if (s === 1) return `${n}st`;
	if (s === 2) return `${n}nd`;
	if (s === 3) return `${n}rd`;
	return `${n}th`;
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeBody, {}) });
}
function HomeBody() {
	const { data } = useLeague();
	const { fav, ready } = useFav();
	const [picking, setPicking] = (0, import_react.useState)(false);
	const team = data.teams.find((t) => t.abbrev === fav);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "skel",
		"aria-hidden": "true"
	});
	if (!team || picking) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [team ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: "back",
		onClick: () => setPicking(false),
		children: ["Back to ", team.common]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "prose",
		style: { marginTop: "0.9rem" },
		children: "Thirty-two clubs. One favourite, front and center."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClubPicker, { onPick: () => setPicking(false) })] });
	const ovr = rankBoard(data.teams, "overall").find((r) => r.team.abbrev === team.abbrev);
	const off = rankBoard(data.teams, "offense").find((r) => r.team.abbrev === team.abbrev);
	const def = rankBoard(data.teams, "defense").find((r) => r.team.abbrev === team.abbrev);
	const pk = rankBoard(data.teams, "pk").find((r) => r.team.abbrev === team.abbrev);
	const moved = movement(data.teams, "overall", data.priorCycle)[team.abbrev];
	const next = nextGameFor(data.games, team.abbrev, data.asOf);
	const opp = next ? next.away.abbrev === team.abbrev ? next.home.abbrev : next.away.abbrev : null;
	const oppTeam = data.teams.find((t) => t.abbrev === opp);
	const prob = next ? fairProb(next) : null;
	const side = next && prob ? next.away.abbrev === team.abbrev ? prob.away : prob.home : null;
	const hurt = data.injuries.filter((i) => i.abbrev === team.abbrev);
	const wire = data.news.filter((n) => n.teams.includes(team.abbrev));
	const colors = clubColors(team.abbrev);
	const tonight = data.games.filter((g) => g.date === data.asOf);
	const notes = [
		`${team.common} are ${ordinal(ovr?.rank ?? team.seq)} overall, ${record(team)}, ${team.pts} points.`,
		moved == null || moved === 0 ? `Same spot as the ${data.cycleLock} two-day lock.` : moved > 0 ? `Up ${moved} since the ${data.cycleLock} two-day lock.` : `Down ${Math.abs(moved)} since the ${data.cycleLock} two-day lock.`,
		next ? `Next is ${next.away.abbrev === team.abbrev ? "at" : "vs"} ${oppTeam?.common ?? opp} on ${fmtWhen(next.start)}${side != null ? `. Win chance ${Math.round(side * 100)}%.` : "."}` : "No game inside the three-day window.",
		hurt.length ? `${hurt.length} name${hurt.length === 1 ? "" : "s"} on the injury wire.` : "Injury wire is clear."
	];
	const movers = rankBoard(data.teams, "overall").map((r) => ({
		...r,
		delta: movement(data.teams, "overall", data.priorCycle)[r.team.abbrev] ?? 0
	})).filter((r) => (r.delta ?? 0) > 0).sort((a, b) => (b.delta ?? 0) - (a.delta ?? 0)).slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "hero",
			style: {
				background: colors.wash,
				["--ink"]: colors.ink
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "Your club"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hero-top",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamMark, {
						abbrev: team.abbrev,
						logo: team.logo,
						size: "lg"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: team.common }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "hero-record",
						children: [
							record(team),
							" · ",
							team.pts,
							" pts · ",
							team.streak
						]
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rank-pills",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: ovr?.rank ?? "—" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Overall" })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: off?.rank ?? "—" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Offense" })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: def?.rank ?? "—" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Defense" })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: pk?.rank ?? "—" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PK" })] })
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-ghost",
			onClick: () => setPicking(true),
			children: "Change club"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/team/$abbr",
			params: { abbr: team.abbrev },
			className: "btn-block",
			children: ["Open ", team.common]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "section-head",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [team.common, " wire"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoBtn, {
				id: "PTS",
				label: "points"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "wire",
			children: notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: n }, n))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "section-head",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Stories" })
		}),
		wire.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "muted-block",
			children: [
				"No national story is tagged to ",
				team.common,
				" on the latest wire."
			]
		}) : wire.slice(0, 4).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			className: "news-card",
			href: n.url,
			target: "_blank",
			rel: "noreferrer",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: n.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: n.dek })]
		}, n.id)),
		movers.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "section-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Climbers" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoBtn, {
					id: "P%",
					label: "the two-day lock"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "legend",
				children: [
					"Biggest jumps on the NHL table since the ",
					data.cycleLock,
					" calculation."
				]
			}),
			movers.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: r.team.common }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: record(r.team) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rank-val",
						children: boardValueLabel("overall", r.team)
					})
				]
			}, r.team.abbrev))
		] }) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "section-head",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Tonight" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoBtn, {
				id: "WIN",
				label: "win probability"
			})]
		}),
		tonight.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "muted-block",
			children: "No games on the slate today."
		}) : tonight.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameRow, { game: g }, g.id))
	] });
}
//#endregion
export { Home as component };
