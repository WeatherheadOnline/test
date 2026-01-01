"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Gate() {
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const mainRef = useRef<HTMLElement | null>(null);

  const router = useRouter();
  const hasNavigatedRef = useRef(false);

  const navigateHome = () => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    router.replace("/");
  };

  useEffect(() => {
    mainRef.current?.focus();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((s) => Math.max(s - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (secondsRemaining === 0) {
      navigateHome();
    }
  }, [secondsRemaining]);

  return (
    <main role="main" tabIndex={-1} ref={mainRef}>
      <h1>You don't have access to this page.</h1>
      <p aria-live="polite">
        You’ll be redirected to the homepage in {secondsRemaining} second
        {secondsRemaining === 1 ? "" : "s"}.
      </p>
      <button onClick={navigateHome}>Go to homepage now</button>
    </main>
  );
}