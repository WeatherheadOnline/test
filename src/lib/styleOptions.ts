export type StyleOption = {
  unlockId: string;    // matches the unlock system: "style.fill.gradient"
  arrayName: string;   // internal name used in logic: "gradient"
  buttonText: string;  // text shown on the button: "Gradient"
  icon?: React.ReactNode; // optional future metadata (bonus)
};

export const STYLE_OPTIONS: StyleOption[] = [
  {
    unlockId: "style.fill.solid",
    arrayName: "solid",
    buttonText: "Solid",
  },
  {
    unlockId: "style.fill.gradient",
    arrayName: "gradient",
    buttonText: "Gradient",
  },
  {
    unlockId: "style.fill.stripes",
    arrayName: "stripes",
    buttonText: "Stripes",
  },
  {
    unlockId: "style.fill.pattern",
    arrayName: "pattern",
    buttonText: "Pattern",
  },
];