export type ColourId = string;

export type ColourDefinition = {
  id: ColourId;
  hex: string;
  pack?: string; // unlock id
};

export const COLOURS: ColourDefinition[] = [
  { id: "white", hex: "#ffffff" },
  { id: "black", hex: "#000000" },
  { id: "yellow", hex: "#fde047" },
  { id: "green", hex: "#22c55e" },
  { id: "blue", hex: "#0ea5e9" },

  { id: "purple", hex: "#a855f7", pack: "fill:colors:pack1" },
  { id: "orange", hex: "#f97316", pack: "fill:colors:pack1" },
  { id: "gray", hex: "#6b7280", pack: "shadow:colors:pack1" },
  { id: "blue-dark", hex: "#1e40af", pack: "shadow:colors:pack1" },
];
