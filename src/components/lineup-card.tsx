import type { Injury } from "@/lib/nhl/pull";
import { pct, projectLineup } from "@/lib/nhl/hockey";
import { useLeague } from "@/components/providers";
import { InfoBtn } from "@/components/marks";

export function LineupCard({ abbrev }: { abbrev: string }) {
  const { data } = useLeague();
  const injuries = data.injuries.filter((i) => i.abbrev === abbrev);
  const projected = projectLineup(data.skaters[abbrev] ?? [], data.goalies[abbrev] ?? [], injuries);

  if (!projected.lines.length && !projected.starter) {
    return <p className="muted-block">Roster card is still syncing for this club.</p>;
  }

  return (
    <section className="stack">
      <div className="section-head">
        <h2>Projected lineup</h2>
        <InfoBtn id="TOI" label="time on ice" />
      </div>
      <p className="prose">{projected.why}</p>
      {projected.lines.map((line) => (
        <article key={line.label} className="unit">
          <header>
            <h3>{line.label}</h3>
          </header>
          <ul>
            {line.players.map((p) => (
              <li key={p.id}>
                <span className="num">{p.no ?? "—"}</span>
                <span className="who">
                  <strong>{p.name}</strong>
                  <em>
                    {p.pos} · {p.note}
                  </em>
                </span>
                <Flag name={p.name} injuries={injuries} />
              </li>
            ))}
          </ul>
          <p>{line.why}</p>
        </article>
      ))}
      {projected.pairs.map((pair) => (
        <article key={pair.label} className="unit">
          <header>
            <h3>{pair.label}</h3>
          </header>
          <ul>
            {pair.players.map((p) => (
              <li key={p.id}>
                <span className="num">{p.no ?? "—"}</span>
                <span className="who">
                  <strong>{p.name}</strong>
                  <em>
                    D · {p.note}
                  </em>
                </span>
              </li>
            ))}
          </ul>
          <p>{pair.why}</p>
        </article>
      ))}
      {projected.starter ? (
        <article className="unit">
          <header>
            <h3>Starter</h3>
            <InfoBtn id="SV%" label="save percentage" />
          </header>
          <ul>
            <li>
              <span className="num">{projected.starter.no ?? "—"}</span>
              <span className="who">
                <strong>{projected.starter.name}</strong>
                <em>
                  {projected.starter.sv != null ? `${pct(projected.starter.sv)} SV` : "SV —"}
                  {projected.starter.gaa != null ? ` · ${projected.starter.gaa.toFixed(2)} GAA` : ""}
                </em>
              </span>
            </li>
            {projected.backup ? (
              <li>
                <span className="num">{projected.backup.no ?? "—"}</span>
                <span className="who">
                  <strong>{projected.backup.name}</strong>
                  <em>Backup{projected.backup.sv != null ? ` · ${pct(projected.backup.sv)}` : ""}</em>
                </span>
              </li>
            ) : null}
          </ul>
          <p>{projected.starter.why}</p>
        </article>
      ) : null}
    </section>
  );
}

function Flag({ name, injuries }: { name: string; injuries: Injury[] }) {
  const hit = injuries.find((i) => {
    const a = i.player.toLowerCase();
    const b = name.toLowerCase();
    return a === b || b.endsWith(a) || a.endsWith(b);
  });
  if (!hit) return null;
  return <span className="flag">{hit.status}</span>;
}
