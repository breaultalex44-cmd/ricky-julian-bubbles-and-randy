import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useFav, useLeague } from "@/components/providers";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/injuries")({ component: Injuries });

function Injuries() {
  const { data } = useLeague();
  const { fav } = useFav();
  const [q, setQ] = useState("");
  const [onlyFav, setOnlyFav] = useState(false);
  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return data.injuries.filter((i) => {
      if (onlyFav && fav && i.abbrev !== fav) return false;
      if (!query) return true;
      const team = data.teams.find((t) => t.abbrev === i.abbrev);
      return (
        i.player.toLowerCase().includes(query) ||
        i.status.toLowerCase().includes(query) ||
        i.detail.toLowerCase().includes(query) ||
        (team?.common.toLowerCase().includes(query) ?? false) ||
        i.abbrev.toLowerCase().includes(query)
      );
    });
  }, [data, fav, onlyFav, q]);

  return (
    <Shell>
      <div className="section-head">
        <h2>Injury wire</h2>
      </div>
      <p className="legend">{data.injuries.length} listings across the league. Out and injured reserve come off the projected lineup. Day-to-day stays on the card and gets a flag.</p>
      <div className="chips">
        <button type="button" className={!onlyFav ? "chip is-on" : "chip"} onClick={() => setOnlyFav(false)}>
          All clubs
        </button>
        <button type="button" className={onlyFav ? "chip is-on" : "chip"} onClick={() => setOnlyFav(true)} disabled={!fav}>
          {fav ? `${fav} only` : "Pick a club first"}
        </button>
      </div>
      <input className="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Player, team, or injury" aria-label="Filter injuries" />
      {rows.length === 0 ? <p className="muted-block">No listings match.</p> : null}
      {rows.map((i) => {
        const team = data.teams.find((t) => t.abbrev === i.abbrev);
        const hard = /out|reserve|ir|ltir|season/i.test(i.status);
        return (
          <Link key={`${i.abbrev}-${i.player}`} to="/team/$abbr" params={{ abbr: i.abbrev }} className="injury">
            <span className={hard ? "tag hard" : "tag"}>{i.status}</span>
            <strong>
              {i.player}
              {i.pos ? ` · ${i.pos}` : ""}
            </strong>
            <p>
              {team?.common ?? i.abbrev} · {i.detail}
              {i.note ? ` — ${i.note}` : ""}
            </p>
          </Link>
        );
      })}
    </Shell>
  );
}
