import { useState, type ReactNode } from "react";
import { Info } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { clubColors } from "@/lib/nhl/colors";
import { useInfo } from "@/components/providers";

export function TeamMark({
  abbrev,
  logo,
  size = "md",
}: {
  abbrev: string;
  logo?: string;
  size?: "sm" | "md" | "lg";
}) {
  const [bad, setBad] = useState(false);
  const cls = size === "lg" ? "mark mark-lg" : size === "sm" ? "mark mark-sm" : "mark";
  return (
    <span className={cls} aria-hidden="true">
      {!bad && logo ? (
        <img src={logo} alt="" width={64} height={64} onError={() => setBad(true)} />
      ) : (
        <span className="mark-fallback">{abbrev}</span>
      )}
    </span>
  );
}

export function Move({ n }: { n: number | null }) {
  if (n == null || n === 0) return <span className="move flat">–</span>;
  if (n > 0) return <span className="move up">+{n}</span>;
  return <span className="move down">{n}</span>;
}

export function InfoBtn({ id, label }: { id: string; label?: string }) {
  const open = useInfo();
  return (
    <button type="button" className="info-btn" aria-label={`What ${label ?? id} means`} onClick={() => open(id)}>
      <Info strokeWidth={2.5} />
    </button>
  );
}

export function ClubLink({
  abbrev,
  logo,
  name,
  sub,
  trailing,
}: {
  abbrev: string;
  logo?: string;
  name: string;
  sub?: string;
  trailing?: ReactNode;
}) {
  const colors = clubColors(abbrev);
  return (
    <Link to="/team/$abbr" params={{ abbr: abbrev }} className="club-link" style={{ background: colors.wash }}>
      <TeamMark abbrev={abbrev} logo={logo} />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold">{name}</span>
        {sub ? <span className="block truncate text-sm text-muted">{sub}</span> : null}
      </span>
      {trailing}
    </Link>
  );
}
