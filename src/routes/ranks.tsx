import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BOARDS, STATS, boardValueLabel, movement, rankBoard, record, type BoardId } from "@/lib/nhl/hockey";
import { useLeague } from "@/components/providers";
import { Shell } from "@/components/shell";
import { InfoBtn, Move, TeamMark } from "@/components/marks";

export const Route = createFileRoute("/ranks")({ component: Ranks });

const HISTORICAL = new Set<BoardId>(["overall", "offense", "defense", "diff", "form", "home", "road"]);

function Ranks() {
  const { data } = useLeague();
  const [board, setBoard] = useState<BoardId>("overall");
  const [conf, setConf] = useState<"All" | "Eastern" | "Western">("All");
  const [q, setQ] = useState("");
  const meta = BOARDS.find((b) => b.id === board) ?? BOARDS[0];
  const infoId =
    board === "overall"
      ? "PTS"
      : board === "offense"
        ? "GF/GP"
        : board === "defense"
          ? "GA/GP"
          : board === "pk"
            ? "PK%"
            : board === "pp"
              ? "PP%"
              : board === "diff"
                ? "DIFF"
                : board === "form"
                  ? "L10"
                  : board === "shots"
                    ? "SAT%"
                    : board === "faceoff"
                      ? "FO%"
                      : board === "home"
                        ? "HOME"
                        : "ROAD";

  const rows = useMemo(() => {
    const prior = HISTORICAL.has(board) ? data.priorCycle : undefined;
    const moves = movement(data.teams, board, prior);
    const query = q.trim().toLowerCase();
    return rankBoard(data.teams, board).filter((r) => {
      if (conf !== "All" && r.team.conference !== conf) return false;
      if (!query) return true;
      return r.team.name.toLowerCase().includes(query) || r.team.abbrev.toLowerCase().includes(query);
    }).map((r) => ({ ...r, delta: moves[r.team.abbrev] ?? null }));
  }, [board, conf, data, q]);

  return (
    <Shell>
      <div className="chips" role="tablist" aria-label="Ranking boards">
        {BOARDS.map((b) => (
          <button key={b.id} type="button" className={b.id === board ? "chip is-on" : "chip"} onClick={() => setBoard(b.id)}>
            {b.label}
          </button>
        ))}
      </div>
      <div className="section-head">
        <div>
          <h2>
            {meta.label} · {meta.stat}
          </h2>
        </div>
        <InfoBtn id={infoId} label={STATS[infoId]?.title ?? meta.stat} />
      </div>
      <p className="legend">
        {meta.blurb}{" "}
        {HISTORICAL.has(board)
          ? `Arrows are spots gained or lost since the ${data.cycleLock} lock. Next lock is ${data.nextLock}.`
          : "This board is live. A dash means there is no two-day snapshot yet, so the move is not invented."}
      </p>
      <div className="chips" aria-label="Conference">
        {(["All", "Eastern", "Western"] as const).map((c) => (
          <button key={c} type="button" className={c === conf ? "chip is-on" : "chip"} onClick={() => setConf(c)}>
            {c === "All" ? "All 32" : c}
          </button>
        ))}
      </div>
      <input className="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a club" aria-label="Filter clubs" />
      {rows.length === 0 ? <p className="muted-block">Nobody matches that filter.</p> : null}
      {rows.map((r) => (
        <Link key={r.team.abbrev} to="/team/$abbr" params={{ abbr: r.team.abbrev }} className="rank-row">
          <span className="rank-no">{r.rank}</span>
          <Move n={r.delta} />
          <TeamMark abbrev={r.team.abbrev} logo={r.team.logo} size="sm" />
          <span className="rank-name">
            <strong>{r.team.common}</strong>
            <em>
              {record(r.team)} · {r.team.gp} GP
            </em>
          </span>
          <span className="rank-val">{boardValueLabel(board, r.team)}</span>
        </Link>
      ))}
    </Shell>
  );
}
