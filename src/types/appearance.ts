// =====================
// Fill
// =====================

export type FillSolid = {
  style: "solid";
  primaryColor: string;
};

export type FillGradient = {
  style: "gradient";
  primaryColor: string;
  secondaryColor: string;
};

export type FillStripes = {
  style: "stripes";
  primaryColor: string;
  secondaryColor: string;
  direction: "horizontal" | "vertical" | "diagonal";
  thickness: "thin" | "medium" | "thick";
};

// export type FillAppearance =
//   | FillSolid
//   | FillGradient
//   | FillStripes;

// =====================
// Border
// =====================

export type BorderNone = {
  style: "none";
};

export type BorderSolid = {
  style: "solid";
  thickness: "thin" | "medium" | "thick";
  primaryColor: string;
};

export type BorderAppearance =
  | BorderNone
  | BorderSolid;

// =====================
// Shadow
// =====================

export type ShadowNone = {
  style: "none";
};

export type ShadowWithColour = {
  style: "soft" | "hard" | "grounded";
  colour: string;
};

export type ShadowAppearance =
  | ShadowNone
  | ShadowWithColour;

// =====================
// Appearance (root)
// =====================

// export type Appearance = {
//   fill: FillAppearance;
//   border: BorderAppearance;
//   shadow: ShadowAppearance;
// };