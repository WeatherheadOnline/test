"use client";

import { useEffect } from "react";
import { useUser } from "@/providers/UserProvider";
import Landing from "@/components/Landing/Landing";
import What from "@/components/What/What";
import Feed from "@/components/Feed/Feed";
import BitPreview from "@/components/BitPreview/BitPreview";

export default function Home() {
  const { user, authLoading } = useUser();

  useEffect(() => {
    sessionStorage.removeItem("isLoggingOut");
  }, []);

  return (
    <main>
      <Landing />

      <What />

      {!user && <BitPreview />}

      {user && <Feed />}
    </main>
  );
}