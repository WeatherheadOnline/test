export type PaletteScope =
  | "fill-solid"
  | "fill-gradient"
  | "fill-stripes"
  | "fill-pattern"
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
  // ==================================================
  // FILL — SOLID (10)
  // ==================================================

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

  {
    paletteName: "Soft Pastels",
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

  {
    paletteName: "Warm Earth",
    scope: "fill-solid",
    type: "single",
    colors: [
      { colorID: "Burnt Umber", hex: "#6E2C00" },
      { colorID: "Clay Brown", hex: "#935116" },
      { colorID: "Terracotta", hex: "#AF601A" },
      { colorID: "Warm Ochre", hex: "#D35400" },
      { colorID: "Dry Moss", hex: "#7D6608" },
      { colorID: "Rust Red", hex: "#A04000" },
      { colorID: "Bark Brown", hex: "#784212" },
      { colorID: "Sandstone", hex: "#F0B27A" },
    ],
  },

  {
    paletteName: "Cool Tech",
    scope: "fill-solid",
    type: "single",
    colors: [
      { colorID: "Midnight Navy", hex: "#0A2540" },
      { colorID: "Steel Blue", hex: "#1F3A5F" },
      { colorID: "Interface Blue", hex: "#2E86C1" },
      { colorID: "Neon Teal", hex: "#48C9B0" },
      { colorID: "UI Grey", hex: "#AAB7B8" },
      { colorID: "Slate UI", hex: "#566573" },
      { colorID: "Sky Interface", hex: "#85C1E9" },
      { colorID: "Mint Circuit", hex: "#1ABC9C" },
    ],
  },

  {
    paletteName: "Neon Pop",
    scope: "fill-solid",
    type: "single",
    colors: [
      { colorID: "Neon Crimson", hex: "#FF1744" },
      { colorID: "Neon Amber", hex: "#FF9100" },
      { colorID: "Neon Lemon", hex: "#FFEA00" },
      { colorID: "Neon Green", hex: "#00E676" },
      { colorID: "Neon Blue", hex: "#2979FF" },
      { colorID: "Neon Violet", hex: "#D500F9" },
      { colorID: "Neon Cyan", hex: "#00E5FF" },
      { colorID: "Neon Pink", hex: "#FF4081" },
    ],
  },

  {
    paletteName: "Retro Digital",
    scope: "fill-solid",
    type: "single",
    colors: [
      { colorID: "CRT Blue", hex: "#0033CC" },
      { colorID: "CRT Red", hex: "#CC0033" },
      { colorID: "CRT Green", hex: "#00CC66" },
      { colorID: "Pixel Yellow", hex: "#FFCC00" },
      { colorID: "Pixel Purple", hex: "#6600CC" },
      { colorID: "Pixel Cyan", hex: "#0099CC" },
      { colorID: "Monitor Black", hex: "#333333" },
      { colorID: "Monitor Grey", hex: "#CCCCCC" },
    ],
  },

  {
    paletteName: "Muted Modern",
    scope: "fill-solid",
    type: "single",
    colors: [
      { colorID: "Muted Navy", hex: "#2C3E50" },
      { colorID: "Muted Slate", hex: "#34495E" },
      { colorID: "Muted Grey", hex: "#7F8C8D" },
      { colorID: "Mist Grey", hex: "#95A5A6" },
      { colorID: "Dusty Violet", hex: "#8E44AD" },
      { colorID: "Dusty Teal", hex: "#16A085" },
      { colorID: "Muted Orange", hex: "#D35400" },
      { colorID: "Muted Red", hex: "#C0392B" },
    ],
  },

  {
    paletteName: "Monochrome Plus",
    scope: "fill-solid",
    type: "single",
    colors: [
      { colorID: "Absolute Black", hex: "#000000" },
      { colorID: "Near Black", hex: "#1C1C1C" },
      { colorID: "Dark Grey", hex: "#3D3D3D" },
      { colorID: "Neutral Grey", hex: "#6F6F6F" },
      { colorID: "Light Grey", hex: "#BDBDBD" },
      { colorID: "Off White", hex: "#F5F5F5" },
      { colorID: "Pure White", hex: "#FFFFFF" },
      { colorID: "Accent Red", hex: "#E53935" },
    ],
  },

  // ==================================================
  // FILL — GRADIENT (10)
  // ==================================================

  {
    paletteName: "Basic Contrast",
    scope: "fill-gradient",
    type: "dual",
    colors: [
      { colorID: "Charcoal", hex: "#1A1A1A", colorID2: "Ash", hex2: "#E0E0E0" },
      { colorID: "Blue Core", hex: "#1976D2", colorID2: "Sky", hex2: "#64B5F6" },
      { colorID: "Green Core", hex: "#388E3C", colorID2: "Mint", hex2: "#81C784" },
    ],
  },

  {
    paletteName: "Sunset Glow",
    scope: "fill-gradient",
    type: "dual",
    colors: [
      { colorID: "Amber", hex: "#FF6F00", colorID2: "Gold", hex2: "#FFCA28" },
      { colorID: "Burnt Orange", hex: "#D84315", colorID2: "Peach", hex2: "#FF8A65" },
      { colorID: "Berry", hex: "#C2185B", colorID2: "Rose", hex2: "#F48FB1" },
    ],
  },

  {
    paletteName: "Ocean Depth",
    scope: "fill-gradient",
    type: "dual",
    colors: [
      { colorID: "Deep Sea", hex: "#0B3C5D", colorID2: "Teal", hex2: "#1ABC9C" },
      { colorID: "Navy", hex: "#154360", colorID2: "Surf", hex2: "#5DADE2" },
      { colorID: "Sapphire", hex: "#1B4F72", colorID2: "Foam", hex2: "#85C1E9" },
    ],
  },

  {
    paletteName: "Neon Flux",
    scope: "fill-gradient",
    type: "dual",
    colors: [
      { colorID: "Neon Blue", hex: "#2979FF", colorID2: "Cyan", hex2: "#00E5FF" },
      { colorID: "Violet", hex: "#D500F9", colorID2: "Pink", hex2: "#FF4081" },
      { colorID: "Green", hex: "#00E676", colorID2: "Lime", hex2: "#C6FF00" },
    ],
  },

  {
    paletteName: "Forest Light",
    scope: "fill-gradient",
    type: "dual",
    colors: [
      { colorID: "Pine", hex: "#145A32", colorID2: "Leaf", hex2: "#58D68D" },
      { colorID: "Moss", hex: "#196F3D", colorID2: "Mint", hex2: "#82E0AA" },
      { colorID: "Emerald", hex: "#1E8449", colorID2: "Soft Green", hex2: "#ABEBC6" },
    ],
  },

  {
    paletteName: "Candy Pastel",
    scope: "fill-gradient",
    type: "dual",
    colors: [
      { colorID: "Pink Cream", hex: "#FADADD", colorID2: "Soft Pink", hex2: "#FBCFE8" },
      { colorID: "Blue Cream", hex: "#D6EAF8", colorID2: "Light Blue", hex2: "#EBF5FB" },
      { colorID: "Vanilla", hex: "#FCF3CF", colorID2: "Cream", hex2: "#FDEBD0" },
    ],
  },

  {
    paletteName: "Heatwave",
    scope: "fill-gradient",
    type: "dual",
    colors: [
      { colorID: "Deep Red", hex: "#B71C1C", colorID2: "Hot Red", hex2: "#FF5252" },
      { colorID: "Lava", hex: "#E65100", colorID2: "Ember", hex2: "#FFB300" },
      { colorID: "Gold Heat", hex: "#F57F17", colorID2: "Glow", hex2: "#FFF176" },
    ],
  },

  {
    paletteName: "Cool Steel",
    scope: "fill-gradient",
    type: "dual",
    colors: [
      { colorID: "Steel Dark", hex: "#2C3E50", colorID2: "Steel Light", hex2: "#95A5A6" },
      { colorID: "Slate", hex: "#34495E", colorID2: "Silver", hex2: "#BDC3C7" },
      { colorID: "UI Grey", hex: "#566573", colorID2: "Fade", hex2: "#D5D8DC" },
    ],
  },

  {
    paletteName: "Cosmic",
    scope: "fill-gradient",
    type: "dual",
    colors: [
      { colorID: "Deep Space", hex: "#311B92", colorID2: "Orbit", hex2: "#512DA8" },
      { colorID: "Galaxy Blue", hex: "#0D47A1", colorID2: "Core", hex2: "#1976D2" },
      { colorID: "Nebula", hex: "#4A148C", colorID2: "Glow", hex2: "#CE93D8" },
    ],
  },

  {
    paletteName: "Monotone Fade",
    scope: "fill-gradient",
    type: "dual",
    colors: [
      { colorID: "Black", hex: "#000000", colorID2: "Fade", hex2: "#434343" },
      { colorID: "Grey", hex: "#2C2C2C", colorID2: "Soft", hex2: "#9E9E9E" },
      { colorID: "Light", hex: "#616161", colorID2: "White", hex2: "#EEEEEE" },
    ],
  },

  // ==================================================
  // FILL — STRIPES (10)
  // ==================================================

  {
    paletteName: "Basic Stripes",
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
    scope: "fill-stripes",
    type: "dual",
    colors: [
      { colorID: "Yellow", hex: "#FBC02D", colorID2: "Black", hex2: "#000000" },
      { colorID: "Orange", hex: "#FF9800", colorID2: "Brown", hex2: "#3E2723" },
      { colorID: "Bright Yellow", hex: "#FFEB3B", colorID2: "Dark Grey", hex2: "#424242" },
    ],
  },

  {
    paletteName: "Candy Cane",
    scope: "fill-stripes",
    type: "dual",
    colors: [
      { colorID: "Red", hex: "#C62828", colorID2: "White", hex2: "#FFFFFF" },
      { colorID: "Berry", hex: "#AD1457", colorID2: "Pink", hex2: "#FCE4EC" },
      { colorID: "Soft Red", hex: "#E53935", colorID2: "Rose", hex2: "#FDEDEC" },
    ],
  },

  {
    paletteName: "Nautical",
    scope: "fill-stripes",
    type: "dual",
    colors: [
      { colorID: "Navy", hex: "#0B3C5D", colorID2: "White", hex2: "#FFFFFF" },
      { colorID: "Teal", hex: "#1ABC9C", colorID2: "Foam", hex2: "#E0F2F1" },
      { colorID: "Blue", hex: "#154360", colorID2: "Sky", hex2: "#AED6F1" },
    ],
  },

  {
    paletteName: "Retro Pixel",
    scope: "fill-stripes",
    type: "dual",
    colors: [
      { colorID: "CRT Blue", hex: "#0033CC", colorID2: "Grey", hex2: "#CCCCCC" },
      { colorID: "CRT Red", hex: "#CC0033", colorID2: "Black", hex2: "#333333" },
      { colorID: "CRT Green", hex: "#00CC66", colorID2: "Dark", hex2: "#111111" },
    ],
  },

  {
    paletteName: "Pastel Pop",
    scope: "fill-stripes",
    type: "dual",
    colors: [
      { colorID: "Blush", hex: "#F6C1CC", colorID2: "White", hex2: "#FFFFFF" },
      { colorID: "Baby Blue", hex: "#D6EAF8", colorID2: "White", hex2: "#FFFFFF" },
      { colorID: "Mint", hex: "#D5F5E3", colorID2: "White", hex2: "#FFFFFF" },
    ],
  },

  {
    paletteName: "Earth Lines",
    scope: "fill-stripes",
    type: "dual",
    colors: [
      { colorID: "Umber", hex: "#6E2C00", colorID2: "Sand", hex2: "#F0B27A" },
      { colorID: "Clay", hex: "#935116", colorID2: "Beige", hex2: "#F5CBA7" },
      { colorID: "Bark", hex: "#784212", colorID2: "Tan", hex2: "#EDBB99" },
    ],
  },

  {
    paletteName: "Neon Club",
    scope: "fill-stripes",
    type: "dual",
    colors: [
      { colorID: "Neon Red", hex: "#FF1744", colorID2: "Black", hex2: "#000000" },
      { colorID: "Neon Cyan", hex: "#00E5FF", colorID2: "Dark", hex2: "#111111" },
      { colorID: "Lime", hex: "#C6FF00", colorID2: "Soft Black", hex2: "#1A1A1A" },
    ],
  },

  {
    paletteName: "Cool Office",
    scope: "fill-stripes",
    type: "dual",
    colors: [
      { colorID: "Slate", hex: "#34495E", colorID2: "Light", hex2: "#ECF0F1" },
      { colorID: "UI Grey", hex: "#566573", colorID2: "Soft", hex2: "#F4F6F7" },
      { colorID: "Navy", hex: "#2C3E50", colorID2: "Grey", hex2: "#D5DBDB" },
    ],
  },

  {
    paletteName: "High Fashion",
    scope: "fill-stripes",
    type: "dual",
    colors: [
      { colorID: "Black", hex: "#000000", colorID2: "Editorial Grey", hex2: "#BDBDBD" },
      { colorID: "Print", hex: "#2C2C2C", colorID2: "White", hex2: "#FFFFFF" },
      { colorID: "Minimal", hex: "#1C1C1C", colorID2: "Ash", hex2: "#E0E0E0" },
    ],
  },

  // ==================================================
  // FILL — PATTERN (10)
  // ==================================================

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

  {
    paletteName: "Knit Warm",
    scope: "fill-pattern",
    type: "single",
    colors: [
      { colorID: "Wool Brown", hex: "#784212" },
      { colorID: "Thread Orange", hex: "#AF601A" },
      { colorID: "Soft Yarn", hex: "#F0B27A" },
      { colorID: "Knit Clay", hex: "#935116" },
      { colorID: "Beige Yarn", hex: "#EDBB99" },
      { colorID: "Deep Wool", hex: "#6E2C00" },
    ],
  },

  {
    paletteName: "Neon Pattern",
    scope: "fill-pattern",
    type: "single",
    colors: [
      { colorID: "Neon Blue", hex: "#2979FF" },
      { colorID: "Neon Cyan", hex: "#00E5FF" },
      { colorID: "Neon Violet", hex: "#D500F9" },
      { colorID: "Neon Pink", hex: "#FF4081" },
      { colorID: "Pattern Black", hex: "#000000" },
      { colorID: "Soft Black", hex: "#1A1A1A" },
    ],
  },

  {
    paletteName: "Garden",
    scope: "fill-pattern",
    type: "single",
    colors: [
      { colorID: "Leaf Dark", hex: "#145A32" },
      { colorID: "Leaf Light", hex: "#58D68D" },
      { colorID: "Stem", hex: "#1E8449" },
      { colorID: "Mint", hex: "#82E0AA" },
      { colorID: "Moss", hex: "#196F3D" },
      { colorID: "Soft Green", hex: "#D5F5E3" },
    ],
  },

  {
    paletteName: "Confetti",
    scope: "fill-pattern",
    type: "single",
    colors: [
      { colorID: "Peach", hex: "#FAD7A0" },
      { colorID: "Pink", hex: "#F6C1CC" },
      { colorID: "Blue", hex: "#D6EAF8" },
      { colorID: "Mint", hex: "#D5F5E3" },
      { colorID: "Cream", hex: "#FCF3CF" },
      { colorID: "Lavender", hex: "#E8DAEF" },
    ],
  },

  {
    paletteName: "Industrial",
    scope: "fill-pattern",
    type: "single",
    colors: [
      { colorID: "Steel", hex: "#2C3E50" },
      { colorID: "Iron", hex: "#566573" },
      { colorID: "Concrete", hex: "#7F8C8D" },
      { colorID: "Dust", hex: "#95A5A6" },
      { colorID: "Machine", hex: "#34495E" },
      { colorID: "Light Steel", hex: "#BDC3C7" },
    ],
  },

  {
    paletteName: "Cosmic Dust",
    scope: "fill-pattern",
    type: "single",
    colors: [
      { colorID: "Space Purple", hex: "#311B92" },
      { colorID: "Nebula", hex: "#512DA8" },
      { colorID: "Star Glow", hex: "#CE93D8" },
      { colorID: "Space Blue", hex: "#0D47A1" },
      { colorID: "Void", hex: "#1A237E" },
      { colorID: "Star Mist", hex: "#E8EAF6" },
    ],
  },

  {
    paletteName: "Paper Print",
    scope: "fill-pattern",
    type: "single",
    colors: [
      { colorID: "Paper", hex: "#FFFFFF" },
      { colorID: "Off White", hex: "#F5F5F5" },
      { colorID: "Print Grey", hex: "#E0E0E0" },
      { colorID: "Ink Light", hex: "#9E9E9E" },
      { colorID: "Ink Dark", hex: "#424242" },
      { colorID: "Heavy Ink", hex: "#212121" },
    ],
  },

  {
    paletteName: "Luxury Fabric",
    scope: "fill-pattern",
    type: "single",
    colors: [
      { colorID: "Velvet Purple", hex: "#4A235A" },
      { colorID: "Silk Violet", hex: "#7D3C98" },
      { colorID: "Satin Lilac", hex: "#AF7AC5" },
      { colorID: "Deep Fabric", hex: "#512E5F" },
      { colorID: "Soft Thread", hex: "#D2B4DE" },
      { colorID: "Highlight", hex: "#F5EEF8" },
    ],
  },

  // ==================================================
  // BORDER (10)
  // ==================================================

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

  {
    paletteName: "Light Outline",
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

  {
    paletteName: "Metallic",
    scope: "border",
    type: "single",
    colors: [
      { colorID: "Silver", hex: "#B0B0B0" },
      { colorID: "Steel", hex: "#7F8C8D" },
      { colorID: "Aluminum", hex: "#95A5A6" },
      { colorID: "Gunmetal", hex: "#566573" },
      { colorID: "Gold", hex: "#D4AC0D" },
      { colorID: "Copper", hex: "#A04000" },
      { colorID: "Bronze", hex: "#784212" },
      { colorID: "Iron", hex: "#2C3E50" },
    ],
  },

  {
    paletteName: "Earth Frame",
    scope: "border",
    type: "single",
    colors: [
      { colorID: "Soil", hex: "#6E2C00" },
      { colorID: "Clay", hex: "#935116" },
      { colorID: "Terracotta", hex: "#AF601A" },
      { colorID: "Bark", hex: "#784212" },
      { colorID: "Sand", hex: "#F0B27A" },
      { colorID: "Moss", hex: "#7D6608" },
      { colorID: "Rust", hex: "#A04000" },
      { colorID: "Dark Wood", hex: "#4E342E" },
    ],
  },

  {
    paletteName: "Pastel Edge",
    scope: "border",
    type: "single",
    colors: [
      { colorID: "Pink", hex: "#F6C1CC" },
      { colorID: "Blue", hex: "#D6EAF8" },
      { colorID: "Mint", hex: "#D5F5E3" },
      { colorID: "Lavender", hex: "#E8DAEF" },
      { colorID: "Cream", hex: "#FCF3CF" },
      { colorID: "Peach", hex: "#FAD7A0" },
      { colorID: "Soft Grey", hex: "#EAECEE" },
      { colorID: "White", hex: "#FFFFFF" },
    ],
  },

  {
    paletteName: "Retro UI",
    scope: "border",
    type: "single",
    colors: [
      { colorID: "CRT Blue", hex: "#0033CC" },
      { colorID: "CRT Red", hex: "#CC0033" },
      { colorID: "CRT Green", hex: "#00CC66" },
      { colorID: "Pixel Yellow", hex: "#FFCC00" },
      { colorID: "UI Black", hex: "#333333" },
      { colorID: "UI Grey", hex: "#CCCCCC" },
      { colorID: "Pixel Purple", hex: "#6600CC" },
      { colorID: "Pixel Cyan", hex: "#0099CC" },
    ],
  },

  {
    paletteName: "Luxury Gold",
    scope: "border",
    type: "single",
    colors: [
      { colorID: "Classic Gold", hex: "#D4AF37" },
      { colorID: "Bright Gold", hex: "#F1C40F" },
      { colorID: "Antique Gold", hex: "#B7950B" },
      { colorID: "Dark Gold", hex: "#7D6608" },
      { colorID: "Light Gold", hex: "#F9E79F" },
      { colorID: "Accent Copper", hex: "#A04000" },
      { colorID: "Bronze", hex: "#784212" },
      { colorID: "Contrast Black", hex: "#2C2C2C" },
    ],
  },

  {
    paletteName: "Minimal Contrast",
    scope: "border",
    type: "single",
    colors: [
      { colorID: "Black", hex: "#000000" },
      { colorID: "White", hex: "#FFFFFF" },
      { colorID: "Dark Grey", hex: "#424242" },
      { colorID: "Light Grey", hex: "#BDBDBD" },
      { colorID: "Near Black", hex: "#1A1A1A" },
      { colorID: "Near White", hex: "#E0E0E0" },
      { colorID: "Neutral", hex: "#616161" },
      { colorID: "Soft White", hex: "#F5F5F5" },
    ],
  },

  // ==================================================
  // SHADOW (10)
  // ==================================================

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

  {
    paletteName: "Warm Shadow",
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
    scope: "shadow",
    type: "single",
    colors: [
      { colorID: "Violet Black", hex: "#1A0F2E" },
      { colorID: "Indigo Shadow", hex: "#2E1A47" },
      { colorID: "Soft Purple", hex: "#3B235A" },
      { colorID: "Plum Shadow", hex: "#4A235A" },
    ],
  },

  {
    paletteName: "Green Shadow",
    scope: "shadow",
    type: "single",
    colors: [
      { colorID: "Forest Shadow", hex: "#0B3D2E" },
      { colorID: "Deep Green", hex: "#145A32" },
      { colorID: "Soft Green", hex: "#1E8449" },
      { colorID: "Moss Shadow", hex: "#196F3D" },
    ],
  },

  {
    paletteName: "Red Shadow",
    scope: "shadow",
    type: "single",
    colors: [
      { colorID: "Blood Shadow", hex: "#3B0A0A" },
      { colorID: "Dark Red", hex: "#641E16" },
      { colorID: "Brick Shadow", hex: "#7B241C" },
      { colorID: "Soft Red", hex: "#922B21" },
    ],
  },

  {
    paletteName: "Blue Shadow",
    scope: "shadow",
    type: "single",
    colors: [
      { colorID: "Midnight Blue", hex: "#0A1A2F" },
      { colorID: "Navy Shadow", hex: "#154360" },
      { colorID: "Ocean Shadow", hex: "#1B4F72" },
      { colorID: "Soft Blue", hex: "#2E86C1" },
    ],
  },

  {
    paletteName: "Soft UI Shadow",
    scope: "shadow",
    type: "single",
    colors: [
      { colorID: "UI Dark", hex: "#1C1C1C" },
      { colorID: "UI Medium", hex: "#2C2C2C" },
      { colorID: "UI Light", hex: "#3D3D3D" },
      { colorID: "UI Ambient", hex: "#4F4F4F" },
    ],
  },

  {
    paletteName: "Ambient Grey",
    scope: "shadow",
    type: "single",
    colors: [
      { colorID: "Deep Ambient", hex: "#111111" },
      { colorID: "Ambient Dark", hex: "#1E1E1E" },
      { colorID: "Ambient Mid", hex: "#2A2A2A" },
      { colorID: "Ambient Light", hex: "#3A3A3A" },
    ],
  },

  {
    paletteName: "Dramatic Shadow",
    scope: "shadow",
    type: "single",
    colors: [
      { colorID: "Absolute Void", hex: "#000000" },
      { colorID: "Purple Void", hex: "#120B1F" },
      { colorID: "Teal Void", hex: "#0B1F1A" },
      { colorID: "Red Void", hex: "#1F0B0B" },
    ],
  },
];
