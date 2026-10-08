import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import snapshot from "@/data/nhl.json";
import { refreshClub, refreshLeague } from "@/lib/nhl/refresh";
import type { Goalie, LeagueData, Skater } from "@/lib/nhl/pull";
import { STATS } from "@/lib/nhl/hockey";

const seed = snapshot as LeagueData;

type Status = "snapshot" | "live" | "updating" | "offline";

type LeagueCtx = {
  data: LeagueData;
  status: Status;
  refresh: () => void;
  loadClub: (abbrev: string) => void;
};

const LeagueContext = createContext<LeagueCtx | null>(null);

export function useLeague(): LeagueCtx {
  const ctx = useContext(LeagueContext);
  if (!ctx) throw new Error("League missing");
  return ctx;
}

type FavCtx = { fav: string | null; ready: boolean; setFav: (abbrev: string | null) => void };
const FavContext = createContext<FavCtx | null>(null);

export function useFav(): FavCtx {
  const ctx = useContext(FavContext);
  if (!ctx) throw new Error("Favourite missing");
  return ctx;
}

const InfoContext = createContext<(id: string | null) => void>(() => {});

export function useInfo(): (id: string | null) => void {
  return useContext(InfoContext);
}

const FAV_KEY = "rinkboard-fav";

export function Providers({ children }: { children: ReactNode }) {
  const [data, setData] = useState<LeagueData>(seed);
  const [status, setStatus] = useState<Status>("snapshot");
  const [fav, setFavState] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [stat, setStat] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setStatus((s) => (s === "updating" ? s : "updating"));
    refreshLeague()
      .then((live) => {
        if (!live || live.teams.length < 32) {
          setStatus("offline");
          return;
        }
        setData((prev) => ({
          ...live,
          skaters: Object.keys(live.skaters).length ? live.skaters : prev.skaters,
          goalies: Object.keys(live.goalies).length ? live.goalies : prev.goalies,
        }));
        setStatus("live");
      })
      .catch(() => setStatus("offline"));
  }, []);

  const loadClub = useCallback((abbrev: string) => {
    refreshClub({ data: abbrev })
      .then((club: { skaters: Skater[]; goalies: Goalie[] }) => {
        if (!club.skaters.length && !club.goalies.length) return;
        setData((prev) => ({
          ...prev,
          skaters: { ...prev.skaters, [abbrev]: club.skaters },
          goalies: { ...prev.goalies, [abbrev]: club.goalies },
        }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(FAV_KEY);
    if (saved && seed.teams.some((t) => t.abbrev === saved)) setFavState(saved);
    setReady(true);
    refresh();
  }, [refresh]);

  const setFav = useCallback((abbrev: string | null) => {
    setFavState(abbrev);
    if (abbrev) localStorage.setItem(FAV_KEY, abbrev);
    else localStorage.removeItem(FAV_KEY);
  }, []);

  const league = useMemo<LeagueCtx>(
    () => ({ data, status, refresh, loadClub }),
    [data, status, refresh, loadClub],
  );

  const copy = stat ? STATS[stat] : null;

  return (
    <LeagueContext.Provider value={league}>
      <FavContext.Provider value={{ fav, ready, setFav }}>
        <InfoContext.Provider value={setStat}>
          {children}
          {copy ? (
            <div className="sheet-root" role="presentation" onClick={() => setStat(null)}>
              <div
                className="sheet"
                role="dialog"
                aria-modal="true"
                aria-labelledby="stat-title"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sheet-handle" />
                <p className="eyebrow">For new fans</p>
                <h2 id="stat-title">{copy.title}</h2>
                <p className="sheet-body">{copy.body}</p>
                <button type="button" className="btn-block" onClick={() => setStat(null)}>
                  Got it
                </button>
              </div>
            </div>
          ) : null}
        </InfoContext.Provider>
      </FavContext.Provider>
    </LeagueContext.Provider>
  );
}
