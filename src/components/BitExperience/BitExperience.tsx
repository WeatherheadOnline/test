"use client";

import { useRef } from "react";
import BitDisplay from "@/components/BitDisplay/BitDisplay";
import CustomiseMenu from "@/components/CustomiseMenu/CustomiseMenu";
import { Appearance } from "@/types/appearance";
import './bitExperience.css'

type BitExperienceProps = {
  mode: "authenticated" | "preview";

  value: "0" | "1";
  flipCount: number;
  appearance: Appearance;
  unlocks: string[];

  onFlip: () => void;
  onAppearanceChange?: (next: Appearance) => void;

  showShare?: boolean;
  onShare?: () => void;

  flipPending?: boolean;
};

export default function BitExperience({
  mode,
  value,
  flipCount,
  appearance,
  unlocks,
  onFlip,
  onAppearanceChange,
  showShare = false,
  onShare,
  flipPending = false,
}: BitExperienceProps) {
  const flipButtonRef = useRef<HTMLButtonElement | null>(null);

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
        <BitDisplay value={value} appearance={appearance} />

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
            cursor: flipPending ? "not-allowed" : "pointer",
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
                transform:
                  value === "1" ? "translateX(52px)" : "translateX(0)",
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

      <CustomiseMenu
        appearance={appearance}
        unlocks={unlocks}
        onChange={onAppearanceChange ?? (() => {})}
        ignoreRef={flipButtonRef}
      />
    </div>
  );
}