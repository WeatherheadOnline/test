import "./bitDisplay.css";

type FillAppearance = {
  fillStyle: "solid" | "gradient" | "stripes" | "pattern";
  fillPrimaryColor: string | null;
  fillSecondaryColor: string | null;
  gradientColorPair: string | null;
  stripeColorPair: string | null;

  stripeThickness: "thin" | "medium" | "thick";
  stripeDirection: "horizontal" | "vertical" | "diagonalL" | "diagonalR";
  patternId: string | null;
  patternSize: "small" | "medium" | "large";
  image: string | null;
};

type BorderAppearance = {
  borderStyle: "none" | "solid";
  borderThickness: "thin" | "medium" | "thick";
  borderColour: string | null;
};

type ShadowAppearance = {
  shadowStyle: "none" | "soft" | "hard" | "standing";
  shadowColour: string | null;
};

type BitDisplayProps = {
  value: "0" | "1";
  scaleFactor?: number;
  fill: FillAppearance;
  border: BorderAppearance;
  shadow: ShadowAppearance;
};

type ShadowScale = {
  soft: number;
  hard: number;
  grounded: number;
};

export default function BitDisplay({
  value,
  scaleFactor = 1,
  fill,
  border,
  shadow,
}: BitDisplayProps) {
  const horizontalPadding = `clamp(
  ${4 * scaleFactor}rem,
  ${7 * scaleFactor}vw,
  ${6 * scaleFactor}rem
)`;

  const wrapperStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-block",
  };

  const bgStyle: React.CSSProperties = {
    // position: "absolute",
    inset: 0,

    color: fill.fillSecondaryColor ?? "#fff",

    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  const getBackgroundFillStyle = (): React.CSSProperties => ({
    // position: "absolute",
    inset: 0,

    color: fill.fillSecondaryColor ?? "#fff",
  });

  const getFillStyle = (): React.CSSProperties => {
    switch (fill.fillStyle) {
      case "solid":
        return {
          color: fill.fillPrimaryColor ?? "#000",
          background: "none",
          backgroundClip: "border-box",
          WebkitBackgroundClip: "border-box",
          WebkitTextFillColor: "initial",
        };

      case "gradient": {
        let gradientColorPair;

        if (!fill.gradientColorPair) {
          gradientColorPair = "#555555 | #000000";
        } else gradientColorPair = fill.gradientColorPair;

        const [from, to] = gradientColorPair.split("|");

        return {
          backgroundImage: `linear-gradient(160deg, ${from} 10%, ${to} 90%)`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "100%",
        };
      }

      case "stripes": {
        const [from, to] = fill.stripeColorPair
          ? fill.stripeColorPair.split("|")
          : ["#000000", "#FFFFFF"];

        const stripeWidth =
          fill.stripeThickness === "thin"
            ? "0.5rem"
            : fill.stripeThickness === "medium"
              ? "1rem"
              : "2rem";

        const angle =
          fill.stripeDirection === "horizontal"
            ? "0deg"
            : fill.stripeDirection === "vertical"
              ? "90deg"
              : fill.stripeDirection === "diagonalL"
                ? "45deg"
                : "315deg"; // diagonalR

        return {
          backgroundImage: `repeating-linear-gradient(
      ${angle},
      ${from} 0,
      ${from} ${stripeWidth},
      ${to} ${stripeWidth},
      ${to} calc(${stripeWidth} * 2)
    )`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        };
      }
      // case "pattern":
      //   return {
      //     color: fill.fillPrimaryColor ?? "#000",
      //     background: "none",
      //     backgroundClip: "border-box",
      //     WebkitBackgroundClip: "border-box",
      //     WebkitTextFillColor: "initial",
      //   };

      // case "pattern": {
      //   if (!fill.image) {
      //     return { color: fill.fillPrimaryColor ?? "#000" };
      //   }

      //   return {
      //     backgroundImage: `url(${fill.image})`,
      //     backgroundRepeat: "repeat",
      //     backgroundSize:
      //       fill.patternSize === "small"
      //         ? "24px 24px"
      //         : fill.patternSize === "large"
      //           ? "64px 64px"
      //           : "40px 40px",
      //     backgroundClip: "text",
      //     WebkitBackgroundClip: "text",
      //     WebkitTextFillColor: "transparent",
      //   };
      // }

      // case "pattern": {
      //   if (!fill.image) {
      //     return { color: fill.fillPrimaryColor ?? "#000" };
      //   }

      //   const fg = fill.fillPrimaryColor ?? "#000000";
      //   const bg = fill.fillSecondaryColor ?? "#FFFFFF";

      //   return {
      //     backgroundImage: `url(${fill.image})`,
      //     backgroundRepeat: "repeat",
      //     backgroundSize:
      //       fill.patternSize === "small"
      //         ? "24px 24px"
      //         : fill.patternSize === "large"
      //           ? "64px 64px"
      //           : "40px 40px",

      //     // 🔑 this is the missing piece
      //     "--pattern-fg": fg,
      //     "--pattern-bg": bg,

      //     backgroundClip: "text",
      //     WebkitBackgroundClip: "text",
      //     WebkitTextFillColor: "transparent",
      //   } as React.CSSProperties;
      // }

      // case "pattern": {
      //   if (!fill.image) return {};

      //   const fg = fill.fillPrimaryColor ?? "#000";
      //   const bg = fill.fillSecondaryColor ?? "#fff";

      //   const size =
      //     fill.patternSize === "small"
      //       ? "24px"
      //       : fill.patternSize === "large"
      //       ? "64px"
      //       : "40px";

      //   return {
      //     backgroundColor: fg,

      //     WebkitMaskImage: `url(${fill.image})`,
      //     WebkitMaskRepeat: "repeat",
      //     WebkitMaskSize: `${size} ${size}`,

      //     maskImage: `url(${fill.image})`,
      //     maskRepeat: "repeat",
      //     maskSize: `${size} ${size}`,

      //     boxShadow: `inset 0 0 0 9999px ${bg}`, // background layer

      //     backgroundClip: "text",
      //     WebkitBackgroundClip: "text",
      //     WebkitTextFillColor: "transparent",
      //   };
      // }

      //  changing to using the glyph as the mask, and the svg as a background
      // case "pattern": {
      //   if (!fill.image) return {};

      //   const fg = fill.fillPrimaryColor ?? "#000";
      //   const bg = fill.fillSecondaryColor ?? "#fff";

      //   const size =
      //     fill.patternSize === "small"
      //       ? "24px"
      //       : fill.patternSize === "large"
      //         ? "64px"
      //         : "40px";

      //   return {
      //     // Pattern layer (foreground)
      //     // backgroundImage: `url(${fill.image})`,
      //     // backgroundRepeat: "repeat",
      //     // backgroundSize: `${size} ${size}`,
      //     // backgroundColor: bg,
      //     backgroundColor: fg,

      //     // ["--pattern-fg" as any]: fg,
      //     // ["--pattern-bg" as any]: bg,

      //     // THIS is the fix to go from svg-as-mask to glyph-as-mask with svg background
      //     // WebkitMaskImage: "linear-gradient(#000 0 0)",
      //     // WebkitMaskRepeat: "no-repeat",
      //     // WebkitMaskSize: "100% 100%",
      //     WebkitMaskImage: `url(${fill.image})`,
      //     WebkitMaskRepeat: "repeat",
      //     WebkitMaskSize: `${size} ${size}`,
      //     WebkitMaskClip: "text",
      //     WebkitMaskOrigin: "text",

      //     // maskImage: "linear-gradient(#000 0 0)",
      //     // maskRepeat: "no-repeat",
      //     // maskSize: "100% 100%",
      //     maskImage: `url(${fill.image})`,
      //     maskRepeat: "repeat",
      //     maskSize: `${size} ${size}`,
      //     maskClip: "text",
      //     maskOrigin: "text",

      //     // Text transparency
      //     // color: fg,

      //     WebkitTextFillColor: "transparent",
      //   };
      // }

      case "pattern": {
        if (!fill.image) return {};

        const fg = fill.fillPrimaryColor ?? "#000";
        const bg = fill.fillSecondaryColor ?? "#fff";

        const size =
          fill.patternSize === "small"
            ? "24px"
            : fill.patternSize === "large"
              ? "64px"
              : "40px";

        return {
          position: "relative",
          zIndex: 1,

          backgroundColor: fill.fillPrimaryColor ?? "#000",

          WebkitMaskImage: `url(${fill.image})`,
          WebkitMaskRepeat: "repeat",
          WebkitMaskSize: `${size} ${size}`,
          WebkitMaskClip: "text",
          WebkitMaskOrigin: "text",

          maskImage: `url(${fill.image})`,
          maskRepeat: "repeat",
          maskSize: `${size} ${size}`,
          maskClip: "text",
          maskOrigin: "text",

          WebkitTextFillColor: "transparent",
        };
      }

      default:
        return { color: "#000" };
    }
  };

  // --------------------
  // Border styles
  // --------------------
  const strokeStyle: React.CSSProperties = (() => {
    const { borderStyle, borderThickness, borderColour } = border;

    if (borderStyle === "none") {
      return { WebkitTextStrokeWidth: "0px" };
    }

    const baseWidth =
      borderThickness === "thin" ? 0.5 : borderThickness === "medium" ? 1 : 2;
    const width = `${baseWidth * scaleFactor}rem`;

    return {
      WebkitTextStrokeWidth: width,
      WebkitTextStrokeColor: borderColour ?? "#000000",
    };
  })();

  const shadowStrokeStyle: React.CSSProperties = (() => {
    const { borderStyle, borderThickness } = border;
    if (borderStyle === "none") {
      return { WebkitTextStrokeWidth: "0px" };
    }

    const baseWidth =
      borderThickness === "thin" ? 0.5 : borderThickness === "medium" ? 1 : 2;
    const width = `${baseWidth * scaleFactor}rem`;

    return {
      WebkitTextStrokeWidth: width,
      WebkitTextStrokeColor: "transparent",
    };
  })();

  // --------------------
  // Shadow styles
  // --------------------
  const borderIsNone = border.borderStyle === "none";
  const shadowStyleType = shadow.shadowStyle;
  const shadowHandledByStroke = !borderIsNone && shadowStyleType !== "standing";

  const shadowColour = shadow.shadowColour ?? "#555555";

  const shadowSizes = {
    xs: 0.5,
    sm: 0.75,
    med: 1,
    lg: 1.5,
    xl: 2,
  };

  const px = (v: number) => `${v * scaleFactor}rem`;

  const shadowScale: ShadowScale = (() => {
    switch (border.borderThickness) {
      case "thin":
        return { soft: 0.9, hard: 1.2, grounded: 1.2 };
      case "medium":
        return { soft: 1.3, hard: 1.4, grounded: 1.4 };
      case "thick":
        return { soft: 1.5, hard: 1.6, grounded: 1.6 };
      default:
        return { soft: 1, hard: 1, grounded: 1 };
    }
  })();

  const textShadowStyle: React.CSSProperties = (() => {
    switch (shadowStyleType) {
      case "none":
        return { textShadow: "none" };
      case "soft":
        return {
          textShadow: `${px(shadowSizes.sm)} ${px(shadowSizes.med)} ${px(shadowSizes.lg)} ${shadowColour}`,
        };
      case "hard":
        return {
          textShadow: `${px(shadowSizes.sm)} ${px(
            shadowSizes.med
          )} 0 ${shadowColour}`,
        };
      case "standing":
        return {
          textShadow: `${px(shadowSizes.xs)} ${px(shadowSizes.xl)} ${px(
            shadowSizes.xl
          )} ${shadowColour}`,
          transform: `scale(1, 0.1) translateY(${
            0.05 * scaleFactor
          }em) skewX(15deg)`,
          transformOrigin: "bottom center",
        };
      default:
        return {};
    }
  })();

  const dropShadowStyle: React.CSSProperties = (() => {
    if (!shadowHandledByStroke) return {};
    switch (shadowStyleType) {
      case "soft":
        return {
          filter: `drop-shadow(
          ${px(shadowScale.soft * shadowSizes.xs)}
          ${px(shadowScale.soft * shadowSizes.sm)}
          ${px(shadowScale.soft * shadowSizes.med)}
          ${shadowColour})`,
        };
      case "hard":
        return {
          filter: `drop-shadow(${px(shadowScale.hard * shadowSizes.xs)} ${px(
            shadowScale.hard * shadowSizes.sm
          )} 0 ${shadowColour})`,
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
          // padding: `0 ${horizontalPadding}`,
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
          // padding: `0 ${horizontalPadding}`,
          ...strokeStyle,
          ...dropShadowStyle,
        }}
      >
        {value}
      </span>

      {/* Fill layer */}
      <span
        style={{
          position: "absolute",
          inset: 0,

          zIndex: 3,
          // padding: `0 ${horizontalPadding}`,
        }}
      >
        {/* Pattern fill only: Background fill (secondary colour) */}
        <span
          style={{
            zIndex: 0,
            position: "absolute",
            top: "0",
            left: "0",
            inset: 0,

            ...getBackgroundFillStyle(),
          }}
        >
          {value}
        </span>

        {/* Main fill layer (when fill style = pattern, this is the primary colour layer) */}
        <span
          style={{
            zIndex: 1,
            position: "absolute",
            top: "0",
            left: "0",
            inset: 0,

            ...getFillStyle(),
          }}
        >
          {value}
        </span>
      </span>
    </div>
  );
}
