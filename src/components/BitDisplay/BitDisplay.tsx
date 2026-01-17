import "./bitDisplay.css";

type FillAppearance = {
  fillStyle: "solid" | "gradient" | "stripes" | "pattern";
  fillPrimaryColor: string | null;
  fillSecondaryColor: string | null;
  // fillColorPair: string | null;
  gradientColorPair: string | null;
  stripeColorPair: string | null;

  stripeThickness: "thin" | "medium" | "thick";
  stripeDirection: "horizontal" | "vertical" | "diagonalL" | "diagonalR";
  patternId: string | null;
  patternSize: "small" | "medium" | "large";
  image: string | null;
};

type BitDisplayProps = {
  value: "0" | "1";
  scaleFactor?: number;
  fill: FillAppearance;
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
}: BitDisplayProps) {
  const horizontalPadding = `clamp(
  ${4 * scaleFactor}rem,
  ${7 * scaleFactor}vw,
  ${6 * scaleFactor}rem
)`;

  const getFillStyle = (): React.CSSProperties => {
    switch (fill.fillStyle) {
      case "solid":
        console.log(fill);
        return {
          color: fill.fillPrimaryColor ?? "#000",
          background: "none",
          backgroundClip: "border-box",
          WebkitBackgroundClip: "border-box",
          WebkitTextFillColor: "initial",
        };

      case "gradient": {
        console.log(fill);

        // if (!fill.gradientColorPair) {
        //   return { color: "#000" };
        // }
        // const gradientColorPair = fill.gradientColorPair ? fill.gradientColorPair : "#555555 | #000000";

        let gradientColorPair;

        if (!fill.gradientColorPair) {
          gradientColorPair = "#555555 | #000000";
        } else gradientColorPair = fill.gradientColorPair;

        const [from, to] = gradientColorPair.split("|");
        // const [from, to] = gradientColorPair.split("|");

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

      // case "stripes":
      //   return {
      //     backgroundImage:
      //       "repeating-linear-gradient(45deg, #000 0 10px, #fff 10px 20px)",
      //     backgroundClip: "text",
      //     WebkitBackgroundClip: "text",
      //     WebkitTextFillColor: "transparent",
      //   };

      //   case "stripes": {
      //     const [from, to] = fill.fillColorPair
      //       ? fill.fillColorPair.split("|")
      //       : ["#000000", "#FFFFFF"];

      //     return {
      //       backgroundImage: `repeating-linear-gradient(
      //   45deg,
      //   ${from} 0,
      //   ${from} 1rem,
      //   ${to} 1rem,
      //   ${to} 2rem
      // )`,
      //       backgroundClip: "text",
      //       WebkitBackgroundClip: "text",
      //       WebkitTextFillColor: "transparent",
      //     };
      //   }

      //   case "stripes": {
      //     const [from, to] = fill.fillColorPair
      //       ? fill.fillColorPair.split("|")
      //       : ["#000000", "#FFFFFF"];

      //     const stripeWidth =
      //       fill.stripeThickness === "thin"
      //         ? "0.5rem"
      //         : fill.stripeThickness === "medium"
      //         ? "1rem"
      //         : "2rem";

      //     return {
      //       backgroundImage: `repeating-linear-gradient(
      //   45deg,
      //   ${from} 0,
      //   ${from} ${stripeWidth},
      //   ${to} ${stripeWidth},
      //   ${to} calc(${stripeWidth} * 2)
      // )`,
      //       backgroundClip: "text",
      //       WebkitBackgroundClip: "text",
      //       WebkitTextFillColor: "transparent",
      //     };
      //   }

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

        console.log(fill);
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
      case "pattern":
        console.log(fill);
        return {
          color: fill.fillPrimaryColor ?? "#000",
          background: "none",
          backgroundClip: "border-box",
          WebkitBackgroundClip: "border-box",
          WebkitTextFillColor: "initial",
        };

      default:
        return { color: "#000" };
    }
  };

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
          ...getFillStyle(),
        }}
      >
        {value}
      </span>
    </div>
  );
}
