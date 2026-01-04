import { COLOURS } from "./colours";
import { BORDER_COLOUR_USAGE } from "./colourUsage";

export function getBorderColours(
  slot: "primary" | "secondary",
  unlocks: string[]
) {
  return COLOURS.filter(
    c =>
      BORDER_COLOUR_USAGE[slot].includes(c.id as any) &&
      (!c.pack || unlocks.includes(c.pack))
  );
}