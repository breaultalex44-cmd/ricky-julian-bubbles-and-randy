import type { Game, Goalie, Injury, PriorStat, Skater, Team } from "./pull";

export type BoardId =
  | "overall"
  | "offense"
  | "defense"
  | "pk"
  | "pp"
  | "diff"
  | "form"
  | "shots"
  | "faceoff"
  | "home"
  | "road";

export const BOARDS: { id: BoardId; label: string; stat: string; blurb: string }[] = [
  { id: "overall", label: "Overall", stat: "PTS", blurb: "The NHL table, best to worst." },
  { id: "offense", label: "Offense", stat: "GF/GP", blurb: "Who scores the most per night." },
  { id: "defense", label: "Defense", stat: "GA/GP", blurb: "Who gives up the least." },
  { id: "pk", label: "Penalty kill", stat: "PK%", blurb: "Best at killing penalties." },
  { id: "pp", label: "Power play", stat: "PP%", blurb: "Best with the extra attacker." },
  { id: "diff", label: "Goal diff", stat: "DIFF", blurb: "Goals scored minus goals allowed." },
  { id: "form", label: "Last 10", stat: "L10", blurb: "Points over the latest games." },
  { id: "shots", label: "Shot share", stat: "SAT%", blurb: "Who is directing the play." },
  { id: "faceoff", label: "Faceoffs", stat: "FO%", blurb: "Who wins the draws." },
  { id: "home", label: "Home", stat: "HOME", blurb: "Points pace in their own barn." },
  { id: "road", label: "Road", stat: "ROAD", blurb: "Points pace away from home." },
];

export const STATS: Record<string, { title: string; body: string }> = {
  PTS: {
    title: "Points",
    body: "The standings currency. A win is worth 2 points. An overtime or shootout loss is still worth 1. A regulation loss is worth 0. Most points sits first.",
  },
  GP: {
    title: "Games played",
    body: "How many games count in these numbers. Early in the year a hot team can be a tiny sample, so check games played before you crown anyone.",
  },
  "W-L-OTL": {
    title: "Record",
    body: "Wins, regulation losses, and overtime or shootout losses. That last number still earned a point. Read 4-1-0 as four wins and one regulation loss.",
  },
  "P%": {
    title: "Points percentage",
    body: "Points divided by the maximum available, which is 2 per game. It lets you compare clubs that have not played the same number of games. .650 is a strong pace. .500 is average.",
  },
  GF: {
    title: "Goals for",
    body: "Total goals this team has scored. A raw total, so a team with more games can look better than it is. Pair it with goals per game.",
  },
  GA: {
    title: "Goals against",
    body: "Total goals this team has allowed. Lower is better. Goalies, defense, and just plain luck all live in this number.",
  },
  DIFF: {
    title: "Goal differential",
    body: "Goals scored minus goals allowed. A plus team is outscoring opponents. When points are tied, differential is a common tiebreaker because it measures how they got those points.",
  },
  "GF/GP": {
    title: "Goals for per game",
    body: "Scoring rate. How many goals this club scores on a typical night. The best offenses usually live above 3.30. This is the Offense board.",
  },
  "GA/GP": {
    title: "Goals against per game",
    body: "How many goals this club gives up per night. Lower is a better defense. Under 2.70 is stingy. This is the Defense board, ranked from least to most.",
  },
  "PP%": {
    title: "Power play percentage",
    body: "When the other team takes a penalty, you skate with an extra player. Power-play percentage is how often you score on those chances. About 20% is league average. Above 25% is a weapon.",
  },
  "PK%": {
    title: "Penalty kill percentage",
    body: "When you take a penalty, you skate short-handed. Penalty-kill percentage is how often you stop the other team from scoring. About 80% is average. The Penalty Kill board ranks this from best to worst.",
  },
  ROW: {
    title: "Regulation and overtime wins",
    body: "Wins that did not need a shootout. A shootout is closer to a coin flip, so the league uses regulation wins as a tiebreaker when points are even.",
  },
  L10: {
    title: "Last 10 games",
    body: "Points earned in the last 10 games, or fewer if the season just started. A full-season table can hide a team that just got hot, or one that is sliding.",
  },
  STREAK: {
    title: "Streak",
    body: "The current run. W3 means three wins in a row. L2 means two losses in a row. Overtime losses count as losses on the streak.",
  },
  "SAT%": {
    title: "Shot-attempt share",
    body: "Also called Corsi. The share of shot attempts (shots, misses, and blocks) this team takes at even strength. Above 50% means they are playing more in the other end. It is a possession clue, not the score.",
  },
  "FO%": {
    title: "Faceoff win percentage",
    body: "How often the team wins the puck drop. It helps in your own zone and on the power play. It is not the same thing as winning the game.",
  },
  "SV%": {
    title: "Save percentage",
    body: "Shots a goalie stops, divided by shots faced. .900 is playable, .910 is solid, .920 and up is excellent. One soft goal swings this a lot in October.",
  },
  GAA: {
    title: "Goals-against average",
    body: "Goals allowed per 60 minutes. Lower is better. It depends on the team in front of the goalie, not just the goalie.",
  },
  "+/-": {
    title: "Plus-minus",
    body: "The skater is plus-1 when on the ice for an even-strength or short-handed goal for, and minus-1 for one against. Linemates and role change it, so read it next to ice time.",
  },
  TOI: {
    title: "Time on ice",
    body: "Average minutes per game. Coaches give trusted players more of the night. Line projections here lean on ice time plus points, not on rumors.",
  },
  WIN: {
    title: "Win probability",
    body: "Taken from the listed American moneyline, then the sportsbook's cut is removed so the two sides add up to 100%. A 60% side is a clear favorite, not a promise. Goalies and injuries can move it before puck drop.",
  },
  HOME: {
    title: "Home points pace",
    body: "Points percentage in home games only. Some clubs are a different team in their own building. A short home sample can look extreme.",
  },
  ROAD: {
    title: "Road points pace",
    body: "Points percentage away from home. Travel, the last change, and the crowd all make the road harder. This board ranks who still collects points on the road.",
  },
  HITS: {
    title: "Hits",
    body: "Body checks the team has thrown. A style stat. More hits does not mean a better team. Some fast clubs barely finish checks.",
  },
  BLK: {
    title: "Blocked shots",
    body: "Shot attempts this team has gotten in the way of. A mark of shot-blocking commitment, often from the penalty kill and a team protecting a lead.",
  },
};

const DIV_ORDER = ["Atlantic", "Metropolitan", "Central", "Pacific"];

export function divisionOrder(name: string): number {
  const i = DIV_ORDER.indexOf(name);
  return i === -1 ? 9 : i;
}

export function record(t: Team): string {
  return `${t.w}-${t.l}-${t.otl}`;
}

export function pct(n: number | null | undefined, digits = 1): string {
  if (n == null || Number.isNaN(n)) return "—";
  return `${(n * 100).toFixed(digits)}%`;
}

export function pace(pts: number, gp: number): number | null {
  if (!gp) return null;
  return pts / (gp * 2);
}

export function perGame(total: number, gp: number): number | null {
  if (!gp) return null;
  return total / gp;
}

export function fmtRate(n: number | null, digits = 2): string {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toFixed(digits);
}

export function signed(n: number): string {
  if (n > 0) return `+${n}`;
  return String(n);
}

export function fmtToi(seconds: number): string {
  if (!seconds) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function fmtWhen(iso: string): string {
  if (!iso) return "TBD";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "TBD";
  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
  return `${formatted} ET`;
}

export function fmtDay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

export function shortDay(iso: string, today: string): string {
  if (iso === today) return "Today";
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function americanToRaw(odds: number): number {
  if (odds < 0) return -odds / (-odds + 100);
  return 100 / (odds + 100);
}

export function fairProb(game: Game): { away: number; home: number } | null {
  if (game.away.odds == null || game.home.odds == null) return null;
  const a = americanToRaw(game.away.odds);
  const h = americanToRaw(game.home.odds);
  const s = a + h;
  if (!s) return null;
  return { away: a / s, home: h / s };
}

export function moneyline(odds: number | null): string {
  if (odds == null) return "—";
  return odds > 0 ? `+${odds}` : String(odds);
}

type Scored = { team: Team; value: number | null; better: "high" | "low" };

function scoreTeam(t: Team, board: BoardId, prior: PriorStat | undefined, usePrior: boolean): number | null {
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

const LOW = new Set<BoardId>(["overall", "defense"]);

export function rankBoard(
  teams: Team[],
  board: BoardId,
  prior?: Record<string, PriorStat>,
): { team: Team; rank: number; value: number | null }[] {
  const scored: Scored[] = teams.map((team) => ({
    team,
    value: scoreTeam(team, board, prior?.[team.abbrev], Boolean(prior)),
    better: LOW.has(board) ? "low" : "high",
  }));
  scored.sort((a, b) => {
    if (a.value == null && b.value == null) return a.team.seq - b.team.seq;
    if (a.value == null) return 1;
    if (b.value == null) return -1;
    if (a.value !== b.value) return a.better === "low" ? a.value - b.value : b.value - a.value;
    if (board === "overall") return b.team.rw - a.team.rw || b.team.diff - a.team.diff;
    return a.team.seq - b.team.seq;
  });
  return scored.map((s, i) => ({ team: s.team, rank: i + 1, value: s.value }));
}

export function boardValueLabel(board: BoardId, team: Team): string {
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

export function movement(
  teams: Team[],
  board: BoardId,
  prior?: Record<string, PriorStat>,
): Record<string, number | null> {
  const now = rankBoard(teams, board);
  const out: Record<string, number | null> = {};
  if (!prior || !Object.keys(prior).length) {
    for (const row of now) out[row.team.abbrev] = null;
    return out;
  }
  const then = rankBoard(teams, board, prior);
  const thenRank = new Map(then.map((r) => [r.team.abbrev, r.rank]));
  for (const row of now) {
    const prev = thenRank.get(row.team.abbrev);
    if (prev == null || then.find((t) => t.team.abbrev === row.team.abbrev)?.value == null) {
      out[row.team.abbrev] = null;
    } else {
      out[row.team.abbrev] = prev - row.rank;
    }
  }
  return out;
}

export type LineSlot = { id: number; name: string; pos: string; no: number | null; note: string };

export type Projected = {
  lines: { label: string; players: LineSlot[]; why: string }[];
  pairs: { label: string; players: LineSlot[]; why: string }[];
  starter: (Goalie & { why: string }) | null;
  backup: Goalie | null;
  flagged: { name: string; status: string }[];
  why: string;
};

const SCRATCH = /out|injured reserve|\bir\b|ltir|season/i;

function slot(p: Skater, note: string): LineSlot {
  return { id: p.id, name: p.name, pos: p.pos, no: p.no, note };
}

function injuredMatch(name: string, injuries: Injury[]): Injury | undefined {
  const n = norm(name);
  return injuries.find((i) => {
    const p = norm(i.player);
    return p === n || n.endsWith(p) || p.endsWith(n);
  });
}

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z\s]/g, "").replace(/\s+/g, " ").trim();
}

export function projectLineup(skaters: Skater[], goalies: Goalie[], injuries: Injury[]): Projected {
  const flagged = injuries.map((i) => ({ name: i.player, status: i.status }));
  const isScratch = (name: string) => {
    const hit = injuredMatch(name, injuries);
    return hit ? SCRATCH.test(hit.status) : false;
  };

  const pool = skaters.filter((s) => s.pos !== "G" && !isScratch(s.name));
  const score = (s: Skater) => s.pts * 4 + s.toi / 60 + s.g * 0.5;
  const forwards = pool.filter((s) => s.pos !== "D").sort((a, b) => score(b) - score(a) || b.toi - a.toi);
  const defense = pool.filter((s) => s.pos === "D").sort((a, b) => b.toi - a.toi || score(b) - score(a));
  const centers: Skater[] = [];
  const wings: Skater[] = [];
  for (const f of forwards) {
    if (f.pos === "C") centers.push(f);
    else wings.push(f);
  }
  const used = new Set<number>();
  const lines: Projected["lines"] = [];
  for (let i = 0; i < 4; i++) {
    const c = centers.find((p) => !used.has(p.id)) ?? wings.find((p) => !used.has(p.id));
    if (!c) break;
    used.add(c.id);
    const ws: Skater[] = [];
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
      players: players.map((p) =>
        slot(
          p,
          p.id === c.id ? `${p.pts} pts · ${fmtToi(p.toi)}` : `${p.pts} pts`,
        ),
      ),
      why: `${names}. ${c.name.split(" ").slice(-1)[0]} takes the middle${c.pos === "C" ? " as a natural center" : " because the center depth is thin"} with ${c.pts} points in ${c.gp} games and ${fmtToi(c.toi)} a night.`,
    });
  }

  const pairs: Projected["pairs"] = [];
  const pairNames = ["Top pair", "Second pair", "Third pair"];
  for (let i = 0; i < 3; i++) {
    const a = defense[i * 2];
    const b = defense[i * 2 + 1];
    if (!a) break;
    const players = [a, b].filter(Boolean) as Skater[];
    pairs.push({
      label: pairNames[i],
      players: players.map((p) => slot(p, fmtToi(p.toi))),
      why: players
        .map((p) => `${p.name.split(" ").slice(-1)[0]} at ${fmtToi(p.toi)}`)
        .join(" with ") + ". Pairs follow even-strength minutes, heaviest first, not the power-play units.",
    });
  }

  const sortedG = [...goalies].filter((g) => !isScratch(g.name)).sort((a, b) => b.gs - a.gs || b.gp - a.gp);
  const starter = sortedG[0];
  const backup = sortedG[1] ?? null;

  const scratchedNames = injuries.filter((i) => SCRATCH.test(i.status)).map((i) => i.player);

  const scratchLabel =
    scratchedNames.length === 0
      ? "Nobody on the current injury wire is a hard scratch, so the ice-time leaders stay in."
      : `${scratchedNames.slice(0, 5).join(", ")}${scratchedNames.length > 5 ? ` and ${scratchedNames.length - 5} more` : ""} ${scratchedNames.length === 1 ? "is" : "are"} off the card because the injury wire lists them out.`;

  return {
    lines,
    pairs,
    starter: starter
      ? {
          ...starter,
          why: `${starter.name} gets the nod with ${starter.gs || starter.gp} starts${starter.sv != null ? ` and a ${pct(starter.sv)} save rate` : ""}. The other goalie is the backup unless the club has already announced a switch.`,
        }
      : null,
    backup,
    flagged,
    why: `This is a projected card, not the morning skate. Forwards are ordered by points, then ice time. Centers stay at center when the roster allows. Defense is paired by average minutes. ${scratchLabel} Day-to-day players stay in and are flagged.`,
  };
}

export function teamInjuries(injuries: Injury[], abbrev: string): Injury[] {
  return injuries.filter((i) => i.abbrev === abbrev);
}

export function nextGameFor(games: Game[], abbrev: string, today: string): Game | undefined {
  return games
    .filter((g) => g.date >= today && (g.away.abbrev === abbrev || g.home.abbrev === abbrev))
    .sort((a, b) => a.start.localeCompare(b.start))[0];
}
