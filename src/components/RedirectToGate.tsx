"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectToGate() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/gate");
  }, [router]);

  return (
    <main role="main" tabIndex={-1}>
      <h1>You don’t have access to this page.</h1>
      <p>Redirecting…</p>
    </main>
  );
}