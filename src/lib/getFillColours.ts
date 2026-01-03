import { COLOURS } from "./colours";
import { FILL_COLOUR_USAGE } from "./colourUsage";

export function getFillColours(
  slot: "primary" | "secondary",
  unlocks: string[]
) {
  return COLOURS.filter(
    c =>
      FILL_COLOUR_USAGE[slot].includes(c.id as any) &&
      (!c.pack || unlocks.includes(c.pack))
  );
}