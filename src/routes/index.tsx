import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { boardValueLabel, movement, nextGameFor, rankBoard, record, fmtWhen, fairProb } from "@/lib/nhl/hockey";
import { clubColors } from "@/lib/nhl/colors";
import { useFav, useLeague } from "@/components/providers";
import { Shell } from "@/components/shell";
import { InfoBtn, Move, TeamMark } from "@/components/marks";
import { ClubPicker } from "@/components/picker";
import { GameRow } from "@/components/game-row";

export const Route = createFileRoute("/")({ component: Home });

function ordinal(n: number): string {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  const s = n % 10;
  if (s === 1) return `${n}st`;
  if (s === 2) return `${n}nd`;
  if (s === 3) return `${n}rd`;
  return `${n}th`;
}

function Home() {
  return (
    <Shell>
      <HomeBody />
    </Shell>
  );
}

function HomeBody() {
  const { data } = useLeague();
  const { fav, ready } = useFav();
  const [picking, setPicking] = useState(false);
  const team = data.teams.find((t) => t.abbrev === fav);

  if (!ready) return <div className="skel" aria-hidden="true" />;
  if (!team || picking) {
    return (
      <>
        {team ? (
          <button type="button" className="back" onClick={() => setPicking(false)}>
            Back to {team.common}
          </button>
        ) : (
          <p className="prose" style={{ marginTop: "0.9rem" }}>
            Thirty-two clubs. One favourite, front and center.
          </p>
        )}
        <ClubPicker onPick={() => setPicking(false)} />
      </>
    );
  }

  const ovr = rankBoard(data.teams, "overall").find((r) => r.team.abbrev === team.abbrev);
  const off = rankBoard(data.teams, "offense").find((r) => r.team.abbrev === team.abbrev);
  const def = rankBoard(data.teams, "defense").find((r) => r.team.abbrev === team.abbrev);
  const pk = rankBoard(data.teams, "pk").find((r) => r.team.abbrev === team.abbrev);
  const moved = movement(data.teams, "overall", data.priorCycle)[team.abbrev];
  const next = nextGameFor(data.games, team.abbrev, data.asOf);
  const opp = next ? (next.away.abbrev === team.abbrev ? next.home.abbrev : next.away.abbrev) : null;
  const oppTeam = data.teams.find((t) => t.abbrev === opp);
  const prob = next ? fairProb(next) : null;
  const side = next && prob ? (next.away.abbrev === team.abbrev ? prob.away : prob.home) : null;
  const hurt = data.injuries.filter((i) => i.abbrev === team.abbrev);
  const wire = data.news.filter((n) => n.teams.includes(team.abbrev));
  const colors = clubColors(team.abbrev);
  const tonight = data.games.filter((g) => g.date === data.asOf);

  const notes = [
    `${team.common} are ${ordinal(ovr?.rank ?? team.seq)} overall, ${record(team)}, ${team.pts} points.`,
    moved == null || moved === 0
      ? `Same spot as the ${data.cycleLock} two-day lock.`
      : moved > 0
        ? `Up ${moved} since the ${data.cycleLock} two-day lock.`
        : `Down ${Math.abs(moved)} since the ${data.cycleLock} two-day lock.`,
    next
      ? `Next is ${next.away.abbrev === team.abbrev ? "at" : "vs"} ${oppTeam?.common ?? opp} on ${fmtWhen(next.start)}${side != null ? `. Win chance ${Math.round(side * 100)}%.` : "."}`
      : "No game inside the three-day window.",
    hurt.length
      ? `${hurt.length} name${hurt.length === 1 ? "" : "s"} on the injury wire.`
      : "Injury wire is clear.",
  ];

  const movers = rankBoard(data.teams, "overall")
    .map((r) => ({ ...r, delta: movement(data.teams, "overall", data.priorCycle)[r.team.abbrev] ?? 0 }))
    .filter((r) => (r.delta ?? 0) > 0)
    .sort((a, b) => (b.delta ?? 0) - (a.delta ?? 0))
    .slice(0, 3);

  return (
    <>
      <article className="hero" style={{ background: colors.wash, ["--ink" as string]: colors.ink }}>
        <p className="eyebrow">Your club</p>
        <div className="hero-top">
          <TeamMark abbrev={team.abbrev} logo={team.logo} size="lg" />
          <div>
            <h1>{team.common}</h1>
            <p className="hero-record">
              {record(team)} · {team.pts} pts · {team.streak}
            </p>
          </div>
        </div>
        <div className="rank-pills">
          <div>
            <strong>{ovr?.rank ?? "—"}</strong>
            <span>Overall</span>
          </div>
          <div>
            <strong>{off?.rank ?? "—"}</strong>
            <span>Offense</span>
          </div>
          <div>
            <strong>{def?.rank ?? "—"}</strong>
            <span>Defense</span>
          </div>
          <div>
            <strong>{pk?.rank ?? "—"}</strong>
            <span>PK</span>
          </div>
        </div>
      </article>
      <button type="button" className="btn-ghost" onClick={() => setPicking(true)}>
        Change club
      </button>
      <Link to="/team/$abbr" params={{ abbr: team.abbrev }} className="btn-block">
        Open {team.common}
      </Link>

      <div className="section-head">
        <h2>{team.common} wire</h2>
        <InfoBtn id="PTS" label="points" />
      </div>
      <ul className="wire">
        {notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
      <div className="section-head">
        <h2>Stories</h2>
      </div>
      {wire.length === 0 ? (
        <p className="muted-block">No national story is tagged to {team.common} on the latest wire.</p>
      ) : (
        wire.slice(0, 4).map((n) => (
          <a key={n.id} className="news-card" href={n.url} target="_blank" rel="noreferrer">
            <strong>{n.title}</strong>
            <span>{n.dek}</span>
          </a>
        ))
      )}

      {movers.length ? (
        <>
          <div className="section-head">
            <h2>Climbers</h2>
            <InfoBtn id="P%" label="the two-day lock" />
          </div>
          <p className="legend">Biggest jumps on the NHL table since the {data.cycleLock} calculation.</p>
          {movers.map((r) => (
            <Link key={r.team.abbrev} to="/team/$abbr" params={{ abbr: r.team.abbrev }} className="rank-row">
              <span className="rank-no">{r.rank}</span>
              <Move n={r.delta} />
              <TeamMark abbrev={r.team.abbrev} logo={r.team.logo} size="sm" />
              <span className="rank-name">
                <strong>{r.team.common}</strong>
                <em>{record(r.team)}</em>
              </span>
              <span className="rank-val">{boardValueLabel("overall", r.team)}</span>
            </Link>
          ))}
        </>
      ) : null}

      <div className="section-head">
        <h2>Tonight</h2>
        <InfoBtn id="WIN" label="win probability" />
      </div>
      {tonight.length === 0 ? <p className="muted-block">No games on the slate today.</p> : tonight.map((g) => <GameRow key={g.id} game={g} />)}
    </>
  );
}
