/** Club colors for marks and favourite hero. Not official marks — color only. */
export const CLUB: Record<string, { ink: string; wash: string }> = {
  ANA: { ink: "#F47A38", wash: "#1c140e" },
  BOS: { ink: "#FFB81C", wash: "#1a160c" },
  BUF: { ink: "#7BA4E0", wash: "#0c1424" },
  CGY: { ink: "#E05A4F", wash: "#1c1010" },
  CAR: { ink: "#E23B3B", wash: "#1a1012" },
  CHI: { ink: "#E24B4B", wash: "#1a1012" },
  COL: { ink: "#C1496A", wash: "#1a1016" },
  CBJ: { ink: "#6E93D6", wash: "#0e1422" },
  DAL: { ink: "#3EBE7A", wash: "#0c1812" },
  DET: { ink: "#E23B4A", wash: "#1a1012" },
  EDM: { ink: "#FF6A2A", wash: "#1a120e" },
  FLA: { ink: "#E23B4A", wash: "#1a1210" },
  LAK: { ink: "#C5CCD1", wash: "#14181c" },
  MIN: { ink: "#3EBE7A", wash: "#0e1814" },
  MTL: { ink: "#E04A56", wash: "#1a1014" },
  NSH: { ink: "#F0B429", wash: "#1a160c" },
  NJD: { ink: "#E23B4A", wash: "#1a1012" },
  NYI: { ink: "#4C93E0", wash: "#0e1624" },
  NYR: { ink: "#4C7FE0", wash: "#101628" },
  OTT: { ink: "#E04A56", wash: "#1a1210" },
  PHI: { ink: "#F26B3A", wash: "#1a120e" },
  PIT: { ink: "#F0B429", wash: "#1a160e" },
  SJS: { ink: "#3DB8C2", wash: "#0c181a" },
  SEA: { ink: "#7ED0D0", wash: "#0c1618" },
  STL: { ink: "#6E93E0", wash: "#101628" },
  TBL: { ink: "#6E93E0", wash: "#0e1422" },
  TOR: { ink: "#6E93E0", wash: "#0e1424" },
  UTA: { ink: "#7EB4D6", wash: "#101820" },
  VAN: { ink: "#3EBE7A", wash: "#0c1814" },
  VGK: { ink: "#D4B36A", wash: "#18160e" },
  WPG: { ink: "#6E93E0", wash: "#10141e" },
  WSH: { ink: "#E23B4A", wash: "#1a1014" },
};

export function clubColors(abbrev: string): { ink: string; wash: string } {
  return CLUB[abbrev] ?? { ink: "#3dbeff", wash: "#101820" };
}
