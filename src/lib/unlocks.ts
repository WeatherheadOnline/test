// -----------------------------
// Unlock ID types
// -----------------------------
export type UnlockId =
  | `style.${string}`
  | `palette.${string}`;

// -----------------------------
// Unlock rule definition
// -----------------------------
export type UnlockRule =
  | {
      threshold: number;
      type: "style";
      id: UnlockId;
    }
  | {
      threshold: number;
      type: "palette";
      id: UnlockId;
    };

// -----------------------------
// Default unlocks
// -----------------------------

// Logged out (preview mode)
export const DEFAULT_UNLOCKS_PREVIEW: UnlockId[] = [
  // styles
  "style.fill.solid",
  "style.border.none",
  "style.border.solid",
  "style.shadow.none",
  "style.shadow.soft",

  // palettes
  "palette.fill.solid.basicNeutrals",
  "palette.fill.solid.basicBrights",
  "palette.border.single.basicFrame",
  "palette.shadow.single.basicShadow",
];

// Logged in (authenticated, flip_count = 0)
export const DEFAULT_UNLOCKS_AUTHENTICATED: UnlockId[] = [
  // styles
  "style.fill.solid",
  "style.border.none",
  "style.border.solid",
  "style.shadow.none",
  "style.shadow.soft",

  // fill palettes
  "palette.fill.solid.basicNeutrals",
  "palette.fill.solid.basicBrights",

  // first basic palette per other scope
  "palette.fill.gradient.basicContrast",
  "palette.fill.stripes.basicStripes",
  "palette.border.single.basicFrame",
  "palette.shadow.single.basicShadow",
];

// -----------------------------
// Unlock timeline (data only)
// -----------------------------
export const UNLOCK_RULES: UnlockRule[] = [
  // 4
  {
    threshold: 4,
    type: "palette",
    id: "palette.fill.solid.softPastels",
  },

  // 8
  {
    threshold: 8,
    type: "palette",
    id: "palette.fill.solid.deepJewelTones",
  },

  // 16
  {
    threshold: 16,
    type: "palette",
    id: "palette.border.single.darkEmphasis",
  },

  // 32
  {
    threshold: 32,
    type: "style",
    id: "style.fill.gradient",
  },

  // 64
  {
    threshold: 64,
    type: "palette",
    id: "palette.fill.gradient.sunsetGlow",
  },

  // 128
  {
    threshold: 128,
    type: "style",
    id: "style.fill.stripes",
  },

  // 192
  {
    threshold: 192,
    type: "palette",
    id: "palette.fill.stripes.candyCane",
  },

  // 256
  {
    threshold: 256,
    type: "style",
    id: "style.shadow.hard",
  },

  // 320
  {
    threshold: 320,
    type: "palette",
    id: "palette.shadow.single.coolShadow",
  },

  // 384
  {
    threshold: 384,
    type: "style",
    id: "style.shadow.standing",
  },
];

// -----------------------------
// Unlock resolution
// -----------------------------
export function resolveUnlocks(params: {
  mode: "authenticated" | "preview";
  flipCount: number;
}): Set<UnlockId> {
  const { mode, flipCount } = params;

  const unlocked = new Set<UnlockId>(
    mode === "authenticated"
      ? DEFAULT_UNLOCKS_AUTHENTICATED
      : DEFAULT_UNLOCKS_PREVIEW
  );

  // Preview mode never progresses
  if (mode === "preview") {
    return unlocked;
  }

  for (const rule of UNLOCK_RULES) {
    if (flipCount >= rule.threshold) {
      unlocked.add(rule.id);
    }
  }

  return unlocked;
}