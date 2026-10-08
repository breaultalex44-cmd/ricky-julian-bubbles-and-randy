import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, House, ListOrdered, RefreshCw, Stethoscope } from "lucide-react";
import { useLeague } from "@/components/providers";

const TABS = [
  { to: "/", label: "Home", icon: House, exact: true },
  { to: "/ranks", label: "Ranks", icon: ListOrdered, exact: false },
  { to: "/schedule", label: "Slate", icon: CalendarDays, exact: false },
  { to: "/injuries", label: "Injuries", icon: Stethoscope, exact: false },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const { status, refresh, data } = useLeague();
  const stamp =
    status === "updating" ? "Updating" : status === "live" ? "Live" : status === "offline" ? "Saved" : "Opening";

  return (
    <div className="phone">
      <header className="topbar">
        <div>
          <p className="wordmark">
            Rinkboard <span>32</span>
          </p>
          <p className="topbar-sub">
            {data.season} · lock {data.cycleLock.slice(5)} · next {data.nextLock.slice(5)}
          </p>
        </div>
        <button type="button" className="pill" onClick={() => refresh()} disabled={status === "updating"}>
          <RefreshCw className={status === "updating" ? "spin" : ""} />
          {stamp}
        </button>
      </header>
      <main className="deck">{children}</main>
      <nav className="tabbar" aria-label="Primary">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              activeOptions={{ exact: tab.exact }}
              className="tab"
              activeProps={{ className: "tab is-active" }}
            >
              <Icon strokeWidth={2} />
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
