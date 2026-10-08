import { createServerFn } from "@tanstack/react-start";
import { pullClub, pullLeague } from "./pull";

export const refreshLeague = createServerFn({ method: "GET" }).handler(async () => {
  return pullLeague({ withRosters: false });
});

export const refreshClub = createServerFn({ method: "POST" })
  .validator((abbrev: string) => {
    const clean = abbrev.toUpperCase();
    if (!/^[A-Z]{2,4}$/.test(clean)) throw new Error("Unknown club");
    return clean;
  })
  .handler(async ({ data }) => pullClub(data));
