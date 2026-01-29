export type FillStyle = "solid" | "gradient" | "stripes" | "pattern";
export type StripeThickness = "thin" | "medium" | "thick";
export type StripeDirection = "horizontal" | "vertical" | "diagonalL" | "diagonalR";

export type BorderStyle = "none" | "solid";
export type BorderThickness = "thin" | "medium" | "thick";

export type ShadowStyle = "none" | "soft" | "hard" | "standing";

export type Appearance = {
  fill: {
    fillStyle: FillStyle;
    fillPrimaryColor: string | null;
    gradientColorPair: string | null;
    stripeColorPair: string | null;
    stripeThickness: StripeThickness;
    stripeDirection: StripeDirection;
    patternId: string | null;
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