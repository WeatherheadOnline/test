"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import BitDisplay from "@/components/BitDisplay/BitDisplay";
import CustomiseMenu from "@/components/CustomiseMenu/CustomiseMenu";
import "./bitExperience.css";
import FlipToast from "@/components/FlipToast";
import UnlockToast from "../UnlockToast";

type BitExperienceProps = {
  mode: "authenticated" | "preview";

  value: "0" | "1";
  flipCount: number;

  onFlip: () => void;

  showShare?: boolean;
  onShare?: () => void;

  flipPending?: boolean;
};

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
  const flipButtonRef = useRef<HTMLButtonElement | null>(null);
  const flipToastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasMountedRef = useRef(false);
  const [unlockToasts, setUnlockToasts] = useState<string[]>([]);

  type FillStyle = "solid" | "gradient" | "stripes" | "pattern";
  type StripeThickness = "thin" | "medium" | "thick";
  type StripeDirection = "horizontal" | "vertical" | "diagonalL" | "diagonalR";
  type PatternSize = "small" | "medium" | "large";

  type BorderStyle = "none" | "solid" | "pattern";
  type BorderThickness = "thin" | "medium" | "thick";

  type ShadowStyle = "none" | "soft" | "hard" | "standing";

  type Appearance = {
    fill: {
      fillStyle: FillStyle;
      fillPrimaryColor: string | null;
      fillSecondaryColor: string | null;
      // fillColorPair: string | null;
      gradientColorPair: string | null;
      stripeColorPair: string | null;
      stripeThickness: StripeThickness;
      stripeDirection: StripeDirection;
      patternId: string | null;
      patternSize: PatternSize;
      image: string | null;
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
    // | { type: "SET_FILL_COLOR_PAIR"; pair: string }
    | {
        type: "SET_FILL_COLOR_PAIR";
        target: "gradient" | "stripes";
        pair: string;
      }
    | { type: "SET_STRIPE_THICKNESS"; thickness: StripeThickness }
    | { type: "SET_STRIPE_DIRECTION"; direction: StripeDirection };

  function appearanceReducer(
    state: Appearance,
    action: AppearanceAction
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
            // clear incompatible selections
            // fillColorPair: null,
            // gradientColorPair: null,
            // stripeColorPair: null,
          },
        };

      // case "SET_FILL_COLOR_PAIR":
      //   return {
      //     ...state,
      //     fill: {
      //       ...state.fill,
      //       fillColorPair: action.pair,
      //       // gradients/stripes override single colours
      //       fillPrimaryColor: null,
      //       fillSecondaryColor: null,
      //     },
      //   };

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

      default:
        return state;
    }
  }

  const initialAppearance: Appearance = {
    fill: {
      fillStyle: "solid",
      fillPrimaryColor: "#000000",
      fillSecondaryColor: "#AAAAAA",
      // fillColorPair: null,
      gradientColorPair: "#AAAAAA | #000000",
      stripeColorPair: "#880000 | #000000",
      stripeThickness: "medium",
      stripeDirection: "horizontal",
      patternId: null,
      patternSize: "medium",
      image: null,
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
    initialAppearance
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
        <BitDisplay value={value} fill={appearance.fill} />
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
        // onFillColorPairChange={(pair) =>
        //   dispatchAppearance({ type: "SET_FILL_COLOR_PAIR", pair })
        // }
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
      />
    </div>
  );
}
