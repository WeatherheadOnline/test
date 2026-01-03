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

  const shadowStrokeStyle: React.CSSProperties = (() => {
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
      WebkitTextStrokeColor: "transparent",
    };
  })();
  /**
   * --------------------
   * Shadow styles
   * --------------------
   */

  const borderIsNone = appearance.border.style === "none";
  const shadowStyle = appearance.shadow.style;

  const shouldRenderShadowLayer = borderIsNone || shadowStyle === "grounded";

  const shadowHandledByStroke = !borderIsNone && shadowStyle !== "grounded";

  const shadowScale = (() => {
    const thickness = appearance.border.thickness;

    if (appearance.border.style === "none") return 1;

    switch (thickness) {
      case "thin":
        return 1 + 0.05;
      case "medium":
        return 1 + 0.1;
      case "thick":
        return 1 + 0.15;
      default:
        return 1;
    }
  })();

  const shadowColour = "#555555";
  const shadowXS = `${8 * scaleFactor}px`;
  const shadowSm = `${12 * scaleFactor}px`;
  const shadowMed = `${16 * scaleFactor}px`;
  const shadowLg = `${24 * scaleFactor}px`;
  const shadowXL = `${32 * scaleFactor}px`;

  const textShadowStyle: React.CSSProperties = (() => {
    const baseTransform = `scale(${shadowScale})`;

    switch (appearance.shadow.style) {
      case "none":
        return {
          textShadow: "none",
          transform: baseTransform,
        };

      case "soft":
        return {
          textShadow: `${shadowSm} ${shadowMed} ${shadowXL} ${shadowColour}`,
          transform: baseTransform,
        };

      case "hard":
        return {
          textShadow: `0 ${shadowMed} 0 ${shadowColour}`,
          transform: baseTransform,
        };

      case "grounded":
        return {
          textShadow: `0 ${shadowXL} ${shadowXL} ${shadowColour}`,
          transform: `${baseTransform} translateY(-0.1em) scaleY(0.5) skewX(20deg)`,
          transformOrigin: "bottom center",
        };

      default:
        return {};
    }
  })();

  const dropShadowStyle: React.CSSProperties = (() => {
    if (!shadowHandledByStroke) return {};

    switch (appearance.shadow.style) {
      case "soft":
        return {
          filter: `drop-shadow(${shadowXS} ${shadowSm} ${shadowLg} ${shadowColour})`,
        };

      case "hard":
        return {
          filter: `drop-shadow(0 ${shadowSm} 0 ${shadowColour})`,
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
          ...dropShadowStyle, // transparent stroke to give shadow shape
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
