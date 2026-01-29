import type { Appearance } from "@/lib/appearance";

export const DEFAULT_APPEARANCE: Appearance = {
    fill: {
    fillStyle: "solid",
    fillPrimaryColor: "#000000",
    gradientColorPair: "#555555|#000000",
    stripeColorPair: "#FFFFFF | #000000",
    stripeThickness: "medium",
    stripeDirection: "diagonalL",
    patternId: "checker",
  },
  border: {
    borderStyle: "none",
    borderThickness: "medium",
    borderColour: "#555555",
  },
  shadow: {
    shadowStyle: "none",
    shadowColour: "#424242",
  },
};