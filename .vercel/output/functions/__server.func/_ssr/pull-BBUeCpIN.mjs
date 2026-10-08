//#region node_modules/.nitro/vite/services/ssr/assets/pull-BBUeCpIN.js
/** Server-side NHL pull. No secrets. Shapes the public NHL + ESPN feeds into one payload. */
var UA = "Rinkboard/1.0 (nhl fan tracker)";
function nameOf(v) {
	if (!v) return "";
	if (typeof v === "string") return v;
	return v.default ?? "";
}
function num(v) {
	if (typeof v === "number" && Number.isFinite(v)) return v;
	if (typeof v === "string" && v.trim() && Number.isFinite(Number(v))) return Number(v);
	return null;
}
function frac(v) {
	const n = num(v);
	if (n == null) return null;
	if (n > 1.5) return n / 100;
	return n;
}
function normName(s) {
	return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function etDate(d = /* @__PURE__ */ new Date()) {
	return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(d);
}
function addDays(iso, days) {
	const [y, m, da] = iso.split("-").map(Number);
	const dt = new Date(Date.UTC(y, m - 1, da));
	dt.setUTCDate(dt.getUTCDate() + days);
	return dt.toISOString().slice(0, 10);
}
/** Two-day lock: movement is versus the table from two mornings ago. Next lock is the even step after today. */
function cycleDates(today) {
	const epoch = Date.parse("2026-10-06T12:00:00Z");
	const day = Date.parse(`${today}T12:00:00Z`);
	const nextIn = (Math.round((day - epoch) / 864e5) % 2 + 2) % 2 === 0 ? 2 : 1;
	return {
		cycleLock: addDays(today, -2),
		nextLock: addDays(today, nextIn),
		dayLock: addDays(today, -1)
	};
}
async function getJson(url) {
	const res = await fetch(url, { headers: {
		"User-Agent": UA,
		Accept: "application/json"
	} });
	if (!res.ok) throw new Error(`${res.status} ${url}`);
	return res.json();
}
async function pool(items, n, fn) {
	const out = new Array(items.length);
	let i = 0;
	async function worker() {
		while (i < items.length) {
			const idx = i++;
			out[idx] = await fn(items[idx]);
		}
	}
	await Promise.all(Array.from({ length: Math.min(n, items.length) }, worker));
	return out;
}
function priorFromRow(row) {
	const abbrev = nameOf(row.teamAbbrev);
	if (!abbrev) return null;
	return {
		abbrev,
		stat: {
			pts: num(row.points) ?? 0,
			gp: num(row.gamesPlayed) ?? 0,
			gf: num(row.goalFor) ?? 0,
			ga: num(row.goalAgainst) ?? 0,
			rw: num(row.regulationWins) ?? 0,
			l10Pts: num(row.l10Points) ?? 0,
			l10Diff: num(row.l10GoalDifferential) ?? 0,
			seq: num(row.leagueSequence) ?? 99,
			homePts: num(row.homePoints) ?? 0,
			homeGp: num(row.homeGamesPlayed) ?? 0,
			roadPts: num(row.roadPoints) ?? 0,
			roadGp: num(row.roadGamesPlayed) ?? 0
		}
	};
}
function americanOdds(odds) {
	if (!Array.isArray(odds)) return null;
	for (const id of [
		9,
		7,
		8,
		6
	]) {
		const hit = odds.find((o) => o && typeof o === "object" && o.providerId === id);
		const v = num(hit && typeof hit === "object" ? hit.value : null);
		if (v != null && Math.abs(v) >= 100) return v;
	}
	for (const o of odds) {
		const v = num(o && typeof o === "object" ? o.value : null);
		if (v != null && Math.abs(v) >= 100) return v;
	}
	return null;
}
function gameState(raw) {
	if (raw === "LIVE" || raw === "CRIT" || raw === "INPROG") return "live";
	if (raw === "OFF" || raw === "FINAL" || raw === "OVER") return "final";
	return "upcoming";
}
function mapGame(g, date) {
	const away = g.awayTeam;
	const home = g.homeTeam;
	if (!away || !home) return null;
	const broadcasts = Array.isArray(g.tvBroadcasts) ? g.tvBroadcasts : [];
	const networks = [...new Set(broadcasts.filter((b) => b && typeof b === "object" && b.countryCode === "US").map((b) => String(b.network ?? "")).filter(Boolean))].slice(0, 3);
	return {
		id: num(g.id) ?? 0,
		date,
		start: String(g.startTimeUTC ?? ""),
		state: gameState(String(g.gameState ?? "")),
		venue: nameOf(g.venue),
		away: {
			abbrev: String(away.abbrev ?? ""),
			score: num(away.score),
			odds: americanOdds(away.odds)
		},
		home: {
			abbrev: String(home.abbrev ?? ""),
			score: num(home.score),
			odds: americanOdds(home.odds)
		},
		networks
	};
}
function indexByName(rows) {
	const m = /* @__PURE__ */ new Map();
	for (const row of rows ?? []) if (row.teamFullName) m.set(normName(row.teamFullName), row);
	return m;
}
async function loadPriors(date) {
	try {
		const json = await getJson(`https://api-web.nhle.com/v1/standings/${date}`);
		const out = {};
		for (const row of json.standings ?? []) {
			const p = priorFromRow(row);
			if (p) out[p.abbrev] = p.stat;
		}
		return out;
	} catch {
		return {};
	}
}
function playerName(p) {
	return `${nameOf(p.firstName)} ${nameOf(p.lastName)}`.trim();
}
async function pullClub(abbrev) {
	const safe = abbrev.toUpperCase();
	const [stats, roster] = await Promise.all([getJson(`https://api-web.nhle.com/v1/club-stats/${safe}/now`), getJson(`https://api-web.nhle.com/v1/roster/${safe}/current`).catch(() => ({
		forwards: [],
		defensemen: [],
		goalies: []
	}))]);
	const numbers = /* @__PURE__ */ new Map();
	for (const group of [
		roster.forwards,
		roster.defensemen,
		roster.goalies
	]) for (const p of group ?? []) {
		const id = num(p.id);
		if (id == null) continue;
		numbers.set(id, {
			no: num(p.sweaterNumber),
			pos: String(p.positionCode ?? "")
		});
	}
	return {
		skaters: (stats.skaters ?? []).map((p) => {
			const id = num(p.playerId) ?? 0;
			const meta = numbers.get(id);
			return {
				id,
				name: playerName(p),
				pos: String(p.positionCode ?? meta?.pos ?? ""),
				no: meta?.no ?? null,
				gp: num(p.gamesPlayed) ?? 0,
				g: num(p.goals) ?? 0,
				a: num(p.assists) ?? 0,
				pts: num(p.points) ?? 0,
				pm: num(p.plusMinus) ?? 0,
				toi: num(p.avgTimeOnIcePerGame) ?? 0,
				sog: num(p.shots) ?? 0,
				ppg: num(p.powerPlayGoals) ?? 0,
				shg: num(p.shorthandedGoals) ?? 0
			};
		}),
		goalies: (stats.goalies ?? []).map((p) => {
			const id = num(p.playerId) ?? 0;
			const meta = numbers.get(id);
			return {
				id,
				name: playerName(p),
				no: meta?.no ?? null,
				gp: num(p.gamesPlayed) ?? 0,
				gs: num(p.gamesStarted) ?? num(p.gamesPlayed) ?? 0,
				w: num(p.wins) ?? 0,
				sv: frac(p.savePercentage ?? p.savePctg ?? p.savePct),
				gaa: num(p.goalsAgainstAverage),
				so: num(p.shutouts) ?? 0
			};
		})
	};
}
function tagTeams(text, teams) {
	const hay = ` ${normName(text)} `;
	const hits = [];
	for (const t of teams) if ([normName(t.name), normName(t.common)].filter((k) => k.length >= 4).some((k) => hay.includes(` ${k} `))) hits.push(t.abbrev);
	return hits;
}
async function pullLeague(opts) {
	const asOf = etDate();
	const locks = cycleDates(asOf);
	const withRosters = opts?.withRosters !== false;
	const [standingsRaw, summaryRaw, ppRaw, pkRaw, rtRaw, scheduleRaw, injuryRaw, newsRaw, priorCycle, priorDay] = await Promise.all([
		getJson("https://api-web.nhle.com/v1/standings/now"),
		getJson("https://api.nhle.com/stats/rest/en/team/summary?cayenneExp=seasonId=20262027%20and%20gameTypeId=2&limit=50"),
		getJson("https://api.nhle.com/stats/rest/en/team/powerplay?cayenneExp=seasonId=20262027%20and%20gameTypeId=2&limit=50"),
		getJson("https://api.nhle.com/stats/rest/en/team/penaltykill?cayenneExp=seasonId=20262027%20and%20gameTypeId=2&limit=50"),
		getJson("https://api.nhle.com/stats/rest/en/team/realtime?cayenneExp=seasonId=20262027%20and%20gameTypeId=2&limit=50"),
		getJson(`https://api-web.nhle.com/v1/schedule/${asOf}`),
		getJson("https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/injuries"),
		getJson("https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/news?limit=30"),
		loadPriors(locks.cycleLock),
		loadPriors(locks.dayLock)
	]);
	const summary = indexByName(summaryRaw.data);
	const ppMap = indexByName(ppRaw.data);
	const pkMap = indexByName(pkRaw.data);
	const rtMap = indexByName(rtRaw.data);
	const teams = (standingsRaw.standings ?? []).map((row) => {
		const name = nameOf(row.teamName);
		const key = normName(name);
		const s = summary.get(key);
		const pp = ppMap.get(key);
		const pk = pkMap.get(key);
		const rt = rtMap.get(key);
		const gp = num(row.gamesPlayed) ?? 0;
		const w = num(row.wins) ?? 0;
		const l = num(row.losses) ?? 0;
		const otl = num(row.otLosses) ?? 0;
		return {
			abbrev: nameOf(row.teamAbbrev),
			name,
			common: nameOf(row.teamCommonName),
			place: nameOf(row.placeName),
			logo: String(row.teamLogo ?? ""),
			conference: String(row.conferenceName ?? ""),
			division: String(row.divisionName ?? ""),
			gp,
			w,
			l,
			otl,
			pts: num(row.points) ?? 0,
			ptPct: num(row.pointPctg) ?? 0,
			gf: num(row.goalFor) ?? 0,
			ga: num(row.goalAgainst) ?? 0,
			diff: num(row.goalDifferential) ?? 0,
			rw: num(row.regulationWins) ?? 0,
			row: num(row.regulationPlusOtWins) ?? 0,
			streak: `${row.streakCode ?? ""}${row.streakCount ?? ""}`,
			l10Pts: num(row.l10Points) ?? 0,
			l10Diff: num(row.l10GoalDifferential) ?? 0,
			l10Record: `${num(row.l10Wins) ?? 0}-${num(row.l10Losses) ?? 0}-${num(row.l10OtLosses) ?? 0}`,
			homePts: num(row.homePoints) ?? 0,
			homeGp: num(row.homeGamesPlayed) ?? 0,
			roadPts: num(row.roadPoints) ?? 0,
			roadGp: num(row.roadGamesPlayed) ?? 0,
			seq: num(row.leagueSequence) ?? 99,
			pp: frac(pp?.powerPlayPct ?? s?.powerPlayPct),
			pk: frac(pk?.penaltyKillPct ?? s?.penaltyKillPct),
			ppG: num(pp?.powerPlayGoalsFor),
			ppOpp: num(pp?.ppOpportunities),
			pkGa: num(pk?.ppGoalsAgainst),
			shTimes: num(pk?.timesShorthanded),
			shG: num(pk?.shGoalsFor),
			fo: frac(s?.faceoffWinPct),
			sat: frac(rt?.satPct),
			sf: num(s?.shotsForPerGame),
			sa: num(s?.shotsAgainstPerGame),
			hits: num(rt?.hits),
			blocks: num(rt?.blockedShots)
		};
	});
	const byFull = new Map(teams.map((t) => [normName(t.name), t.abbrev]));
	const aliases = {
		"utah hockey club": "UTA",
		"utah mammoth": "UTA",
		"montreal canadiens": "MTL",
		"montréal canadiens": "MTL"
	};
	for (const [k, v] of Object.entries(aliases)) byFull.set(normName(k), v);
	const through = addDays(asOf, 3);
	const games = [];
	for (const day of scheduleRaw.gameWeek ?? []) {
		if (day.date < addDays(asOf, -1) || day.date > through) continue;
		for (const g of day.games ?? []) {
			const mapped = mapGame(g, day.date);
			if (mapped && mapped.away.abbrev && mapped.home.abbrev) games.push(mapped);
		}
	}
	const injuries = [];
	for (const club of injuryRaw.injuries ?? []) {
		const display = String(club.displayName ?? "");
		const abbrev = byFull.get(normName(display)) ?? aliases[normName(display)] ?? "";
		if (!abbrev) continue;
		const list = Array.isArray(club.injuries) ? club.injuries : [];
		for (const inj of list) {
			if (!inj || typeof inj !== "object") continue;
			const row = inj;
			const athlete = row.athlete ?? {};
			const posObj = athlete.position;
			const pos = typeof posObj === "string" ? posObj : posObj?.abbreviation ?? "";
			const details = row.details ?? {};
			const note = String(row.shortComment ?? row.longComment ?? "").replace(/\s+/g, " ").trim();
			injuries.push({
				abbrev,
				player: String(athlete.displayName ?? "Unknown"),
				pos,
				status: String(row.status ?? details.fantasyStatus ?? "Listed"),
				detail: String(details.detail ?? details.type ?? "Undisclosed"),
				note: note.slice(0, 280)
			});
		}
	}
	const tagSource = teams.map((t) => ({
		abbrev: t.abbrev,
		name: t.name,
		common: t.common
	}));
	const news = (newsRaw.articles ?? []).slice(0, 24).map((a) => {
		const title = String(a.headline ?? "");
		const dek = String(a.description ?? "").replace(/\s+/g, " ").trim().slice(0, 220);
		const links = a.links;
		return {
			id: String(a.id ?? title),
			title,
			dek,
			at: String(a.published ?? ""),
			url: links?.web?.href ?? "https://www.espn.com/nhl/",
			teams: tagTeams(`${title} ${dek}`, tagSource)
		};
	});
	const skaters = {};
	const goalies = {};
	if (withRosters) {
		const clubs = await pool(teams, 4, async (t) => {
			try {
				return {
					abbrev: t.abbrev,
					...await pullClub(t.abbrev)
				};
			} catch {
				return {
					abbrev: t.abbrev,
					skaters: [],
					goalies: []
				};
			}
		});
		for (const c of clubs) {
			skaters[c.abbrev] = c.skaters;
			goalies[c.abbrev] = c.goalies;
		}
	}
	return {
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		season: "2026-27",
		asOf,
		cycleLock: locks.cycleLock,
		nextLock: locks.nextLock,
		dayLock: locks.dayLock,
		teams,
		priorCycle,
		priorDay,
		games,
		injuries,
		news,
		skaters,
		goalies
	};
}
//#endregion
export { pullClub as n, pullLeague as r, addDays as t };
