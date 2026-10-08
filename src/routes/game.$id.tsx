import { createFileRoute, useRouter } from "@tanstack/react-router";
import { fairProb, fmtWhen, moneyline } from "@/lib/nhl/hockey";
import { useInfo, useLeague } from "@/components/providers";
import { Shell } from "@/components/shell";
import { InfoBtn, TeamMark } from "@/components/marks";
import { LineupCard } from "@/components/lineup-card";

export const Route = createFileRoute("/game/$id")({ component: GamePage });

function GamePage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const { data } = useLeague();
  const open = useInfo();
  const game = data.games.find((g) => String(g.id) === id);

  if (!game) {
    return (
      <Shell>
        <p className="muted-block">That game is outside the current window.</p>
      </Shell>
    );
  }

  const away = data.teams.find((t) => t.abbrev === game.away.abbrev);
  const home = data.teams.find((t) => t.abbrev === game.home.abbrev);
  const prob = fairProb(game);
  const awayPct = prob ? Math.round(prob.away * 100) : null;
  const homePct = prob ? Math.round(prob.home * 100) : null;
  const favName =
    awayPct != null && homePct != null
      ? awayPct === homePct
        ? "even"
        : awayPct > homePct
          ? (away?.common ?? game.away.abbrev)
          : (home?.common ?? game.home.abbrev)
      : null;
  const favPct = awayPct != null && homePct != null ? Math.max(awayPct, homePct) : null;
  const hurt = data.injuries.filter((i) => i.abbrev === game.away.abbrev || i.abbrev === game.home.abbrev);

  return (
    <Shell>
      <button type="button" className="back" onClick={() => router.history.back()}>
        Back
      </button>
      <div className="matchup">
        <TeamMark abbrev={game.away.abbrev} logo={away?.logo} size="lg" />
        <div style={{ textAlign: "center" }}>
          <p className="eyebrow">{game.state === "final" ? "Final" : game.state === "live" ? "Live" : fmtWhen(game.start)}</p>
          <h1>
            {away?.common ?? game.away.abbrev} at {home?.common ?? game.home.abbrev}
          </h1>
        </div>
        <TeamMark abbrev={game.home.abbrev} logo={home?.logo} size="lg" />
      </div>
      <p className="legend">
        {game.venue}
        {game.networks.length ? ` · ${game.networks.join(", ")}` : ""}
      </p>

      <div className="section-head">
        <h2>Who wins</h2>
        <InfoBtn id="WIN" label="win probability" />
      </div>
      {awayPct == null || homePct == null ? (
        <p className="muted-block">No moneyline is posted yet.</p>
      ) : (
        <button type="button" className="game-row" onClick={() => open("WIN")}>
          <div className="side">
            <span className="side-name">{away?.common}</span>
            <strong className="score">{awayPct}%</strong>
          </div>
          <div className="side">
            <span className="side-name">{home?.common}</span>
            <strong className="score">{homePct}%</strong>
          </div>
          <div className="prob" aria-hidden="true">
            <span style={{ width: `${awayPct}%` }} />
          </div>
          <p className="venue">
            {game.away.abbrev} {moneyline(game.away.odds)} · {game.home.abbrev} {moneyline(game.home.odds)}.{" "}
            {favName === "even"
              ? "The fair price is a toss-up."
              : `${favName} are the ${favPct}% side after the book's cut is removed.`}
          </p>
        </button>
      )}

      <div className="section-head">
        <h2>Injuries in this game</h2>
      </div>
      {hurt.length === 0 ? <p className="muted-block">No listings for either club.</p> : null}
      {hurt.map((i) => (
        <article key={`${i.abbrev}-${i.player}`} className="injury">
          <span className={/out|reserve|ir|season/i.test(i.status) ? "tag hard" : "tag"}>{i.status}</span>
          <strong>
            {i.player} · {i.abbrev}
          </strong>
          <p>
            {i.detail}
            {i.note ? ` — ${i.note}` : ""}
          </p>
        </article>
      ))}

      <div className="section-head">
        <h2>{away?.common ?? game.away.abbrev}</h2>
      </div>
      <LineupCard abbrev={game.away.abbrev} />
      <div className="section-head">
        <h2>{home?.common ?? game.home.abbrev}</h2>
      </div>
      <LineupCard abbrev={game.home.abbrev} />
    </Shell>
  );
}
