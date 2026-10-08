import { useMemo, useState } from "react";
import { divisionOrder } from "@/lib/nhl/hockey";
import { clubColors } from "@/lib/nhl/colors";
import { useFav, useLeague } from "@/components/providers";
import { TeamMark } from "@/components/marks";

export function ClubPicker({ onPick }: { onPick?: () => void }) {
  const { data } = useLeague();
  const { setFav } = useFav();
  const [q, setQ] = useState("");
  const groups = useMemo(() => {
    const query = q.trim().toLowerCase();
    const teams = data.teams
      .filter((t) => {
        if (!query) return true;
        return (
          t.name.toLowerCase().includes(query) ||
          t.common.toLowerCase().includes(query) ||
          t.abbrev.toLowerCase().includes(query) ||
          t.place.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => divisionOrder(a.division) - divisionOrder(b.division) || a.name.localeCompare(b.name));
    const map = new Map<string, typeof teams>();
    for (const t of teams) {
      const key = `${t.conference} · ${t.division}`;
      const list = map.get(key) ?? [];
      list.push(t);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [data.teams, q]);

  return (
    <section>
      <div className="section-head">
        <h2>Pick your club</h2>
      </div>
      <p className="prose">They sit at the top of home, with their wire, next game, and rank.</p>
      <input
        className="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search all 32"
        aria-label="Search clubs"
        enterKeyHint="search"
      />
      {groups.length === 0 ? <p className="muted-block">No club matches that.</p> : null}
      {groups.map(([label, teams]) => (
        <div key={label}>
          <p className="picker-label">{label}</p>
          <div className="picker">
            {teams.map((t) => (
              <button
                key={t.abbrev}
                type="button"
                className="pick"
                style={{ background: clubColors(t.abbrev).wash }}
                onClick={() => {
                  setFav(t.abbrev);
                  onPick?.();
                }}
              >
                <TeamMark abbrev={t.abbrev} logo={t.logo} size="sm" />
                <span>{t.common}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
