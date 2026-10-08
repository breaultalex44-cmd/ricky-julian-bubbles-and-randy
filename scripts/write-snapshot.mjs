import { writeFile } from "node:fs/promises";
import { pullLeague } from "../src/lib/nhl/pull.ts";

const data = await pullLeague({ withRosters: true });
await writeFile(new URL("../src/data/nhl.json", import.meta.url), JSON.stringify(data));
const clubs = Object.values(data.skaters).filter((s) => s.length).length;
console.log(
  JSON.stringify({
    teams: data.teams.length,
    games: data.games.length,
    injuries: data.injuries.length,
    news: data.news.length,
    clubsWithSkaters: clubs,
    asOf: data.asOf,
    cycleLock: data.cycleLock,
    updatedAt: data.updatedAt,
  }),
);
