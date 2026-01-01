"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type HeaderConfig = {
  onLoginClick?: () => void;
};

const HeaderConfigContext = createContext<{
  config: HeaderConfig;
  setConfig: (c: HeaderConfig) => void;
  focusLoginOnMount: boolean;
  setFocusLoginOnMount: (v: boolean) => void;
} | null>(null);

export function HeaderConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<HeaderConfig>({});
  const [focusLoginOnMount, setFocusLoginOnMount] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
  setFocusLoginOnMount(false);
}, [pathname]);

  return (
<HeaderConfigContext.Provider
  value={{
    config,
    setConfig,
    focusLoginOnMount,
    setFocusLoginOnMount,
  }}
>
          {children}
    </HeaderConfigContext.Provider>
  );
}

export function useHeaderConfig() {
  const ctx = useContext(HeaderConfigContext);
  if (!ctx) throw new Error("useHeaderConfig must be used inside HeaderConfigProvider");
  return ctx;
}