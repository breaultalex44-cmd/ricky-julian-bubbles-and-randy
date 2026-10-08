import { createFileRoute } from "@tanstack/react-router";
import { addDays } from "@/lib/nhl/pull";
import { shortDay } from "@/lib/nhl/hockey";
import { useLeague } from "@/components/providers";
import { Shell } from "@/components/shell";
import { InfoBtn } from "@/components/marks";
import { GameRow } from "@/components/game-row";

export const Route = createFileRoute("/schedule")({ component: Schedule });

function Schedule() {
  const { data } = useLeague();
  const days = [0, 1, 2, 3].map((n) => addDays(data.asOf, n));
  return (
    <Shell>
      <div className="section-head">
        <div>
          <h2>Next 3 days</h2>
        </div>
        <InfoBtn id="WIN" label="win probability" />
      </div>
      <p className="legend">
        Today through {shortDay(days[3], data.asOf)}. The percent is the fair win chance after the book's cut is removed. Open a game for the projected lineup.
      </p>
      {days.map((date) => {
        const games = data.games.filter((g) => g.date === date);
        return (
          <section key={date}>
            <p className="picker-label">{shortDay(date, data.asOf)}</p>
            {games.length === 0 ? <p className="muted-block">No games.</p> : games.map((g) => <GameRow key={g.id} game={g} />)}
          </section>
        );
      })}
    </Shell>
  );
}
