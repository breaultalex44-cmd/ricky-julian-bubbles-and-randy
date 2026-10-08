import { useEffect } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Info } from "lucide-react";
import {
  BOARDS,
  fairProb,
  fmtRate,
  fmtWhen,
  movement,
  nextGameFor,
  pace,
  pct,
  perGame,
  rankBoard,
  record,
  signed,
} from "@/lib/nhl/hockey";
import { clubColors } from "@/lib/nhl/colors";
import { useFav, useInfo, useLeague } from "@/components/providers";
import { Shell } from "@/components/shell";
import { TeamMark } from "@/components/marks";
import { LineupCard } from "@/components/lineup-card";

export const Route = createFileRoute("/team/$abbr")({ component: TeamPage });

function TeamPage() {
  const { abbr } = Route.useParams();
  const router = useRouter();
  const { data, loadClub } = useLeague();
  const { fav, setFav } = useFav();
  const open = useInfo();
  const team = data.teams.find((t) => t.abbrev === abbr);

  useEffect(() => {
    loadClub(abbr);
  }, [abbr, loadClub]);

  if (!team) {
    return (
      <Shell>
        <p className="muted-block">That club is not on the board.</p>
      </Shell>
    );
  }

  const colors = clubColors(team.abbrev);
  const isFav = fav === team.abbrev;
  const moves = movement(data.teams, "overall", data.priorCycle)[team.abbrev];
  const next = nextGameFor(data.games, team.abbrev, data.asOf);
  const prob = next ? fairProb(next) : null;
  const side = next && prob ? (next.away.abbrev === team.abbrev ? prob.away : prob.home) : null;
  const opp = next ? (next.away.abbrev === team.abbrev ? next.home.abbrev : next.away.abbrev) : null;
  const oppName = data.teams.find((t) => t.abbrev === opp)?.common ?? opp;
  const hurt = data.injuries.filter((i) => i.abbrev === team.abbrev);
  const wire = data.news.filter((n) => n.teams.includes(team.abbrev));
  const ranks = BOARDS.map((b) => ({
    ...b,
    rank: rankBoard(data.teams, b.id).find((r) => r.team.abbrev === team.abbrev)?.rank ?? null,
  }));

  const cells: { id: string; label: string; value: string; sub?: string }[] = [
    { id: "PTS", label: "PTS", value: String(team.pts), sub: `${pct(team.ptPct, 1)} of points available` },
    { id: "W-L-OTL", label: "W-L-OTL", value: record(team), sub: `${team.gp} games` },
    { id: "GF/GP", label: "GF/GP", value: fmtRate(perGame(team.gf, team.gp)), sub: `${team.gf} goals` },
    { id: "GA/GP", label: "GA/GP", value: fmtRate(perGame(team.ga, team.gp)), sub: `${team.ga} allowed` },
    { id: "DIFF", label: "DIFF", value: signed(team.diff), sub: "Goals for minus against" },
    { id: "PP%", label: "PP%", value: pct(team.pp), sub: team.ppOpp ? `${team.ppG ?? 0} for ${team.ppOpp}` : undefined },
    { id: "PK%", label: "PK%", value: pct(team.pk), sub: team.shTimes ? `${team.pkGa ?? 0} allowed on ${team.shTimes}` : undefined },
    { id: "FO%", label: "FO%", value: pct(team.fo) },
    { id: "SAT%", label: "SAT%", value: pct(team.sat), sub: team.sf != null ? `${team.sf.toFixed(1)} shots for / gm` : undefined },
    { id: "L10", label: "L10", value: `${team.l10Pts} pts`, sub: team.l10Record },
    { id: "ROW", label: "ROW", value: String(team.row), sub: `${team.rw} in regulation` },
    { id: "STREAK", label: "Streak", value: team.streak || "—" },
    { id: "HOME", label: "Home", value: pct(pace(team.homePts, team.homeGp)), sub: `${team.homePts} pts in ${team.homeGp}` },
    { id: "ROAD", label: "Road", value: pct(pace(team.roadPts, team.roadGp)), sub: `${team.roadPts} pts in ${team.roadGp}` },
    { id: "HITS", label: "Hits", value: team.hits == null ? "—" : String(team.hits) },
    { id: "BLK", label: "Blocks", value: team.blocks == null ? "—" : String(team.blocks) },
  ];

  return (
    <Shell>
      <button type="button" className="back" onClick={() => router.history.back()}>
        Back
      </button>
      <article className="hero" style={{ background: colors.wash, ["--ink" as string]: colors.ink }}>
        <p className="eyebrow">{team.division}</p>
        <div className="hero-top">
          <TeamMark abbrev={team.abbrev} logo={team.logo} size="lg" />
          <div>
            <h1>{team.name}</h1>
            <p className="hero-record">
              {record(team)} · {team.pts} pts
              {moves == null || moves === 0 ? "" : moves > 0 ? ` · up ${moves} since ${data.cycleLock}` : ` · down ${Math.abs(moves)} since ${data.cycleLock}`}
            </p>
          </div>
        </div>
      </article>
      <button type="button" className={isFav ? "btn-block" : "btn-ghost"} onClick={() => setFav(isFav ? null : team.abbrev)}>
        {isFav ? "Favourite · showing on home" : "Set as favourite"}
      </button>

      <div className="chips" aria-label="Board ranks">
        {ranks.map((r) => (
          <span key={r.id} className="chip">
            {r.label} {r.rank ?? "—"}
          </span>
        ))}
      </div>

      <div className="section-head">
        <h2>Stats</h2>
      </div>
      <p className="legend">Tap a stat. The note is written for someone new to the league.</p>
      <div className="stat-grid">
        {cells.map((c) => (
          <button key={c.id} type="button" className="stat-cell" onClick={() => open(c.id)} aria-label={`About ${c.label}`}>
            <span>
              {c.label} <Info />
            </span>
            <strong>{c.value}</strong>
            {c.sub ? <em>{c.sub}</em> : null}
          </button>
        ))}
      </div>

      {next ? (
        <>
          <div className="section-head">
            <h2>Next game</h2>
          </div>
          <Link to="/game/$id" params={{ id: String(next.id) }} className="news-card">
            <strong>
              {next.away.abbrev === team.abbrev ? "At" : "Vs"} {oppName}
            </strong>
            <span>
              {fmtWhen(next.start)}
              {side != null ? ` · ${Math.round(side * 100)}% win chance` : ""} · {next.venue}
            </span>
          </Link>
        </>
      ) : null}

      <LineupCard abbrev={team.abbrev} />

      <div className="section-head">
        <h2>Injuries</h2>
      </div>
      {hurt.length === 0 ? <p className="muted-block">No active listings.</p> : null}
      {hurt.map((i) => (
        <article key={i.player} className="injury">
          <span className={/out|reserve|ir|season/i.test(i.status) ? "tag hard" : "tag"}>{i.status}</span>
          <strong>
            {i.player}
            {i.pos ? ` · ${i.pos}` : ""} · {i.detail}
          </strong>
          {i.note ? <p>{i.note}</p> : null}
        </article>
      ))}

      <div className="section-head">
        <h2>Wire</h2>
      </div>
      {wire.length === 0 ? <p className="muted-block">No story tagged to {team.common} right now.</p> : null}
      {wire.map((n) => (
        <a key={n.id} className="news-card" href={n.url} target="_blank" rel="noreferrer">
          <strong>{n.title}</strong>
          <span>{n.dek}</span>
        </a>
      ))}
    </Shell>
  );
}
