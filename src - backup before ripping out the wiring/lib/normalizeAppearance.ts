import { Appearance } from "@/types/appearance";
import { defaultAppearance } from "@/lib/defaultAppearance";
import type { UnlockId } from "@/lib/unlocks";

/* ---------- Shadow ---------- */

function normalizeShadow(
  raw: Partial<Appearance["shadow"]> | undefined
): Appearance["shadow"] {
  if (!raw || raw.style === "none") {
    return { style: "none" };
  }

  switch (raw.style) {
    case "soft":
    case "hard":
    case "grounded":
      return {
        style: raw.style,
        colour: raw.colour ?? "#000000",
      };

    default:
      return { style: "none" };
  }
}

/* ---------- Fill ---------- */

function normalizeFill(
  raw: Partial<Appearance["fill"]> | undefined,
  unlocks: UnlockId[]
): Appearance["fill"] {
  const base = {
    ...defaultAppearance.fill,
    ...raw,
  };

  if (base.style === "gradient" && !unlocks.includes("fill:gradient")) {
    return {
      ...base,
      style: "solid",
    };
  }

  return base;
}

/* ---------- Border ---------- */

function normalizeBorder(
  raw: Partial<Appearance["border"]> | undefined
): Appearance["border"] {
  return {
    ...defaultAppearance.border,
    ...raw,
  };
}

/* ---------- Appearance ---------- */

export function normalizeAppearance(
  raw: Partial<Appearance> | undefined,
  unlocks: UnlockId[]
): Appearance {
  return {
    fill: normalizeFill(raw?.fill, unlocks),
    border: normalizeBorder(raw?.border),
    shadow: normalizeShadow(raw?.shadow),
  };
}
