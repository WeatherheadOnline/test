export type PatternOption = {
  patternURL: string;
  patternId: string;
  patternRepeat: boolean;
};

export const PATTERNS: PatternOption[] = [
  {
    patternURL: "/patterns/checker.svg",
    patternId: "checker",
    patternRepeat: true,
  },
  {
    patternURL: "/patterns/crosses.svg",
    patternId: "crosses",
    patternRepeat: true,
  },
  {
    patternURL: "/patterns/diagonal-stripes.svg",
    patternId: "diagonal-stripes",
    patternRepeat: true,
  },
  {
    patternURL: "/patterns/dots.svg",
    patternId: "dots",
    patternRepeat: true,
  },
  {
    patternURL: "/patterns/zig-dots.svg",
    patternId: "zig-dots",
    patternRepeat: true,
  },
];