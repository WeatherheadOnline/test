import { Appearance } from "@/types/appearance";
import "./bitDisplay.css";

type BitDisplayProps = {
  value: "0" | "1";
  appearance: Appearance;
  scaleFactor?: number;
};

export default function BitDisplay({
  value,
  appearance,
  scaleFactor = 1,
}: BitDisplayProps) {
  if (!appearance.fill || !appearance.border || !appearance.shadow) {
    return null;
  }

  const horizontalPadding = `clamp(
  ${4 * scaleFactor}rem,
  ${7 * scaleFactor}vw,
  ${6 * scaleFactor}rem
)`;

  /**
   * --------------------
   * Fill styles
   * --------------------
   */

  const fillStyle: React.CSSProperties = (() => {
    const { style, primaryColor, secondaryColor } = appearance.fill;

    switch (style) {
      case "solid":
        return {
          color: primaryColor,
        };

      case "gradient":
        return {
          color: "transparent",
          backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${
            secondaryColor ?? primaryColor
          })`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        };

      case "stripes": {
        const direction =
          appearance.fill.direction === "horizontal"
            ? "0deg"
            : appearance.fill.direction === "vertical"
            ? "90deg"
            : "45deg";

        const stripeWidth =
          appearance.fill.thickness === "thin"
            ? 8
            : appearance.fill.thickness === "thick"
            ? 24
            : 16;

        return {
          color: "transparent",
          backgroundImage: `repeating-linear-gradient(
      ${direction},
      ${primaryColor},
      ${primaryColor} ${stripeWidth}px,
      ${secondaryColor ?? primaryColor} ${stripeWidth}px,
      ${secondaryColor ?? primaryColor} ${stripeWidth * 2}px
    )`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        };
      }

      default:
        return {};
    }
  })();

  /**
   * --------------------
   * Border styles
   * --------------------
   */
  const hasStroke =
    appearance.border.style !== "none" &&
    appearance.border.thickness !== undefined;

  const strokeStyle: React.CSSProperties = (() => {
    const { style, thickness, primaryColor } = appearance.border;

    if (style === "none") {
      return {
        WebkitTextStrokeWidth: "0px",
      };
    }

    const baseWidth =
      thickness === "thin" ? 0.5 : thickness === "medium" ? 1 : 2;

    const width = `${baseWidth * scaleFactor}rem`;

    return {
      WebkitTextStrokeWidth: width,
      WebkitTextStrokeColor: primaryColor ?? "#000000",
    };
  })();

  /**
   * --------------------
   * Shadow styles
   * --------------------
   */

  const shadowSm = 12 * scaleFactor;
  const shadowMed = 24 * scaleFactor;
  const shadowLg = 32 * scaleFactor;

  const shadowStyleShadowLayer: React.CSSProperties = (() => {
    switch (appearance.shadow.style) {
      case "none":
        return { textShadow: "none" };

      case "soft":
        return {
          textShadow: `${shadowSm}px ${shadowMed}px ${shadowLg}px rgba(0,0,0,0.35)`,
        };

      case "hard":
        return {
          textShadow: `${(shadowSm * 2) / 3}px ${
            (shadowMed * 2) / 3
          }px 0 rgba(0,0,0,0.6)`,
        };

      case "grounded":
        return {
          textShadow: `0 ${shadowLg}px ${shadowLg}px rgba(0,0,0,0.4)`,
          transform: `translateY(${-shadowSm}px) scaleY(0.5) skewX(20deg)`,
          transformOrigin: "bottom center",
        };

      default:
        return {};
    }
  })();

  const shadowStyleBorderLayer: React.CSSProperties = (() => {
    switch (appearance.shadow.style) {
      case "none":
        return { textShadow: "none" };
      case "soft":
        return {
          filter: `drop-shadow(${shadowSm}px ${shadowMed}px ${shadowLg}px rgba(0,0,0,0.6))`,
        };
      case "hard":
        return {
          filter: `drop-shadow(${(shadowSm * 2) / 3}px ${
            (shadowMed * 2) / 3
          }px 0 rgba(0,0,0,0.4))`,
        };
      case "grounded":
        return {
          transform: `translateY(${0 - shadowSm}) scaleY(0.1) skewX(20deg)`,
          transformOrigin: "bottom center",
          // filter: `drop-shadow(0 ${shadowMed}px ${shadowMed}px rgba(0,0,0,0.6))`,
          filter: `drop-shadow(0 ${shadowMed}px 0 rgba(0,0,0,0.6))`,
        };
      default:
        return {};
    }
  })();

  return (
    <div
      id="bit-capture"
      className="giant-bit"
      role="img"
      aria-label={`Your bit is ${value}`}
      style={{
        position: "relative",
        lineHeight: 1,
        fontWeight: 800,
      }}
    >
      {/* Shadow layer */}
      {!hasStroke && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            padding: `0 ${horizontalPadding}`,
            color: "transparent", // must be painted
            ...shadowStyleShadowLayer,
          }}
        >
          {value}
        </span>
      )}

      {/* Stroke layer */}
      {/* Now also the shadow layer */}
      {/* but only when a stroke is applied, otherwise a separate shadow layer kicks in */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          color: "transparent",
          zIndex: 2,
          padding: `0 ${horizontalPadding}`,
          ...strokeStyle,
          ...shadowStyleBorderLayer,

        }}
      >
        {value}
      </span>

      {/* Fill layer */}
      <span
        style={{
          position: "relative",
          zIndex: 3,
          padding: `0 ${horizontalPadding}`,
          ...fillStyle,
        }}
      >
        {value}
      </span>
    </div>
  );
}
