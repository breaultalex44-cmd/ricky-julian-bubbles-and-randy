/** Server-side NHL pull. No secrets. Shapes the public NHL + ESPN feeds into one payload. */

const UA = "Rinkboard/1.0 (nhl fan tracker)";

export type PriorStat = {
  pts: number;
  gp: number;
  gf: number;
  ga: number;
  rw: number;
  l10Pts: number;
  l10Diff: number;
  seq: number;
  homePts: number;
  homeGp: number;
  roadPts: number;
  roadGp: number;
};

export type Team = {
  abbrev: string;
  name: string;
  common: string;
  place: string;
  logo: string;
  conference: string;
  division: string;
  gp: number;
  w: number;
  l: number;
  otl: number;
  pts: number;
  ptPct: number;
  gf: number;
  ga: number;
  diff: number;
  rw: number;
  row: number;
  streak: string;
  l10Pts: number;
  l10Diff: number;
  l10Record: string;
  homePts: number;
  homeGp: number;
  roadPts: number;
  roadGp: number;
  seq: number;
  pp: number | null;
  pk: number | null;
  ppG: number | null;
  ppOpp: number | null;
  pkGa: number | null;
  shTimes: number | null;
  shG: number | null;
  fo: number | null;
  sat: number | null;
  sf: number | null;
  sa: number | null;
  hits: number | null;
  blocks: number | null;
};

export type GameSide = {
  abbrev: string;
  score: number | null;
  odds: number | null;
};

export type Game = {
  id: number;
  date: string;
  start: string;
  state: "upcoming" | "live" | "final";
  venue: string;
  away: GameSide;
  home: GameSide;
  networks: string[];
};

export type Injury = {
  abbrev: string;
  player: string;
  pos: string;
  status: string;
  detail: string;
  note: string;
};

export type NewsItem = {
  id: string;
  title: string;
  dek: string;
  at: string;
  url: string;
  teams: string[];
};

export type Skater = {
  id: number;
  name: string;
  pos: string;
  no: number | null;
  gp: number;
  g: number;
  a: number;
  pts: number;
  pm: number;
  toi: number;
  sog: number;
  ppg: number;
  shg: number;
};

export type Goalie = {
  id: number;
  name: string;
  no: number | null;
  gp: number;
  gs: number;
  w: number;
  sv: number | null;
  gaa: number | null;
  so: number;
};

export type LeagueData = {
  updatedAt: string;
  season: string;
  asOf: string;
  cycleLock: string;
  nextLock: string;
  dayLock: string;
  teams: Team[];
  priorCycle: Record<string, PriorStat>;
  priorDay: Record<string, PriorStat>;
  games: Game[];
  injuries: Injury[];
  news: NewsItem[];
  skaters: Record<string, Skater[]>;
  goalies: Record<string, Goalie[]>;
};

type NameObj = { default?: string } | string | undefined;

function nameOf(v: NameObj): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  return v.default ?? "";
}

function num(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() && Number.isFinite(Number(v))) return Number(v);
  return null;
}

function frac(v: unknown): number | null {
  const n = num(v);
  if (n == null) return null;
  if (n > 1.5) return n / 100;
  return n;
}

export function normName(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function etDate(d = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(d);
}

export function addDays(iso: string, days: number): string {
  const [y, m, da] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, da));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

/** Two-day lock: movement is versus the table from two mornings ago. Next lock is the even step after today. */
export function cycleDates(today: string): { cycleLock: string; nextLock: string; dayLock: string } {
  const epoch = Date.parse("2026-10-06T12:00:00Z");
  const day = Date.parse(`${today}T12:00:00Z`);
  const diff = Math.round((day - epoch) / 86_400_000);
  const into = ((diff % 2) + 2) % 2;
  const nextIn = into === 0 ? 2 : 1;
  return {
    cycleLock: addDays(today, -2),
    nextLock: addDays(today, nextIn),
    dayLock: addDays(today, -1),
  };
}

async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function pool<T, R>(items: T[], n: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
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

function priorFromRow(row: Record<string, unknown>): { abbrev: string; stat: PriorStat } | null {
  const abbrev = nameOf(row.teamAbbrev as NameObj);
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
      roadGp: num(row.roadGamesPlayed) ?? 0,
    },
  };
}

function americanOdds(odds: unknown): number | null {
  if (!Array.isArray(odds)) return null;
  const preferred = [9, 7, 8, 6];
  for (const id of preferred) {
    const hit = odds.find((o) => o && typeof o === "object" && (o as { providerId?: number }).providerId === id);
    const v = num(hit && typeof hit === "object" ? (hit as { value?: unknown }).value : null);
    if (v != null && Math.abs(v) >= 100) return v;
  }
  for (const o of odds) {
    const v = num(o && typeof o === "object" ? (o as { value?: unknown }).value : null);
    if (v != null && Math.abs(v) >= 100) return v;
  }
  return null;
}

function gameState(raw: string): Game["state"] {
  if (raw === "LIVE" || raw === "CRIT" || raw === "INPROG") return "live";
  if (raw === "OFF" || raw === "FINAL" || raw === "OVER") return "final";
  return "upcoming";
}

function mapGame(g: Record<string, unknown>, date: string): Game | null {
  const away = g.awayTeam as Record<string, unknown> | undefined;
  const home = g.homeTeam as Record<string, unknown> | undefined;
  if (!away || !home) return null;
  const broadcasts = Array.isArray(g.tvBroadcasts) ? g.tvBroadcasts : [];
  const networks = [
    ...new Set(
      broadcasts
        .filter((b) => b && typeof b === "object" && (b as { countryCode?: string }).countryCode === "US")
        .map((b) => String((b as { network?: string }).network ?? ""))
        .filter(Boolean),
    ),
  ].slice(0, 3);
  return {
    id: num(g.id) ?? 0,
    date,
    start: String(g.startTimeUTC ?? ""),
    state: gameState(String(g.gameState ?? "")),
    venue: nameOf(g.venue as NameObj),
    away: {
      abbrev: String(away.abbrev ?? ""),
      score: num(away.score),
      odds: americanOdds(away.odds),
    },
    home: {
      abbrev: String(home.abbrev ?? ""),
      score: num(home.score),
      odds: americanOdds(home.odds),
    },
    networks,
  };
}

function indexByName<T extends { teamFullName?: string }>(rows: T[] | undefined): Map<string, T> {
  const m = new Map<string, T>();
  for (const row of rows ?? []) {
    if (row.teamFullName) m.set(normName(row.teamFullName), row);
  }
  return m;
}

async function loadPriors(date: string): Promise<Record<string, PriorStat>> {
  try {
    const json = (await getJson(`https://api-web.nhle.com/v1/standings/${date}`)) as {
      standings?: Record<string, unknown>[];
    };
    const out: Record<string, PriorStat> = {};
    for (const row of json.standings ?? []) {
      const p = priorFromRow(row);
      if (p) out[p.abbrev] = p.stat;
    }
    return out;
  } catch {
    return {};
  }
}

function playerName(p: Record<string, unknown>): string {
  const first = nameOf(p.firstName as NameObj);
  const last = nameOf(p.lastName as NameObj);
  return `${first} ${last}`.trim();
}

export async function pullClub(abbrev: string): Promise<{ skaters: Skater[]; goalies: Goalie[] }> {
  const safe = abbrev.toUpperCase();
  const [stats, roster] = await Promise.all([
    getJson(`https://api-web.nhle.com/v1/club-stats/${safe}/now`) as Promise<{
      skaters?: Record<string, unknown>[];
      goalies?: Record<string, unknown>[];
    }>,
    getJson(`https://api-web.nhle.com/v1/roster/${safe}/current`).catch(() => ({
      forwards: [],
      defensemen: [],
      goalies: [],
    })) as Promise<{
      forwards?: Record<string, unknown>[];
      defensemen?: Record<string, unknown>[];
      goalies?: Record<string, unknown>[];
    }>,
  ]);

  const numbers = new Map<number, { no: number | null; pos: string }>();
  for (const group of [roster.forwards, roster.defensemen, roster.goalies]) {
    for (const p of group ?? []) {
      const id = num(p.id);
      if (id == null) continue;
      numbers.set(id, { no: num(p.sweaterNumber), pos: String(p.positionCode ?? "") });
    }
  }

  const skaters: Skater[] = (stats.skaters ?? []).map((p) => {
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
      shg: num(p.shorthandedGoals) ?? 0,
    };
  });

  const goalies: Goalie[] = (stats.goalies ?? []).map((p) => {
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
      so: num(p.shutouts) ?? 0,
    };
  });

  return { skaters, goalies };
}

function tagTeams(text: string, teams: { abbrev: string; name: string; common: string }[]): string[] {
  const hay = ` ${normName(text)} `;
  const hits: string[] = [];
  for (const t of teams) {
    const keys = [normName(t.name), normName(t.common)].filter((k) => k.length >= 4);
    if (keys.some((k) => hay.includes(` ${k} `))) hits.push(t.abbrev);
  }
  return hits;
}

export async function pullLeague(opts?: { withRosters?: boolean }): Promise<LeagueData> {
  const asOf = etDate();
  const locks = cycleDates(asOf);
  const withRosters = opts?.withRosters !== false;

  const [standingsRaw, summaryRaw, ppRaw, pkRaw, rtRaw, scheduleRaw, injuryRaw, newsRaw, priorCycle, priorDay] =
    await Promise.all([
      getJson("https://api-web.nhle.com/v1/standings/now") as Promise<{
        standings?: Record<string, unknown>[];
      }>,
      getJson(
        "https://api.nhle.com/stats/rest/en/team/summary?cayenneExp=seasonId=20262027%20and%20gameTypeId=2&limit=50",
      ) as Promise<{ data?: Record<string, unknown>[] }>,
      getJson(
        "https://api.nhle.com/stats/rest/en/team/powerplay?cayenneExp=seasonId=20262027%20and%20gameTypeId=2&limit=50",
      ) as Promise<{ data?: Record<string, unknown>[] }>,
      getJson(
        "https://api.nhle.com/stats/rest/en/team/penaltykill?cayenneExp=seasonId=20262027%20and%20gameTypeId=2&limit=50",
      ) as Promise<{ data?: Record<string, unknown>[] }>,
      getJson(
        "https://api.nhle.com/stats/rest/en/team/realtime?cayenneExp=seasonId=20262027%20and%20gameTypeId=2&limit=50",
      ) as Promise<{ data?: Record<string, unknown>[] }>,
      getJson(`https://api-web.nhle.com/v1/schedule/${asOf}`) as Promise<{
        gameWeek?: { date: string; games?: Record<string, unknown>[] }[];
      }>,
      getJson("https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/injuries") as Promise<{
        injuries?: Record<string, unknown>[];
      }>,
      getJson("https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/news?limit=30") as Promise<{
        articles?: Record<string, unknown>[];
      }>,
      loadPriors(locks.cycleLock),
      loadPriors(locks.dayLock),
    ]);

  const summary = indexByName(summaryRaw.data as { teamFullName?: string }[]);
  const ppMap = indexByName(ppRaw.data as { teamFullName?: string }[]);
  const pkMap = indexByName(pkRaw.data as { teamFullName?: string }[]);
  const rtMap = indexByName(rtRaw.data as { teamFullName?: string }[]);

  const teams: Team[] = (standingsRaw.standings ?? []).map((row) => {
    const name = nameOf(row.teamName as NameObj);
    const key = normName(name);
    const s = summary.get(key) as Record<string, unknown> | undefined;
    const pp = ppMap.get(key) as Record<string, unknown> | undefined;
    const pk = pkMap.get(key) as Record<string, unknown> | undefined;
    const rt = rtMap.get(key) as Record<string, unknown> | undefined;
    const gp = num(row.gamesPlayed) ?? 0;
    const w = num(row.wins) ?? 0;
    const l = num(row.losses) ?? 0;
    const otl = num(row.otLosses) ?? 0;
    return {
      abbrev: nameOf(row.teamAbbrev as NameObj),
      name,
      common: nameOf(row.teamCommonName as NameObj),
      place: nameOf(row.placeName as NameObj),
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
      blocks: num(rt?.blockedShots),
    };
  });

  const byFull = new Map(teams.map((t) => [normName(t.name), t.abbrev]));
  const aliases: Record<string, string> = {
    "utah hockey club": "UTA",
    "utah mammoth": "UTA",
    "montreal canadiens": "MTL",
    "montréal canadiens": "MTL",
  };
  for (const [k, v] of Object.entries(aliases)) byFull.set(normName(k), v);

  const through = addDays(asOf, 3);
  const games: Game[] = [];
  for (const day of scheduleRaw.gameWeek ?? []) {
    if (day.date < addDays(asOf, -1) || day.date > through) continue;
    for (const g of day.games ?? []) {
      const mapped = mapGame(g, day.date);
      if (mapped && mapped.away.abbrev && mapped.home.abbrev) games.push(mapped);
    }
  }

  const injuries: Injury[] = [];
  for (const club of injuryRaw.injuries ?? []) {
    const display = String(club.displayName ?? "");
    const abbrev = byFull.get(normName(display)) ?? aliases[normName(display)] ?? "";
    if (!abbrev) continue;
    const list = Array.isArray(club.injuries) ? club.injuries : [];
    for (const inj of list) {
      if (!inj || typeof inj !== "object") continue;
      const row = inj as Record<string, unknown>;
      const athlete = (row.athlete ?? {}) as Record<string, unknown>;
      const posObj = athlete.position as { abbreviation?: string } | string | undefined;
      const pos = typeof posObj === "string" ? posObj : (posObj?.abbreviation ?? "");
      const details = (row.details ?? {}) as Record<string, unknown>;
      const note = String(row.shortComment ?? row.longComment ?? "").replace(/\s+/g, " ").trim();
      injuries.push({
        abbrev,
        player: String(athlete.displayName ?? "Unknown"),
        pos,
        status: String(row.status ?? details.fantasyStatus ?? "Listed"),
        detail: String(details.detail ?? details.type ?? "Undisclosed"),
        note: note.slice(0, 280),
      });
    }
  }

  const tagSource = teams.map((t) => ({ abbrev: t.abbrev, name: t.name, common: t.common }));
  const news: NewsItem[] = (newsRaw.articles ?? []).slice(0, 24).map((a) => {
    const title = String(a.headline ?? "");
    const dek = String(a.description ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 220);
    const links = a.links as { web?: { href?: string } } | undefined;
    return {
      id: String(a.id ?? title),
      title,
      dek,
      at: String(a.published ?? ""),
      url: links?.web?.href ?? "https://www.espn.com/nhl/",
      teams: tagTeams(`${title} ${dek}`, tagSource),
    };
  });

  const skaters: Record<string, Skater[]> = {};
  const goalies: Record<string, Goalie[]> = {};
  if (withRosters) {
    const clubs = await pool(teams, 4, async (t) => {
      try {
        return { abbrev: t.abbrev, ...(await pullClub(t.abbrev)) };
      } catch {
        return { abbrev: t.abbrev, skaters: [] as Skater[], goalies: [] as Goalie[] };
      }
    });
    for (const c of clubs) {
      skaters[c.abbrev] = c.skaters;
      goalies[c.abbrev] = c.goalies;
    }
  }

  return {
    updatedAt: new Date().toISOString(),
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
    goalies,
  };
}
