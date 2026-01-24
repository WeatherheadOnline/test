"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import BitDisplay from "@/components/BitDisplay/BitDisplay";
import CustomiseMenu from "@/components/CustomiseMenu/CustomiseMenu";
import "./bitExperience.css";
import FlipToast from "@/components/FlipToast";
import UnlockToast from "../UnlockToast";
import { resolveUnlocks } from "@/lib/unlocks";
import { PATTERNS, type PatternOption } from "@/lib/patterns";

type BitExperienceProps = {
  mode: "authenticated" | "preview";

  value: "0" | "1";
  flipCount: number;

  onFlip: () => void;

  showShare?: boolean;
  onShare?: () => void;

  flipPending?: boolean;
};

function resolvePattern(patternId: string | null | undefined): PatternOption | null {
  if (!patternId) return null;
  return PATTERNS.find(p => p.patternId === patternId) ?? null;
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

  type Appearance = {
    fill: {
      fillStyle: FillStyle;
      fillPrimaryColor: string | null;
      gradientColorPair: string | null;
      stripeColorPair: string | null;
      stripeThickness: StripeThickness;
      stripeDirection: StripeDirection;
      patternId: string | null;
    };
    border: {
      borderStyle: BorderStyle;
      borderThickness: BorderThickness;
      borderColour: string | null;
    };
    shadow: {
      shadowStyle: ShadowStyle;
      shadowColour: string | null;
    };
  };

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

  const unlocked = useMemo(
    () =>
      resolveUnlocks({
        mode,
        flipCount,
      }),
    [mode, flipCount],
  );

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

  useEffect(() => {
    if (!prevUnlockedRef.current) {
      prevUnlockedRef.current = unlocked;
      return;
    }

    const newlyUnlocked: string[] = [];

    for (const id of unlocked) {
      if (!prevUnlockedRef.current.has(id)) {
        newlyUnlocked.push(id);
      }
    }

    if (newlyUnlocked.length > 0) {
      // setUnlockToasts((prev) => {
      //   const labels = newlyUnlocked
      //     .map(unlockIdToToastLabel)
      //     .filter((l): l is string => Boolean(l));

      //   return labels.length > 0 ? [...prev, ...labels] : prev;
      // });
      setUnlockToasts((prev) => {
        const labels = newlyUnlocked
          .map(unlockIdToToastLabel)
          .filter((l): l is string => Boolean(l));

        if (labels.length === 0) return prev;

        return [...prev, labels.join("\n")];
      });
    }

    prevUnlockedRef.current = unlocked;
  }, [unlocked]);

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

  const initialAppearance: Appearance = {
    fill: {
      fillStyle: "solid",
      fillPrimaryColor: "#000000",
      gradientColorPair: "#AAAAAA | #000000",
      stripeColorPair: "#880000 | #000000",
      stripeThickness: "medium",
      stripeDirection: "horizontal",
      patternId: null,
    },
    border: {
      borderStyle: "none",
      borderThickness: "medium",
      borderColour: null,
    },
    shadow: {
      shadowStyle: "none",
      shadowColour: null,
    },
  };

  const [appearance, dispatchAppearance] = useReducer(
    appearanceReducer,
    initialAppearance,
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
        <BitDisplay
          value={value}
          fill={fillWithPattern}
          border={appearance.border}
          shadow={appearance.shadow}
        />

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
        fillStyle={appearance.fill.fillStyle}
        onFillStyleChange={(style) =>
          dispatchAppearance({ type: "SET_FILL_STYLE", fillStyle: style })
        }
        onFillPrimaryColorChange={(color) =>
          dispatchAppearance({ type: "SET_FILL_PRIMARY_COLOR", color })
        }
        borderStyle={appearance.border.borderStyle}
        onBorderStyleChange={(style) =>
          dispatchAppearance({ type: "SET_BORDER_STYLE", borderStyle: style })
        }
        shadowStyle={appearance.shadow.shadowStyle}
        onShadowStyleChange={(style) =>
          dispatchAppearance({ type: "SET_SHADOW_STYLE", shadowStyle: style })
        }
        onFillColorPairChange={(target, pair) =>
          dispatchAppearance({
            type: "SET_FILL_COLOR_PAIR",
            target,
            pair,
          })
        }
        onStripeThicknessChange={(thickness) =>
          dispatchAppearance({ type: "SET_STRIPE_THICKNESS", thickness })
        }
        onStripeDirectionChange={(direction) =>
          dispatchAppearance({ type: "SET_STRIPE_DIRECTION", direction })
        }
        onBorderThicknessChange={(thickness) =>
          dispatchAppearance({ type: "SET_BORDER_THICKNESS", thickness })
        }
        onBorderColourChange={(colour) =>
          dispatchAppearance({ type: "SET_BORDER_COLOUR", colour })
        }
        onShadowColourChange={(colour) =>
          dispatchAppearance({ type: "SET_SHADOW_COLOUR", colour })
        }
        onPatternChange={(patternId) =>
  dispatchAppearance({ type: "SET_PATTERN", patternId })
}
      />
    </div>
  );
}
