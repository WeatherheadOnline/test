"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function RedirectToGate() {
  const router = useRouter();
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    mainRef.current?.focus();
    router.replace("/gate?reason=auth");
  }, [router]);

  return (
    <main role="main" tabIndex={-1} ref={mainRef}>
      <h1>You don’t have access to this page.</h1>
      <p>Redirecting…</p>
    </main>
  );
}