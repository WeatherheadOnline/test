import { Appearance } from "@/types/appearance";
import "./bitDisplay.css";

type BitDisplayProps = {
  value: "0" | "1";
  appearance: Appearance;
  scaleFactor?: number;
};

type ShadowScale = {
  soft: number;
  hard: number;
  grounded: number;
};

export default function BitDisplay({
  value,
  appearance,
  scaleFactor = 1,
}: BitDisplayProps) {

  const horizontalPadding = `clamp(
  ${4 * scaleFactor}rem,
  ${7 * scaleFactor}vw,
  ${6 * scaleFactor}rem
)`;

const shadowColour =
  appearance.shadow.style === "none"
    ? undefined
    : appearance.shadow.colour;

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

  const strokeStyle: React.CSSProperties = (() => {
    const { style, thickness, primaryColor } = appearance.border;

    if (style === "none") {
      return {
        WebkitTextStrokeWidth: "0",
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

  const borderIsNone = appearance.border.style === "none";
  const shadowStyle = appearance.shadow.style;
  const shadowHandledByStroke = !borderIsNone && shadowStyle !== "grounded";

  const shadow = {
    xs: 0.5,
    sm: 0.75,
    med: 1,
    lg: 1.5,
    xl: 2,
  };

  const px = (v: number) => `${v * scaleFactor}rem`;

  const shadowScale: ShadowScale = (() => {
    const thickness = appearance.border.thickness;

    if (appearance.border.style === "none") {
      return { soft: 1, hard: 1, grounded: 1 };
    }

    switch (thickness) {
      case "thin":
        return { soft: 1, hard: 1.25, grounded: 1.1 };
      case "medium":
        return { soft: 1.5, hard: 1.45, grounded: 1.2 };
      case "thick":
        return { soft: 2, hard: 1.65, grounded: 1.3 };
      default:
        return { soft: 1, hard: 1, grounded: 1 };
    }
  })();


  // If shadow is handled by shadow layer (not stroke layer)

  const textShadowStyle: React.CSSProperties = (() => {
    switch (appearance.shadow.style) {
      case "none":
        return {
          textShadow: "none",
          transform: "none",
        };

      case "soft":
        return {
          textShadow:
  shadowColour
    ? `${px(shadow.sm)} ${px(shadow.med)} ${px(shadow.lg)} ${shadowColour}`
    : undefined,
          transform: "none",
        };

      case "hard":
        return {
          textShadow:
  shadowColour
    ? `${px(shadow.sm)} ${px(shadow.med)} 0 ${shadowColour}`
    : undefined,
          transform: "none",
        };

      case "grounded":
        return {
          textShadow:
  shadowColour
    ? `${px(shadow.xs)} ${px(shadow.xl)} ${px(
            shadow.xl
          )} ${shadowColour}`
    : undefined,

          transform: `
          scale(${shadowScale.grounded}, 0.1)
          translateY(${0.05 * scaleFactor}em)
          skewX(15deg)
        `,
          transformOrigin: "bottom center",
        };

      default:
        return {
          textShadow: "none",
          transform: "none",
        };
    }
  })();

  // If shadow is handled by stroke:
  const dropShadowStyle: React.CSSProperties = (() => {
    if (!shadowHandledByStroke)
      return {
        filter: "none",
      };

    switch (appearance.shadow.style) {
      case "soft":
        return {
          filter: shadowColour ? `drop-shadow(${px(shadowScale.soft * shadow.sm)} ${
            shadowScale.soft * shadow.med
          } ${px(shadowScale.soft * shadow.xl)} ${shadowColour})` : undefined ,
        };

      case "hard":
        return {
          filter: shadowColour ? `drop-shadow(${px(shadowScale.hard * shadow.xs)} ${px(
            shadowScale.hard * shadow.sm
          )} 0 ${shadowColour})` : undefined,
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
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          color: "transparent",
          zIndex: 1,
          padding: `0 ${horizontalPadding}`,
          ...textShadowStyle,
        }}
      >
        {value}
      </span>

      {/* Stroke layer */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          color: "transparent",
          zIndex: 2,
          padding: `0 ${horizontalPadding}`,
          ...strokeStyle,
          ...dropShadowStyle,
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
