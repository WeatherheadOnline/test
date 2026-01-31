import { useEffect, useRef, useState } from "react";
import BitExperience from "@/components/BitExperience/BitExperience";
import Link from "next/link";
import { useHeaderConfig } from "@/providers/HeaderConfigProvider";

import "./bitPreview.css";
import "@/styles/globals.css";

export default function BitPreview() {
  const [status, setStatus] = useState(false);
  const [flipCount, setFlipCount] = useState(0);
  const { config } = useHeaderConfig();

  const FLIP_COOLDOWN_MS = 200;
  const lastFlipAtRef = useRef<number>(0);

  const handleFlip = () => {
    const now = Date.now();

    if (now - lastFlipAtRef.current < FLIP_COOLDOWN_MS) {
      return;
    }

    lastFlipAtRef.current = now;

    setStatus((prev) => !prev);
    setFlipCount((prev) => prev + 1);
  };

  return (
    <section className="page-section what-section">
      <BitExperience
        mode="preview"
        value={status ? "1" : "0"}
        flipCount={flipCount}
        onFlip={handleFlip}
        showShare={false}
      />
      <div className="button-wrapper bit-exp-CTA-wrapper">
        <Link className="navlink" href="/signup">
          Sign up
        </Link>
        <button
          type="button"
          onClick={() => {
            config.onLoginClick?.();
          }}
        >
          Log in
        </button>
      </div>
    </section>
  );
}
