export type PaletteScope =
  | "fill-solid"
  | "fill-gradient"
  | "fill-stripes"
  | "border"
  | "shadow";

export type SingleColor = {
  colorID: string;
  hex: string;
};

export type DualColor = {
  colorID: string;
  hex: string;
  colorID2: string;
  hex2: string;
};

export type SinglePalette = {
  paletteName: string;
  scope: PaletteScope;
  type: "single";
  colors: SingleColor[];
};

export type DualPalette = {
  paletteName: string;
  scope: PaletteScope;
  type: "dual";
  colors: DualColor[];
};

export type Palette = SinglePalette | DualPalette;

export const palettes: Palette[] = [
  // --------------------------------------------------
  // FILL — SOLID
  // --------------------------------------------------

  {
    paletteName: "Basic Neutrals",
    scope: "fill-solid",
    type: "single",
    colors: [
      { colorID: "Charcoal Black", hex: "#1A1A1A" },
      { colorID: "Slate Grey", hex: "#4A4A4A" },
      { colorID: "Mid Grey", hex: "#7A7A7A" },
      { colorID: "Cool Silver", hex: "#B0B0B0" },
      { colorID: "Light Ash", hex: "#E0E0E0" },
      { colorID: "Pure White", hex: "#FFFFFF" },
      { colorID: "Deep Blue", hex: "#0B3C5D" },
      { colorID: "Royal Purple", hex: "#5C2D91" },
    ],
  },

  {
    paletteName: "Basic Brights",
    scope: "fill-solid",
    type: "single",
    colors: [
      { colorID: "Signal Red", hex: "#D32F2F" },
      { colorID: "Signal Orange", hex: "#F57C00" },
      { colorID: "Signal Yellow", hex: "#FBC02D" },
      { colorID: "Signal Green", hex: "#388E3C" },
      { colorID: "Signal Blue", hex: "#1976D2" },
      { colorID: "Signal Purple", hex: "#7B1FA2" },
      { colorID: "Signal Teal", hex: "#00838F" },
      { colorID: "Signal Magenta", hex: "#C2185B" },
    ],
  },

  // --------------------------------------------------
  // FILL — GRADIENT
  // --------------------------------------------------

  {
    paletteName: "Basic Contrast",
    scope: "fill-gradient",
    type: "dual",
    colors: [
      {
        colorID: "Charcoal",
        hex: "#1A1A1A",
        colorID2: "Ash",
        hex2: "#E0E0E0",
      },
      {
        colorID: "Blue Core",
        hex: "#1976D2",
        colorID2: "Sky",
        hex2: "#64B5F6",
      },
      {
        colorID: "Green Core",
        hex: "#388E3C",
        colorID2: "Mint",
        hex2: "#81C784",
      },
    ],
  },

  {
    paletteName: "Sunset Glow",
    scope: "fill-gradient",
    type: "dual",
    colors: [
      {
        colorID: "Amber",
        hex: "#FF6F00",
        colorID2: "Gold",
        hex2: "#FFCA28",
      },
      {
        colorID: "Burnt Orange",
        hex: "#D84315",
        colorID2: "Peach",
        hex2: "#FF8A65",
      },
      {
        colorID: "Berry",
        hex: "#C2185B",
        colorID2: "Rose",
        hex2: "#F48FB1",
      },
    ],
  },

  // --------------------------------------------------
  // FILL — STRIPES
  // --------------------------------------------------

  {
    paletteName: "Basic Contrast Stripes",
    scope: "fill-stripes",
    type: "dual",
    colors: [
      {
        colorID: "Absolute Black",
        hex: "#000000",
        colorID2: "Pure White",
        hex2: "#FFFFFF",
      },
      {
        colorID: "Blue",
        hex: "#1976D2",
        colorID2: "White",
        hex2: "#FFFFFF",
      },
      {
        colorID: "Green",
        hex: "#388E3C",
        colorID2: "White",
        hex2: "#FFFFFF",
      },
    ],
  },

  {
    paletteName: "Warning Tape",
    scope: "fill-stripes",
    type: "dual",
    colors: [
      {
        colorID: "Yellow",
        hex: "#FBC02D",
        colorID2: "Black",
        hex2: "#000000",
      },
      {
        colorID: "Orange",
        hex: "#FF9800",
        colorID2: "Brown",
        hex2: "#3E2723",
      },
      {
        colorID: "Bright Yellow",
        hex: "#FFEB3B",
        colorID2: "Dark Grey",
        hex2: "#424242",
      },
    ],
  },

  // --------------------------------------------------
  // FILL — PATTERN
  // --------------------------------------------------

  {
    paletteName: "Basic Soft",
    scope: "fill-pattern",
    type: "single",
    colors: [
      { colorID: "Soft Grey", hex: "#7A7A7A" },
      { colorID: "Light Grey", hex: "#B0B0B0" },
      { colorID: "Dark Grey", hex: "#4A4A4A" },
      { colorID: "White", hex: "#FFFFFF" },
      { colorID: "Ash", hex: "#E0E0E0" },
      { colorID: "Charcoal", hex: "#1A1A1A" },
    ],
  },

  {
    paletteName: "Blueprint",
    scope: "fill-pattern",
    type: "single",
    colors: [
      { colorID: "Blueprint Blue", hex: "#0B3C5D" },
      { colorID: "Grid Blue", hex: "#1B4F72" },
      { colorID: "Line Blue", hex: "#5DADE2" },
      { colorID: "Paper Blue", hex: "#AED6F1" },
      { colorID: "Ink Blue", hex: "#154360" },
      { colorID: "Light Grid", hex: "#EBF5FB" },
    ],
  },

  // --------------------------------------------------
  // BORDER
  // --------------------------------------------------

  {
    paletteName: "Basic Frame",
    scope: "border",
    type: "single",
    colors: [
      { colorID: "Frame Black", hex: "#000000" },
      { colorID: "Frame White", hex: "#FFFFFF" },
      { colorID: "Neutral Grey", hex: "#7A7A7A" },
      { colorID: "Deep Charcoal", hex: "#1A1A1A" },
      { colorID: "Soft Grey", hex: "#B0B0B0" },
      { colorID: "Accent Blue", hex: "#1976D2" },
      { colorID: "Accent Green", hex: "#388E3C" },
      { colorID: "Accent Red", hex: "#D32F2F" },
    ],
  },

  {
    paletteName: "Dark Emphasis",
    scope: "border",
    type: "single",
    colors: [
      { colorID: "Absolute Black", hex: "#000000" },
      { colorID: "Near Black", hex: "#1C1C1C" },
      { colorID: "Deep Grey", hex: "#2C2C2C" },
      { colorID: "Border Grey", hex: "#3D3D3D" },
      { colorID: "Dark Purple", hex: "#512E5F" },
      { colorID: "Dark Blue", hex: "#154360" },
      { colorID: "Dark Red", hex: "#641E16" },
      { colorID: "Dark Green", hex: "#145A32" },
    ],
  },

  // --------------------------------------------------
  // SHADOW
  // --------------------------------------------------

  {
    paletteName: "Basic Shadow",
    scope: "shadow",
    type: "single",
    colors: [
      { colorID: "Pure Shadow", hex: "#000000" },
      { colorID: "Soft Black", hex: "#1A1A1A" },
      { colorID: "Diffuse Black", hex: "#2C2C2C" },
      { colorID: "Light Shadow", hex: "#424242" },
    ],
  },

  {
    paletteName: "Cool Shadow",
    scope: "shadow",
    type: "single",
    colors: [
      { colorID: "Blue Black", hex: "#0B1C2D" },
      { colorID: "Navy Shadow", hex: "#1C2833" },
      { colorID: "Steel Shadow", hex: "#2E4053" },
      { colorID: "Cool Grey", hex: "#34495E" },
    ],
  },
];