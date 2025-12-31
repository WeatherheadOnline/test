// 'use client'?

import { useEffect, useRef, useState } from "react";
import BitExperience from "@/components/BitExperience/BitExperience";
import { defaultAppearance } from "@/lib/defaultAppearance";

import "./bitPreview.css";
import "@/styles/globals.css";

export default function BitPreview() {
  const [status, setStatus] = useState(false);
  const [flipCount, setFlipCount] = useState(0);
  const [flipSignal, setFlipSignal] = useState(0);

  const FLIP_COOLDOWN_MS = 200;
  const lastFlipAtRef = useRef<number>(0);

  useEffect(() => {
    const stored = localStorage.getItem("previewFlipCount");
    if (stored) setFlipCount(Number(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("previewFlipCount", String(flipCount));
  }, [flipCount]);

const handleFlip = () => {
  const now = Date.now();

  if (now - lastFlipAtRef.current < FLIP_COOLDOWN_MS) {
    return;
  }

  lastFlipAtRef.current = now;

  setStatus((prev) => !prev);
  setFlipCount((prev) => prev + 1);
  setFlipSignal((prev) => prev + 1);
};


  return (
    <section className="page-section what-section">
      <BitExperience
        mode="preview"
        value={status ? "1" : "0"}
        flipCount={flipCount}
        appearance={defaultAppearance}
        unlocks={[]}
        onFlip={handleFlip}
        flipSignal={flipSignal}
      />
    </section>
  );
}
