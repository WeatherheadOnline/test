"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import BitDisplay from "@/components/BitDisplay/BitDisplay";
import CustomiseMenu from "@/components/CustomiseMenu/CustomiseMenu";
import "./bitExperience.css";
import FlipToast from "@/components/FlipToast";
import UnlockToast from "../UnlockToast";
import { resolveUnlocks } from "@/lib/unlocks";
import { PATTERNS, type PatternOption } from "@/lib/patterns";
import { useUser } from "@/providers/UserProvider";
import { supabase } from "@/lib/supabase";
import { getNewUnlocks, isUnlockId, type UnlockId } from "@/lib/unlocks";
import { Appearance } from "@/lib/appearance";
import { DEFAULT_APPEARANCE } from "@/lib/defaultAppearance";

type BitExperienceProps = {
  mode: "authenticated" | "preview";
  value: "0" | "1";
  flipCount: number;
  onFlip: () => void;
  flipPending?: boolean;
  showShare?: boolean;
  onShare?: () => void;
};

function resolvePattern(
  patternId: string | null | undefined,
): PatternOption | null {
  const pattern = patternId ? patternId : "checker";
  return PATTERNS.find((p) => p.patternId === pattern) ?? null;
}

export default function BitExperience({
  mode,
  value,
  flipCount,
  onFlip,
  showShare = false,
  onShare,
  flipPending = false,
}: BitExperienceProps) {
  const [flipToastKey, setFlipToastKey] = useState<number | null>(null);
  const [unlockToasts, setUnlockToasts] = useState<string[]>([]);
  const flipButtonRef = useRef<HTMLButtonElement | null>(null);
  const flipToastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasMountedRef = useRef(false);
  const prevUnlockedRef = useRef<Set<string> | null>(null);

  type FillStyle = "solid" | "gradient" | "stripes" | "pattern";
  type StripeThickness = "thin" | "medium" | "thick";
  type StripeDirection = "horizontal" | "vertical" | "diagonalL" | "diagonalR";

  type BorderStyle = "none" | "solid";
  type BorderThickness = "thin" | "medium" | "thick";

  type ShadowStyle = "none" | "soft" | "hard" | "standing";

  // type Appearance = {
  //   fill: {
  //     fillStyle: FillStyle;
  //     fillPrimaryColor: string | null;
  //     gradientColorPair: string | null;
  //     stripeColorPair: string | null;
  //     stripeThickness: StripeThickness;
  //     stripeDirection: StripeDirection;
  //     patternId: string | null;
  //   };
  //   border: {
  //     borderStyle: BorderStyle;
  //     borderThickness: BorderThickness;
  //     borderColour: string | null;
  //   };
  //   shadow: {
  //     shadowStyle: ShadowStyle;
  //     shadowColour: string | null;
  //   };
  // };

  type AppearanceAction =
    | { type: "SET_FILL_STYLE"; fillStyle: FillStyle }
    | { type: "SET_BORDER_STYLE"; borderStyle: BorderStyle }
    | { type: "SET_SHADOW_STYLE"; shadowStyle: ShadowStyle }
    | { type: "SET_FILL_PRIMARY_COLOR"; color: string }
    | {
        type: "SET_FILL_COLOR_PAIR";
        target: "gradient" | "stripes";
        pair: string;
      }
    | { type: "SET_STRIPE_THICKNESS"; thickness: StripeThickness }
    | { type: "SET_STRIPE_DIRECTION"; direction: StripeDirection }
    | { type: "SET_PATTERN"; patternId: string }
    | { type: "SET_BORDER_THICKNESS"; thickness: BorderThickness }
    | { type: "SET_BORDER_COLOUR"; colour: string }
    | { type: "SET_SHADOW_COLOUR"; colour: string };

  const { user, profile, profileLoading, updateProfileOptimistic } = useUser();

  const updateAppearanceOptimistic = (partial: Partial<Appearance>) => {
    if (mode !== "authenticated" || !profile) return;

    updateProfileOptimistic({
      appearance: {
        ...profile.appearance,
        ...partial,
      },
    });
  };

  const saveUnlocks = useMemo(
    () =>
      debounce(async (newUnlocks: UnlockId[]) => {
        if (!user || newUnlocks.length === 0) return;

        const merged = Array.from(
          new Set([...(profile?.unlocks ?? []), ...newUnlocks]),
        );

        const { error } = await supabase
          .from("profiles")
          .update({ unlocks: merged })
          .eq("id", user.id);

        if (error) {
          console.error("Failed to save unlocks:", error);
        }
      }, 300),
    [user, profile?.unlocks],
  );

  // const unlocked = useMemo(
  //   () =>
  //     resolveUnlocks({
  //       mode,
  //       flipCount,
  //     }),
  //   [mode, flipCount],
  // );
  // const unlocked = useMemo(
  //   () => new Set(profile?.unlocks ?? []),
  //   [profile?.unlocks],
  // );
  // Calculate unlocked items directly
  const unlocked: Set<UnlockId> = (() => {
    if (mode === "preview") {
      return resolveUnlocks({ mode, flipCount });
    }

    // const persisted = new Set(profile?.unlocks ?? []);
    const persisted = new Set((profile?.unlocks ?? []).filter(isUnlockId));
    const newUnlocks = getNewUnlocks({ flipCount, existingUnlocks: persisted });

    return new Set([...persisted, ...newUnlocks]);
  })();

  useEffect(() => {
    if (mode !== "authenticated" || !profile) return;

    // const persisted = new Set(profile?.unlocks ?? []);
    const persisted = new Set<UnlockId>(
      (profile?.unlocks ?? []).filter(isUnlockId),
    );
    const newUnlocks = getNewUnlocks({ flipCount, existingUnlocks: persisted });

    if (newUnlocks.length > 0) {
      // Show unlock toasts
      const labels = newUnlocks
        .map(unlockIdToToastLabel)
        .filter((l): l is string => l !== null);

      setUnlockToasts(labels);

      // Persist new unlocks to backend
      saveUnlocks(newUnlocks);
    }
  }, [flipCount, profile, mode, saveUnlocks]);

  function unlockIdToToastLabel(unlockId: string): string | null {
    if (unlockId.startsWith("style.fill.gradient"))
      return "Gradient fill unlocked";
    if (unlockId.startsWith("style.fill.stripes"))
      return "Stripe fill unlocked";

    if (unlockId.startsWith("palette.fill")) return "New fill colours unlocked";
    if (unlockId.startsWith("palette.border"))
      return "New border colours unlocked";
    if (unlockId.startsWith("palette.shadow"))
      return "New shadow colours unlocked";

    if (unlockId.startsWith("style.shadow")) return "New shadow style unlocked";

    return null;
  }

  function debounce<F extends (...args: any[]) => void>(fn: F, delay: number) {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<F>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  }

  const persistedUnlocks = useMemo<Set<UnlockId>>(() => {
    if (!profile?.unlocks) return new Set();
    return new Set(profile.unlocks.filter(isUnlockId));
  }, [profile?.unlocks]);

  const newlyUnlocked = useMemo(() => {
    if (mode !== "authenticated" || !profile) return [];
    return getNewUnlocks({
      flipCount,
      existingUnlocks: persistedUnlocks,
    });
  }, [flipCount, persistedUnlocks, profile, mode]);

  function appearanceReducer(
    state: Appearance,
    action: AppearanceAction,
  ): Appearance {
    switch (action.type) {
      case "SET_FILL_STYLE":
        return {
          ...state,
          fill: {
            ...state.fill,
            fillStyle: action.fillStyle,
          },
        };

      case "SET_BORDER_STYLE":
        return {
          ...state,
          border: {
            ...state.border,
            borderStyle: action.borderStyle,
          },
        };

      case "SET_SHADOW_STYLE":
        return {
          ...state,
          shadow: {
            ...state.shadow,
            shadowStyle: action.shadowStyle,
          },
        };

      case "SET_FILL_PRIMARY_COLOR":
        return {
          ...state,
          fill: {
            ...state.fill,
            fillPrimaryColor: action.color,
          },
        };

      case "SET_FILL_COLOR_PAIR":
        return {
          ...state,
          fill: {
            ...state.fill,
            gradientColorPair:
              action.target === "gradient"
                ? action.pair
                : state.fill.gradientColorPair,
            stripeColorPair:
              action.target === "stripes"
                ? action.pair
                : state.fill.stripeColorPair,
          },
        };

      case "SET_STRIPE_THICKNESS":
        return {
          ...state,
          fill: {
            ...state.fill,
            stripeThickness: action.thickness,
          },
        };

      case "SET_STRIPE_DIRECTION":
        return {
          ...state,
          fill: {
            ...state.fill,
            stripeDirection: action.direction,
          },
        };

      case "SET_PATTERN":
        return {
          ...state,
          fill: {
            ...state.fill,
            patternId: action.patternId,
          },
        };

      case "SET_BORDER_THICKNESS":
        return {
          ...state,
          border: {
            ...state.border,
            borderThickness: action.thickness,
          },
        };

      case "SET_BORDER_COLOUR":
        return {
          ...state,
          border: {
            ...state.border,
            borderColour: action.colour,
          },
        };

      case "SET_SHADOW_COLOUR":
        return {
          ...state,
          shadow: {
            ...state.shadow,
            shadowColour: action.colour,
          },
        };

      default:
        return state;
    }
  }

  // const initialAppearanceDefault: Appearance = {
  //   fill: {
  //     fillStyle: "solid",
  //     fillPrimaryColor: "#000000",
  //     gradientColorPair: "#AAAAAA | #000000",
  //     stripeColorPair: "#880000 | #000000",
  //     stripeThickness: "medium",
  //     stripeDirection: "horizontal",
  //     patternId: null,
  //   },
  //   border: {
  //     borderStyle: "none",
  //     borderThickness: "medium",
  //     borderColour: null,
  //   },
  //   shadow: {
  //     shadowStyle: "none",
  //     shadowColour: null,
  //   },
  // };

  // debounced save function
  const saveAppearance = useMemo(
    () =>
      debounce(async (appearance: Appearance) => {
        if (!user) return;

        //  Skip if unchanged
        if (
          JSON.stringify(appearance) ===
          JSON.stringify(lastSavedAppearanceRef.current)
        ) {
          return;
        }

        const { error } = await supabase
          .from("profiles")
          .update({ appearance })
          .eq("id", user.id);

        if (!error) {
          lastSavedAppearanceRef.current = appearance; // update last saved
        } else {
          console.error("Failed to save appearance:", error);
        }
      }, 500),
    [user],
  );

  // useEffect(() => {
  //   if (mode !== "authenticated" || !profile) return;
  //   if (newlyUnlocked.length === 0) return;

  //   saveUnlocks(newlyUnlocked);
  // }, [newlyUnlocked, saveUnlocks, mode]);

  // useEffect(() => {
  //   if (mode !== "authenticated" || !profile) return;

  //   const persisted = new Set(profile?.unlocks ?? []);
  //   const newUnlocks = getNewUnlocks({ flipCount, existingUnlocks: persisted });

  //   if (newUnlocks.length > 0) {
  //     const labels = newUnlocks
  //       .map(unlockIdToToastLabel)
  //       .filter((l): l is string => l !== null);

  //     setUnlockToasts(labels);

  //     // Later: call saveUnlocks(newUnlocks) to persist
  //   }
  // }, [flipCount, profile, mode]);

  // const [appearance, dispatchAppearance] = useReducer(
  //   appearanceReducer,
  //   profile && profile.appearance
  //     ? profile.appearance
  //     : initialAppearanceDefault,
  // );
  // const [appearance, dispatchAppearance] = useReducer(
  //   appearanceReducer,
  //   mode === "preview"
  //     ? DEFAULT_APPEARANCE
  //     : (profile?.appearance as Appearance),
  // );
  //   const lastSavedAppearanceRef = useRef<Appearance | null>(
  //     profile?.appearance ?? null,
  //   );

  const initialAppearance: Appearance =
    mode === "authenticated"
      ? (profile?.appearance ?? DEFAULT_APPEARANCE)
      : DEFAULT_APPEARANCE;

  const [appearance, dispatchAppearance] = useReducer(
    appearanceReducer,
    initialAppearance,
  );

  const lastSavedAppearanceRef = useRef<Appearance | null>(
    mode === "authenticated" ? (profile?.appearance ?? null) : null,
  );

  const unlockIdToLabel = (id: string): string | null => {
    if (id.startsWith("fill:")) return "Fill";
    if (id.startsWith("border:")) return "Border";
    if (id.startsWith("shadow:")) return "Shadow";
    return null;
  };

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    // flipCount changed due to a user flip
    setFlipToastKey(Date.now());
  }, [flipCount]);

  const resolvedPattern = resolvePattern(appearance.fill.patternId);

  const fillWithPattern = {
    ...appearance.fill,
    patternURL: resolvedPattern?.patternURL,
    patternRepeat: resolvedPattern?.patternRepeat,
  };

  // watch reducer changes
  // useEffect(() => {
  //   saveAppearance(appearance);
  // }, [appearance, saveAppearance]);
  useEffect(() => {
    if (mode === "authenticated") {
      // Only save for authenticated users
      saveAppearance(appearance);
    }
  }, [appearance, saveAppearance]);

  // useEffect(() => {
  //   if (mode === "preview") {
  //     localStorage.setItem("previewAppearance", JSON.stringify(appearance));
  //     return;
  //   }

  //   // save to backend (debounced) and update context immediately
  //   saveAppearance(appearance);
  //   if (user) {
  //     updateAppearance?.(appearance);
  //   }
  // }, [appearance, mode, saveAppearance, updateAppearance, user]);

  return (
    <div className="dashboard-container section-wrapper">
      {/* Flip count card */}
      <div className="flip-count-card" aria-live="polite">
        <p>
          <span>You have </span>
          <span>flipped:</span>
        </p>
        <p className="bit-count-binary">{flipCount.toString(2)}</p>
        <p className="bit-count-base10">({flipCount})</p>
        <p>bits</p>
      </div>

      <div className="bit-flip-wrapper">
        {/* Flip toast */}
        {flipToastKey !== null && <FlipToast key={flipToastKey} />}

        {/* Giant bit */}
        {(!profileLoading || mode === "preview") && (
          <BitDisplay
            value={value}
            fill={fillWithPattern}
            border={appearance.border}
            shadow={appearance.shadow}
          />
        )}

        {/* Flip switch */}
        <button
          ref={flipButtonRef}
          type="button"
          role="switch"
          aria-checked={value === "1"}
          onClick={onFlip}
          disabled={flipPending}
          style={{
            marginTop: "2rem",
            width: "96px",
            height: "44px",
            position: "relative",
            zIndex: 20,
            padding: 0,
            border: "none",
            background: "none",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: flipPending ? "unset" : "pointer",
            opacity: flipPending ? 0.5 : 1,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: "999px",
              backgroundColor: "#bdbdbd",
              border: "2px solid #888888",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 14px",
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#000",
                zIndex: 2,
              }}
            >
              <span>0</span>
              <span>1</span>
            </span>

            <span
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                backgroundColor: "#fff",
                outline: "3px solid #555",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                transform: value === "1" ? "translateX(52px)" : "translateX(0)",
                transition: "transform 200ms ease",
                zIndex: 1,
              }}
            />
          </span>
        </button>
      </div>

      {showShare && onShare && (
        <img
          src="/assets/share.svg"
          role="button"
          aria-label="Share"
          onClick={onShare}
        />
      )}

      {unlockToasts.map((label, i) => (
        <UnlockToast key={`${label}-${i}`} label={label} />
      ))}

      <CustomiseMenu
        ignoreRef={flipButtonRef}
        unlocked={unlocked}
        // Fill
        fillStyle={appearance.fill.fillStyle}
        onFillStyleChange={(style) => {
          dispatchAppearance({ type: "SET_FILL_STYLE", fillStyle: style });
          updateAppearanceOptimistic({
            fill: { ...appearance.fill, fillStyle: style },
          });
        }}
        onFillPrimaryColorChange={(color) => {
          dispatchAppearance({ type: "SET_FILL_PRIMARY_COLOR", color });
          updateAppearanceOptimistic({
            fill: { ...appearance.fill, fillPrimaryColor: color },
          });
        }}
        onFillColorPairChange={(target, pair) => {
          dispatchAppearance({ type: "SET_FILL_COLOR_PAIR", target, pair });
          if (target === "gradient") {
            updateAppearanceOptimistic({
              fill: { ...appearance.fill, gradientColorPair: pair },
            });
          } else {
            updateAppearanceOptimistic({
              fill: { ...appearance.fill, stripeColorPair: pair },
            });
          }
        }}
        onStripeThicknessChange={(thickness) => {
          dispatchAppearance({ type: "SET_STRIPE_THICKNESS", thickness });
          updateAppearanceOptimistic({
            fill: { ...appearance.fill, stripeThickness: thickness },
          });
        }}
        onStripeDirectionChange={(direction) => {
          dispatchAppearance({ type: "SET_STRIPE_DIRECTION", direction });
          updateAppearanceOptimistic({
            fill: { ...appearance.fill, stripeDirection: direction },
          });
        }}
        onPatternChange={(patternId) => {
          dispatchAppearance({ type: "SET_PATTERN", patternId });
          updateAppearanceOptimistic({
            fill: { ...appearance.fill, patternId },
          });
        }}
        // Border
        borderStyle={appearance.border.borderStyle}
        onBorderStyleChange={(style) => {
          dispatchAppearance({ type: "SET_BORDER_STYLE", borderStyle: style });
          updateAppearanceOptimistic({
            border: { ...appearance.border, borderStyle: style },
          });
        }}
        onBorderThicknessChange={(thickness) => {
          dispatchAppearance({ type: "SET_BORDER_THICKNESS", thickness });
          updateAppearanceOptimistic({
            border: { ...appearance.border, borderThickness: thickness },
          });
        }}
        onBorderColourChange={(colour) => {
          dispatchAppearance({ type: "SET_BORDER_COLOUR", colour });
          updateAppearanceOptimistic({
            border: { ...appearance.border, borderColour: colour },
          });
        }}
        // Shadow
        shadowStyle={appearance.shadow.shadowStyle}
        onShadowStyleChange={(style) => {
          dispatchAppearance({ type: "SET_SHADOW_STYLE", shadowStyle: style });
          updateAppearanceOptimistic({
            shadow: { ...appearance.shadow, shadowStyle: style },
          });
        }}
        onShadowColourChange={(colour) => {
          dispatchAppearance({ type: "SET_SHADOW_COLOUR", colour });
          updateAppearanceOptimistic({
            shadow: { ...appearance.shadow, shadowColour: colour },
          });
        }}
      />
    </div>
  );
}
