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
  paletteId: string;
  unlockId: string;
  scope: PaletteScope;
  type: "single";
  colors: SingleColor[];
};

export type DualPalette = {
  paletteName: string;
  paletteId: string;
  unlockId: string;
  scope: PaletteScope;
  type: "dual";
  colors: DualColor[];
};

export type Palette = SinglePalette | DualPalette;

export const palettes: Palette[] = [
  // ==================================================
  // FILL — SOLID (10)
  // ==================================================

  {
    paletteName: "Basic Neutrals",
    paletteId: "basicNeutrals",
        unlockId: "palette.fill.solid.basicNeutrals",
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
    paletteId: "basicBrights",
        unlockId: "palette.fill.solid.basicBrights",
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

  {
    paletteName: "Soft Pastels",
    paletteId: "softPastels",
        unlockId: "palette.fill.solid.softPastels",
    scope: "fill-solid",
    type: "single",
    colors: [
      { colorID: "Blush Pink", hex: "#F6C1CC" },
      { colorID: "Soft Apricot", hex: "#FAD7A0" },
      { colorID: "Powder Blue", hex: "#D6EAF8" },
      { colorID: "Mint Wash", hex: "#D5F5E3" },
      { colorID: "Lavender Fog", hex: "#E8DAEF" },
      { colorID: "Cream Yellow", hex: "#FCF3CF" },
      { colorID: "Cloud Grey", hex: "#EAECEE" },
      { colorID: "Rose Mist", hex: "#FDEDEC" },
    ],
  },

  {
    paletteName: "Deep Jewel Tones",
    paletteId: "deepJewelTones",
    unlockId: "palette.fill.solid.deepJewelTones",
    scope: "fill-solid",
    type: "single",
    colors: [
      { colorID: "Emerald Depth", hex: "#0B5345" },
      { colorID: "Sapphire Night", hex: "#1B4F72" },
      { colorID: "Amethyst Core", hex: "#512E5F" },
      { colorID: "Garnet Red", hex: "#641E16" },
      { colorID: "Topaz Gold", hex: "#7D6608" },
      { colorID: "Navy Ink", hex: "#154360" },
      { colorID: "Royal Plum", hex: "#4A235A" },
      { colorID: "Forest Jewel", hex: "#145A32" },
    ],
  },

  // ==================================================
  // FILL — GRADIENT (10)
  // ==================================================


  {
    paletteName: "Basic Contrast",
    paletteId: "basicContrast",
      unlockId: "palette.fill.gradient.basicContrast",
    scope: "fill-gradient",
    type: "dual",
    colors: [
      { colorID: "Charcoal", hex: "#1A1A1A", colorID2: "Ash", hex2: "#E0E0E0" },
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
    paletteId: "sunsetGlow",
      unlockId: "palette.fill.gradient.sunsetGlow",
    scope: "fill-gradient",
    type: "dual",
    colors: [
      { colorID: "Amber", hex: "#FF6F00", colorID2: "Gold", hex2: "#FFCA28" },
      {
        colorID: "Burnt Orange",
        hex: "#D84315",
        colorID2: "Peach",
        hex2: "#FF8A65",
      },
      { colorID: "Berry", hex: "#C2185B", colorID2: "Rose", hex2: "#F48FB1" },
    ],
  },

  {
    paletteName: "Ocean Depth",
    paletteId: "oceanDepth",
      unlockId: "palette.fill.gradient.oceanDepth",
    scope: "fill-gradient",
    type: "dual",
    colors: [
      {
        colorID: "Deep Sea",
        hex: "#0B3C5D",
        colorID2: "Teal",
        hex2: "#1ABC9C",
      },
      { colorID: "Navy", hex: "#154360", colorID2: "Surf", hex2: "#5DADE2" },
      {
        colorID: "Sapphire",
        hex: "#1B4F72",
        colorID2: "Foam",
        hex2: "#85C1E9",
      },
    ],
  },

  {
    paletteName: "Neon Flux",
    paletteId: "neonFlux",
      unlockId: "palette.fill.gradient.neonFlux",
    scope: "fill-gradient",
    type: "dual",
    colors: [
      {
        colorID: "Neon Blue",
        hex: "#2979FF",
        colorID2: "Cyan",
        hex2: "#00E5FF",
      },
      { colorID: "Violet", hex: "#D500F9", colorID2: "Pink", hex2: "#FF4081" },
      { colorID: "Green", hex: "#00E676", colorID2: "Lime", hex2: "#C6FF00" },
    ],
  },

  // ==================================================
  // FILL — STRIPES (10)
  // ==================================================

  {
    paletteName: "Basic Stripes",
    paletteId: "basicStripes",
   unlockId: "palette.fill.stripes.basicStripes",
    scope: "fill-stripes",
    type: "dual",
    colors: [
      { colorID: "Black", hex: "#000000", colorID2: "White", hex2: "#FFFFFF" },
      { colorID: "Blue", hex: "#1976D2", colorID2: "White", hex2: "#FFFFFF" },
      { colorID: "Green", hex: "#388E3C", colorID2: "White", hex2: "#FFFFFF" },
    ],
  },

  {
    paletteName: "Warning Tape",
    paletteId: "warningTape",
   unlockId: "palette.fill.stripes.warningTape",
    scope: "fill-stripes",
    type: "dual",
    colors: [
      { colorID: "Yellow", hex: "#FBC02D", colorID2: "Black", hex2: "#000000" },
      { colorID: "Orange", hex: "#FF9800", colorID2: "Brown", hex2: "#3E2723" },
      {
        colorID: "Bright Yellow",
        hex: "#FFEB3B",
        colorID2: "Dark Grey",
        hex2: "#424242",
      },
    ],
  },

  {
    paletteName: "Candy Cane",
    paletteId: "candyCane",
   unlockId: "palette.fill.stripes.candyCane",
    scope: "fill-stripes",
    type: "dual",
    colors: [
      { colorID: "Red", hex: "#C62828", colorID2: "White", hex2: "#FFFFFF" },
      { colorID: "Berry", hex: "#AD1457", colorID2: "Pink", hex2: "#FCE4EC" },
      {
        colorID: "Soft Red",
        hex: "#E53935",
        colorID2: "Rose",
        hex2: "#FDEDEC",
      },
    ],
  },

  {
    paletteName: "Nautical",
    paletteId: "nautical",
   unlockId: "palette.fill.stripes.nautical",
    scope: "fill-stripes",
    type: "dual",
    colors: [
      { colorID: "Navy", hex: "#0B3C5D", colorID2: "White", hex2: "#FFFFFF" },
      { colorID: "Teal", hex: "#1ABC9C", colorID2: "Foam", hex2: "#E0F2F1" },
      { colorID: "Blue", hex: "#154360", colorID2: "Sky", hex2: "#AED6F1" },
    ],
  },

  // ==================================================
  // BORDER (10)
  // ==================================================


  {
    paletteName: "Basic Frame",
    paletteId: "basicFrame",
     unlockId: "palette.border.single.basicFrame",
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
    paletteId: "darkEmphasis",
     unlockId: "palette.border.single.darkEmphasis",
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

  {
    paletteName: "Light Outline",
    paletteId: "lightOutline",
     unlockId: "palette.border.single.lightOutline",
    scope: "border",
    type: "single",
    colors: [
      { colorID: "White", hex: "#FFFFFF" },
      { colorID: "Off White", hex: "#F5F5F5" },
      { colorID: "Light Grey", hex: "#E0E0E0" },
      { colorID: "Cool Light", hex: "#D5DBDB" },
      { colorID: "Light Blue", hex: "#AED6F1" },
      { colorID: "Light Pink", hex: "#FADADD" },
      { colorID: "Cream", hex: "#FCF3CF" },
      { colorID: "Lavender", hex: "#E8DAEF" },
    ],
  },

  {
    paletteName: "Neon Edge",
    paletteId: "neonEdge",
     unlockId: "palette.border.single.neonEdge",
    scope: "border",
    type: "single",
    colors: [
      { colorID: "Neon Red", hex: "#FF1744" },
      { colorID: "Neon Orange", hex: "#FF9100" },
      { colorID: "Neon Yellow", hex: "#FFEA00" },
      { colorID: "Neon Green", hex: "#00E676" },
      { colorID: "Neon Blue", hex: "#2979FF" },
      { colorID: "Neon Violet", hex: "#D500F9" },
      { colorID: "Neon Cyan", hex: "#00E5FF" },
      { colorID: "Contrast Black", hex: "#000000" },
    ],
  },

  // ==================================================
  // SHADOW (10)
  // ==================================================

  {
    paletteName: "Basic Shadow",
    paletteId: "basicShadow",
     unlockId: "palette.shadow.single.basicShadow",
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
    paletteId: "coolShadow",
     unlockId: "palette.shadow.single.coolShadow",
    scope: "shadow",
    type: "single",
    colors: [
      { colorID: "Blue Black", hex: "#0B1C2D" },
      { colorID: "Navy Shadow", hex: "#1C2833" },
      { colorID: "Steel Shadow", hex: "#2E4053" },
      { colorID: "Cool Grey", hex: "#34495E" },
    ],
  },

  {
    paletteName: "Warm Shadow",
    paletteId: "warmShadow",
     unlockId: "palette.shadow.single.warmShadow",
    scope: "shadow",
    type: "single",
    colors: [
      { colorID: "Warm Black", hex: "#2E1B0F" },
      { colorID: "Brown Shadow", hex: "#3E2723" },
      { colorID: "Earth Shadow", hex: "#4E342E" },
      { colorID: "Soft Brown", hex: "#5D4037" },
    ],
  },

  {
    paletteName: "Purple Shadow",
    paletteId: "purpleShadow",
     unlockId: "palette.shadow.single.purpleShadow",
    scope: "shadow",
    type: "single",
    colors: [
      { colorID: "Violet Black", hex: "#1A0F2E" },
      { colorID: "Indigo Shadow", hex: "#2E1A47" },
      { colorID: "Soft Purple", hex: "#3B235A" },
      { colorID: "Plum Shadow", hex: "#4A235A" },
    ],
  },
];
