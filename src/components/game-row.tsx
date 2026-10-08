import { Link } from "@tanstack/react-router";
import type { Game } from "@/lib/nhl/pull";
import { fairProb, fmtWhen, moneyline } from "@/lib/nhl/hockey";
import { useLeague } from "@/components/providers";
import { TeamMark } from "@/components/marks";

export function GameRow({ game }: { game: Game }) {
  const { data } = useLeague();
  const team = (abbr: string) => data.teams.find((t) => t.abbrev === abbr);
  const away = team(game.away.abbrev);
  const home = team(game.home.abbrev);
  const prob = fairProb(game);
  const live = game.state === "live";
  const final = game.state === "final";

  return (
    <Link to="/game/$id" params={{ id: String(game.id) }} className="game-row">
      <div className="game-meta">
        <span>{final ? "Final" : live ? "Live" : fmtWhen(game.start)}</span>
        {game.networks[0] ? <span>{game.networks[0]}</span> : null}
      </div>
      <Side
        abbrev={game.away.abbrev}
        name={away?.common ?? game.away.abbrev}
        logo={away?.logo}
        score={final || live ? game.away.score : null}
        odds={moneyline(game.away.odds)}
        pct={prob ? Math.round(prob.away * 100) : null}
        lead={prob ? prob.away >= prob.home : false}
      />
      <Side
        abbrev={game.home.abbrev}
        name={home?.common ?? game.home.abbrev}
        logo={home?.logo}
        score={final || live ? game.home.score : null}
        odds={moneyline(game.home.odds)}
        pct={prob ? Math.round(prob.home * 100) : null}
        lead={prob ? prob.home > prob.away : false}
      />
      {!final && prob ? (
        <div className="prob" aria-hidden="true">
          <span style={{ width: `${Math.round(prob.away * 100)}%` }} />
        </div>
      ) : null}
      <p className="venue">{game.venue}</p>
    </Link>
  );
}

function Side({
  abbrev,
  name,
  logo,
  score,
  odds,
  pct,
  lead,
}: {
  abbrev: string;
  name: string;
  logo?: string;
  score: number | null;
  odds: string;
  pct: number | null;
  lead: boolean;
}) {
  return (
    <div className={lead ? "side is-lead" : "side"}>
      <TeamMark abbrev={abbrev} logo={logo} size="sm" />
      <span className="side-name">{name}</span>
      {score != null ? <strong className="score">{score}</strong> : <span className="odds">{pct != null ? `${pct}%` : odds}</span>}
    </div>
  );
}
