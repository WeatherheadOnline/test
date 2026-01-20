"use client";

import { useEffect, useRef, useState } from "react";
import "@/styles/globals.css";
import "./customiseMenu.css";
import { palettes, SingleColor, PaletteScope } from "@/lib/palettes";
import { STYLE_OPTIONS } from "@/lib/styleOptions";

type FillStyle = "solid" | "gradient" | "stripes";
type BorderStyle = "none" | "solid";
type ShadowStyle = "none" | "soft" | "hard" | "standing";

type CustomiseMenuProps = {
  ignoreRef?: React.RefObject<HTMLElement | null>;
  unlocked: Set<string>;

  fillStyle: FillStyle;
  onFillStyleChange: (style: FillStyle) => void;

  borderStyle: BorderStyle;
  onBorderStyleChange: (style: BorderStyle) => void;

  shadowStyle: ShadowStyle;
  onShadowStyleChange: (style: ShadowStyle) => void;

  onFillPrimaryColorChange: (color: string) => void;
  onFillColorPairChange: (target: "gradient" | "stripes", pair: string) => void;

  onStripeThicknessChange: (thickness: "thin" | "medium" | "thick") => void;

  onStripeDirectionChange: (
    direction: "horizontal" | "vertical" | "diagonalL" | "diagonalR",
  ) => void;
  onBorderThicknessChange: (thickness: "thin" | "medium" | "thick") => void;
  onBorderColourChange: (colour: string) => void;
  onShadowColourChange: (colour: string) => void;
};

export default function CustomiseMenu({
  ignoreRef,
  unlocked,
  fillStyle,
  onFillStyleChange,
  borderStyle,
  onBorderStyleChange,
  shadowStyle,
  onShadowStyleChange,
  onFillPrimaryColorChange,
  onFillColorPairChange,
  onStripeThicknessChange,
  onStripeDirectionChange,
  onBorderThicknessChange,
  onShadowColourChange,
  onBorderColourChange,
}: CustomiseMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const FILL_SCOPE_BY_STYLE: Record<FillStyle, PaletteScope> = {
    solid: "fill-solid",
    gradient: "fill-gradient",
    stripes: "fill-stripes",
  };

  const fillPalettes = palettes.filter(
    (palette) => palette.scope === FILL_SCOPE_BY_STYLE[fillStyle],
  );

  const borderPalettes = palettes.filter((p) => p.scope === "border");
  const shadowPalettes = palettes.filter((p) => p.scope === "shadow");

  const borderColors = palettes
    .filter(
      (palette) => palette.scope === "border" && palette.type === "single",
    )
    .flatMap((palette) => palette.colors);

  const shadowColors: SingleColor[] = palettes
    .filter(
      (palette) => palette.scope === "shadow" && palette.type === "single",
    )
    .flatMap((palette) => palette.colors);

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
            {/* {(["solid", "gradient", "stripes"] as const).map((style) => {
              const isUnlocked = unlocked.has(style);
              console.log(style, isUnlocked);
              return (
                <button
                  key={style}
                  disabled={!isUnlocked}
                  type="button"
                  aria-pressed={fillStyle === style}
                  onClick={() => onFillStyleChange(style)}
                >
                  {style}
                </button>
              );
            })} */}

            {STYLE_OPTIONS.map((option) => {
              const isUnlocked = unlocked.has(option.unlockId);

              return (
                <button
                  key={option.arrayName} // unique key for React
                  type="button"
                  disabled={!isUnlocked} // disable if not unlocked
                  aria-pressed={fillStyle === option.arrayName}
                  onClick={() => onFillStyleChange(option.arrayName)}
                >
                  {option.buttonText} {/* render display text */}
                  {!isUnlocked && "🔒"}
                </button>
              );
            })}
          </div>

          {/* Primary colour (conditional - if fill = solid) */}
          {fillStyle === "solid" && (
            <div style={{ marginTop: "0.75rem" }}>
              <p>Colour</p>
              <div
                className="flex-wrap"
                style={{ display: "flex", gap: "0.5rem" }}
              >
                {/* {fillPalettes
                  .filter((palette) => palette.type === "single")
                  .flatMap((palette) => palette.colors)
                  .map((color) => (
                    <button
                      key={color.colorID}
                      type="button"
                      aria-label={`Set primary colour to ${color.colorID}`}
                      onClick={() => onFillPrimaryColorChange(color.hex)}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: color.hex,
                        border: "1px solid #000",
                      }}
                    />
                  ))} */}
                {fillPalettes
                  .filter((palette) => palette.type === "single")
                  .flatMap((palette) =>
                    unlocked.has(palette.unlockId) ? palette.colors : [],
                  )
                  .map((color) => (
                    <button
                      key={color.colorID}
                      type="button"
                      aria-label={`Set primary colour to ${color.colorID}`}
                      onClick={() => onFillPrimaryColorChange(color.hex)}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: color.hex,
                        border: "1px solid #000",
                      }}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Secondary colour (not needed, keep it here in case it becomes useful later) */}
          {/* {fillStyle === "pattern" && (
            <div style={{ marginTop: "0.75rem" }}>
              <p>Secondary colour</p>
              <div
                className="flex-wrap"
                style={{ display: "flex", gap: "0.5rem" }}
              >
                {palettes
                  .filter(
                    (palette) =>
                      palette.scope === "fill-pattern" &&
                      palette.type === "single"
                  )
                  .flatMap((palette) => palette.colors)
                  .map((color) => (
                    <button
                      key={color.colorID}
                      type="button"
                      aria-label={`Set secondary colour to ${color.colorID}`}
                      onClick={() => onFillSecondaryColorChange(color.hex)}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: color.hex,
                        border: "1px solid #000",
                      }}
                    />
                  ))}
              </div>
            </div>
          )} */}

          {/* Color pairs (conditional - if fill = gradient | stripes) */}
          {(fillStyle === "gradient" || fillStyle === "stripes") && (
            <div style={{ marginTop: "0.75rem" }}>
              <p>Colour pairs</p>
              <div
                className="flex-wrap"
                style={{ display: "flex", gap: "0.5rem" }}
              >
                {/* {fillPalettes
                  .filter((palette) => palette.type === "dual")
                  .flatMap((palette) => palette.colors)
                  .map((pair) => (
                    <button
                      key={`${pair.colorID}-${pair.colorID2}`}
                      type="button"
                      aria-label={`Set colour pair ${pair.colorID} and ${pair.colorID2}`}
                      onClick={() =>
                        onFillColorPairChange(
                          fillStyle,
                          `${pair.hex}|${pair.hex2}`,
                        )
                      }
                      style={{
                        width: 48,
                        height: 24,
                        borderRadius: 999,
                        border: "1px solid #000",
                        background: `linear-gradient(
      to right,
      ${pair.hex} 50%,
      ${pair.hex2} 50%
    )`,
                      }}
                    />
                  ))} */}
                {fillPalettes
                  .filter((palette) => palette.type === "dual")
                  .flatMap((palette) =>
                    unlocked.has(palette.unlockId) ? palette.colors : [],
                  )
                  .map((pair) => (
                    <button
                      key={`${pair.colorID}-${pair.colorID2}`}
                      type="button"
                      aria-label={`Set colour pair ${pair.colorID} and ${pair.colorID2}`}
                      onClick={() =>
                        onFillColorPairChange(
                          fillStyle,
                          `${pair.hex}|${pair.hex2}`,
                        )
                      }
                      style={{
                        width: 48,
                        height: 24,
                        borderRadius: 999,
                        border: "1px solid #000",
                        background: `linear-gradient(
          to right,
          ${pair.hex} 50%,
          ${pair.hex2} 50%
        )`,
                      }}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Stripe direction (conditional - stripes only) */}
          {fillStyle === "stripes" && (
            <div style={{ marginTop: "0.75rem" }}>
              <p>Direction</p>
              <div
                className="flex-wrap"
                style={{ display: "flex", gap: "0.5rem" }}
              >
                {(
                  ["horizontal", "vertical", "diagonalL", "diagonalR"] as const
                ).map((direction) => (
                  <button
                    key={direction}
                    type="button"
                    onClick={() => onStripeDirectionChange(direction)}
                  >
                    {direction === "diagonalL"
                      ? "Diagonal ↘"
                      : direction === "diagonalR"
                        ? "Diagonal ↗"
                        : direction}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stripe direction (conditional - stripes only) */}
          {fillStyle === "stripes" && (
            <div style={{ marginTop: "0.75rem" }}>
              <p>Thickness</p>
              <div
                className="flex-wrap"
                style={{ display: "flex", gap: "0.5rem" }}
              >
                {(["thin", "medium", "thick"] as const).map((thickness) => (
                  <button
                    key={thickness}
                    type="button"
                    onClick={() => onStripeThicknessChange(thickness)}
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

          {/* Choose none or solid  */}

          <div style={{ marginTop: "0.5rem" }}>
            <p>Border style</p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {(["none", "solid"] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  aria-pressed={borderStyle === style}
                  onClick={() => onBorderStyleChange(style)}
                >
                  {style === "none" ? "None" : "Solid"}
                </button>
              ))}
            </div>

            {/* If solid border: choose primary colour */}
            {borderStyle === "solid" && (
              <div style={{ marginTop: "0.75rem" }}>
                <p>Colour</p>
                <div
                  className="flex-wrap"
                  style={{ display: "flex", gap: "0.5rem" }}
                >
                  {/* {borderColors.map((color) => (
                    <button
                      key={color.colorID}
                      type="button"
                      aria-label={`Set border colour to ${color.colorID}`}
                      onClick={() => onBorderColourChange(color.hex)} // <-- wired up
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: color.hex,
                        border: "1px solid #000",
                      }}
                    />
                  ))} */}
                  {borderPalettes
                    .flatMap((palette) =>
                      unlocked.has(palette.unlockId) ? palette.colors : [],
                    )
                    .map((color) => (
                      <button
                        key={color.colorID}
                        type="button"
                        aria-label={`Set border colour to ${color.colorID}`}
                        onClick={() => onBorderColourChange(color.hex)}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: color.hex,
                          border: "1px solid #000",
                        }}
                      />
                    ))}
                  {/* {borderPalettes.flatMap(p => p.colors).map(color => (
  <button
    key={color.colorID}
    type="button"
    aria-label={color.colorID}
    onClick={() => onBorderColourChange(color.hex)}
  >
    {color.colorID}
  </button>
))} */}
                </div>
              </div>
            )}
            {borderStyle !== "none" && (
              <div style={{ marginTop: "0.75rem" }}>
                <p>Border thickness</p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {(["thin", "medium", "thick"] as const).map((thickness) => {
                    return (
                      <button
                        key={thickness}
                        type="button"
                        // aria-pressed={border.borderThickness === thickness} // optional for accessibility
                        onClick={() => onBorderThicknessChange(thickness)} // <-- wired up
                      >
                        {thickness === "thin"
                          ? "Thin"
                          : thickness === "medium"
                            ? "Medium"
                            : "Thick"}
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
            <div
              className="flex-wrap"
              style={{ display: "flex", gap: "0.5rem" }}
            >
              {/* {(["none", "soft", "hard", "standing"] as const).map((style) => {
                return (
                  <button
                    key={style}
                    type="button"
                    aria-pressed={shadowStyle === style}
                    onClick={() => onShadowStyleChange(style)}
                  >
                    {style === "none"
                      ? "None"
                      : style === "soft"
                        ? "Soft"
                        : style === "hard"
                          ? "Hard"
                          : "Standing"}
                  </button>
                );
              })} */}

              {(["none", "soft", "hard", "standing"] as const).map((style) => {
                const unlockId = `style.shadow.${style}`;
                const isUnlocked = unlocked.has(unlockId);

                return (
                  <button
                    key={style}
                    type="button"
                    disabled={!isUnlocked}
                    aria-pressed={shadowStyle === style}
                    onClick={() => onShadowStyleChange(style)}
                  >
                    {style === "none"
                      ? "None"
                      : style === "soft"
                        ? "Soft"
                        : style === "hard"
                          ? "Hard"
                          : "Standing"}
                    {!isUnlocked && "🔒"}
                  </button>
                );
              })}
            </div>

            {shadowStyle !== "none" && (
              <div style={{ marginTop: "0.75rem" }}>
                <p>Shadow colour</p>
                <div
                  className="color-buttons flex-wrap"
                  style={{ display: "flex", gap: "0.5rem" }}
                >
                  {/* {shadowColors.map((color) => (
                    <button
                      key={color.colorID}
                      type="button"
                      aria-label={`Set shadow colour to ${color.colorID}`}
                      onClick={() => onShadowColourChange(color.hex)} // <-- wired up
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: color.hex,
                        border: "1px solid #000",
                      }}
                    />
                  ))} */}

                  {shadowPalettes
  .flatMap((palette) =>
    unlocked.has(palette.unlockId) ? palette.colors : []
  )
  .map((color) => (
    <button
      key={color.colorID}
      type="button"
      aria-label={`Set shadow colour to ${color.colorID}`}
      onClick={() => onShadowColourChange(color.hex)}
      style={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        background: color.hex,
        border: "1px solid #000",
      }}
    />
  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
