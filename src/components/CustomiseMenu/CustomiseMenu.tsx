"use client";

import { useEffect, useRef, useState } from "react";
import { Appearance } from "@/types/appearance";
import { UnlockId } from "@/lib/unlocks";
import "@/styles/globals.css";
import "./customiseMenu.css";

type CustomiseMenuProps = {
  appearance: Appearance;
  unlocks: string[];
  onChange: (next: Appearance) => void;
  ignoreRef?: React.RefObject<HTMLElement | null>;
};

export default function CustomiseMenu({
  appearance,
  unlocks,
  onChange,
  ignoreRef,
}: CustomiseMenuProps) {
  // useState, useRef

  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (
        menuRef.current?.contains(target) ||
        buttonRef.current?.contains(target) ||
        ignoreRef?.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen, ignoreRef]);

  // Variables

  const isUnlocked = (id: string) => unlocks.includes(id);
  const baseColors = ["#22c55e", "#0ea5e9"];
  const extraColors = ["#a855f7", "#f97316"];

  const colours = isUnlocked("colors:pack1")
    ? [...baseColors, ...extraColors]
    : baseColors;

  // To close customise menu on touchscreens:

  const touchStartY = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;

    const deltaY = e.touches[0].clientY - touchStartY.current;

    if (deltaY > 80) {
      setIsOpen(false);
      touchStartY.current = null;
    }
  };

  // The return statement:

  return (
    <div
      aria-labelledby="customise-heading"
      className="customise-menu-container"
    >
      {/* Header */}
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="customise-body"
        id="customise-heading"
        className={
          "customise-heading " +
          (isOpen ? "customise-button-active" : "customise-button-inactive")
        }
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Customise
      </button>

      {/* Body */}
      <div
        id="customise-body"
        className="customise-body"
        ref={menuRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        style={{
          display: isOpen ? "block" : "none",
        }}
      >
        {/* Fill section */}
        <section aria-labelledby="fill-heading" className="customise-section">
          <h2 id="fill-heading" style={{ fontSize: "0.9rem" }}>
            Fill
          </h2>

          {/* Fill style */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {(["solid", "gradient", "stripes"] as const).map((style) => {
              const unlockId =
                style === "gradient"
                  ? "fill:gradient"
                  : style === "stripes"
                  ? "fill:stripes"
                  : null;

              const locked = unlockId ? !isUnlocked(unlockId) : false;

              return (
                <button
                  key={style}
                  type="button"
                  disabled={locked}
                  aria-disabled={locked}
                  aria-pressed={appearance.fill.style === style}
                  onClick={() => {
                    if (locked) return;

                    onChange({
                      ...appearance,
                      fill: {
                        ...appearance.fill,
                        style,
                      },
                    });
                  }}
                  style={{
                    opacity: locked ? 0.4 : 1,
                    cursor: locked ? "not-allowed" : "pointer",
                  }}
                >
                  {style === "solid"
                    ? "Solid"
                    : style === "gradient"
                    ? "Gradient"
                    : "Stripes"}

                  {locked && "🔒"}
                </button>
              );
            })}
          </div>

          {/* Primary colour */}
          <div style={{ marginTop: "0.75rem" }}>
            <p>Primary colour</p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[
                "#ffffff",
                "#000000",
                "#fde047",
                "#22c55e",
                "#0ea5e9",
                "#f97316",
              ].map((colour) => (
                <button
                  key={colour}
                  type="button"
                  aria-label={`Set primary colour to ${colour}`}
                  aria-pressed={appearance.fill.primaryColor === colour}
                  onClick={() =>
                    onChange({
                      ...appearance,
                      fill: {
                        ...appearance.fill,
                        primaryColor: colour,
                      },
                    })
                  }
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: colour,
                    border: "1px solid #000",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Secondary colour (conditional) */}
          {appearance.fill.style !== "solid" && (
            <div style={{ marginTop: "0.75rem" }}>
              <p>Secondary colour</p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {["#ffffff", "#000000", "#fde047"].map((colour) => (
                  <button
                    key={colour}
                    type="button"
                    aria-label={`Set secondary colour to ${colour}`}
                    aria-pressed={appearance.fill.secondaryColor === colour}
                    onClick={() =>
                      onChange({
                        ...appearance,
                        fill: {
                          ...appearance.fill,
                          secondaryColor: colour,
                        },
                      })
                    }
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: colour,
                      border: "1px solid #000",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {appearance.fill.style === "stripes" && (
            <div style={{ marginTop: "0.75rem" }}>
              <p>Direction</p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {(["horizontal", "vertical", "diagonal"] as const).map(
                  (direction) => (
                    <button
                      key={direction}
                      type="button"
                      aria-pressed={appearance.fill.direction === direction}
                      onClick={() =>
                        onChange({
                          ...appearance,
                          fill: {
                            ...appearance.fill,
                            direction,
                          },
                        })
                      }
                    >
                      {direction}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {appearance.fill.style === "stripes" && (
            <div style={{ marginTop: "0.75rem" }}>
              <p>Thickness</p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {(["thin", "medium", "thick"] as const).map((thickness) => (
                  <button
                    key={thickness}
                    type="button"
                    aria-pressed={appearance.fill.thickness === thickness}
                    onClick={() =>
                      onChange({
                        ...appearance,
                        fill: {
                          ...appearance.fill,
                          thickness,
                        },
                      })
                    }
                  >
                    {thickness}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Border section */}
        <section
          className="customise-section"
          aria-labelledby="border-heading"
          style={{ marginTop: "1.5rem" }}
        >
          <h2 id="border-heading" style={{ fontSize: "0.9rem" }}>
            Border
          </h2>

          {/* Choose none, solid, or pattern  */}

          <div style={{ marginTop: "0.5rem" }}>
            <p>Border style</p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {(["none", "solid", "pattern"] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  aria-pressed={appearance.border.style === style}
                  onClick={() =>
                    onChange({
                      ...appearance,
                      border: {
                        ...appearance.border,
                        style,
                      },
                    })
                  }
                >
                  {style === "none"
                    ? "None"
                    : style === "solid"
                    ? "Solid"
                    : "Pattern"}
                </button>
              ))}
            </div>

            {/* If solid or pattern border: choose primary colour */}

            {(appearance.border.style === "solid" ||
              appearance.border.style === "pattern") && (
              <div style={{ marginTop: "0.75rem" }}>
                <p>Colour</p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {["#000000", "#ffffff", "#22c55e", "#0ea5e9", "#f97316"].map(
                    (colour) => (
                      <button
                        key={colour}
                        type="button"
                        aria-label={`Set border primary colour to ${colour}`}
                        aria-pressed={appearance.border.primaryColor === colour}
                        onClick={() =>
                          onChange({
                            ...appearance,
                            border: {
                              ...appearance.border,
                              primaryColor: colour,
                            },
                          })
                        }
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: colour,
                          border: "1px solid #000",
                        }}
                      />
                    )
                  )}
                </div>
              </div>
            )}

            {/* If pattern bordre: choose secondary colour */}

            {appearance.border.style === "pattern" && (
              <div style={{ marginTop: "0.75rem" }}>
                <p>Secondary colour</p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {["#ffffff", "#fde047", "#a855f7", "#ec4899"].map(
                    (colour) => (
                      <button
                        key={colour}
                        type="button"
                        aria-label={`Set border secondary colour to ${colour}`}
                        aria-pressed={
                          appearance.border.secondaryColor === colour
                        }
                        onClick={() =>
                          onChange({
                            ...appearance,
                            border: {
                              ...appearance.border,
                              secondaryColor: colour,
                            },
                          })
                        }
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: colour,
                          border: "1px solid #000",
                        }}
                      />
                    )
                  )}
                </div>
              </div>
            )}

            {(appearance.border.style === "solid" ||
              appearance.border.style === "pattern") && (
              <div style={{ marginTop: "0.75rem" }}>
                <p>Border thickness</p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {(["thin", "medium", "thick"] as const).map((style) => {
                    const unlockId =
                      style === "thick"
                        ? "border:thick"
                        : style === "medium"
                        ? "border:medium"
                        : "border:thin";

                    const locked = unlockId ? !isUnlocked(unlockId) : false;

                    return (
                      <button
                        key={style}
                        type="button"
                        disabled={locked}
                        aria-disabled={locked}
                        aria-pressed={appearance.border.thickness === style}
                        onClick={() =>
                          onChange({
                            ...appearance,
                            border: {
                              ...appearance.border,
                              thickness: style,
                            },
                          })
                        }
                        style={{
                          opacity: locked ? 0.4 : 1,
                          cursor: locked ? "not-allowed" : "pointer",
                        }}
                      >
                        {style === "thin"
                          ? "Thin"
                          : style === "medium"
                          ? "Medium"
                          : "Thick"}
                        {locked && "🔒"}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Shadow section */}
        <section
          className="customise-section"
          aria-labelledby="shadow-heading"
          style={{ marginTop: "1.5rem" }}
        >
          <h2 id="shadow-heading" style={{ fontSize: "0.9rem" }}>
            Shadow
          </h2>

          <div style={{ marginTop: "0.5rem" }}>
            <p>Shadow style</p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {(["none", "soft", "hard", "grounded"] as const).map((style) => {
                const unlockId =
                  style === "hard"
                    ? "shadow:hard"
                    : style === "grounded"
                    ? "shadow:grounded"
                    : null;

                const locked = unlockId ? !isUnlocked(unlockId) : false;

                return (
                  <button
                    key={style}
                    type="button"
                    disabled={locked}
                    aria-disabled={locked}
                    aria-pressed={appearance.shadow.style === style}
                    onClick={() => {
                      if (locked) return;
                      onChange({
                        ...appearance,
                        shadow: { style },
                      });
                    }}
                    style={{
                      opacity: locked ? 0.4 : 1,
                      cursor: locked ? "not-allowed" : "pointer",
                    }}
                  >
                    {style === "none"
                      ? "None"
                      : style === "soft"
                      ? "Soft"
                      : style === "hard"
                      ? "Hard"
                      : "Standing"}
                    {locked && "🔒"}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
