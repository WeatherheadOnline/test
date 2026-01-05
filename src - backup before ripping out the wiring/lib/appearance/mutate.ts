// Silent refusal on locked changes is intentional
// No function constructs invalid union members
// No unlock logic exists anywhere else
// All functions preserve immutability & readonly guarantees

import { Appearance } from "@/types/appearance";
import { UnlockId } from "@/types/unlocks";
import { defaultAppearance } from "./default";
import { unlockRules } from "./rules";

/* ─────────────── Shadow ─────────────── */

export function setShadowStyle(
  appearance: Appearance,
  style: ShadowStyle,
  unlocks: UnlockId[]
): Appearance {
  if (style === "none") {
    return {
      ...appearance,
      shadow: { style: "none" },
    };
  }

  const required = unlockRules.shadow[style];
  if (required && !unlocks.includes(required)) {
    return appearance;
  }

  return {
    ...appearance,
    shadow: {
      style,
      colour:
        appearance.shadow.style === "none"
          ? defaultAppearance.shadow.colour
          : appearance.shadow.colour,
    },
  };
}

export function setShadowColour(
  appearance: Appearance,
  colour: string
): Appearance {
  if (appearance.shadow.style === "none") {
    return appearance;
  }

  return {
    ...appearance,
    shadow: {
      ...appearance.shadow,
      colour,
    },
  };
}

/* ─────────────── Border ─────────────── */

export function setBorderThickness(
  appearance: Appearance,
  thickness: BorderThickness,
  unlocks: UnlockId[]
): Appearance {
  const required = unlockRules.border[thickness];
  if (required && !unlocks.includes(required)) {
    return appearance;
  }

  return {
    ...appearance,
    border: {
      ...appearance.border,
      thickness,
    },
  };
}

export function setBorderStyle(
  appearance: Appearance,
  style: "none" | "solid" | "pattern"
): Appearance {
  if (style === "none") {
    return {
      ...appearance,
      border: {
        style: "none",
        thickness: "none",
      },
    };
  }

  return {
    ...appearance,
    border: {
      ...appearance.border,
      style,
      thickness:
        appearance.border.thickness === "none"
          ? "thin"
          : appearance.border.thickness,
    },
  };
}

export function setBorderColour(
  appearance: Appearance,
  colour: string
): Appearance {
  if (appearance.border.style === "none") {
    return appearance;
  }

  return {
    ...appearance,
    border: {
      ...appearance.border,
      primaryColour: colour,
    },
  };
}

/* ─────────────── Fill ─────────────── */

export function setFillStyle(
  appearance: Appearance,
  style: FillStyle,
  unlocks: UnlockId[]
): Appearance {
  const required = unlockRules.fill?.[style];
  if (required && !unlocks.includes(required)) {
    return appearance;
  }

  return {
    ...appearance,
    fill: {
      ...appearance.fill,
      style,
    },
  };
}

export function setFillColour(
  appearance: Appearance,
  colour: string,
  slot: "primary" | "secondary" = "primary"
): Appearance {
  if (slot === "secondary" && appearance.fill.style === "solid") {
    return appearance;
  }

  return {
    ...appearance,
    fill: {
      ...appearance.fill,
      ...(slot === "primary"
        ? { primaryColour: colour }
        : { secondaryColour: colour }),
    },
  };
}

export function setFillStripeDirection(
  appearance: Appearance,
  direction: "horizontal" | "vertical" | "diagonal"
): Appearance {
  if (appearance.fill.style !== "stripes") {
    return appearance;
  }

  return {
    ...appearance,
    fill: {
      ...appearance.fill,
      direction,
    },
  };
}

export function setFillStripeThickness(
  appearance: Appearance,
  thickness: "thin" | "medium" | "thick"
): Appearance {
  if (appearance.fill.style !== "stripes") {
    return appearance;
  }

  return {
    ...appearance,
    fill: {
      ...appearance.fill,
      thickness,
    },
  };
}

