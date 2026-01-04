import { COLOURS } from "./colours";
import { SHADOW_COLOUR_USAGE } from "./colourUsage";

export function getShadowColours(unlocks: string[]) {
  return COLOURS.filter(
    c =>
      SHADOW_COLOUR_USAGE.colour.includes(c.id as any) &&
      (!c.pack || unlocks.includes(c.pack))
  );
}