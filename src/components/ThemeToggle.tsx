"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // One-time read of the class the blocking no-flash script (in layout.tsx)
    // already applied before hydration — not a subscription, so there's
    // nothing to synchronize on repeatedly here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // localStorage unavailable (private browsing, etc.) — theme just won't persist
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      className="text-muted hover:text-foreground transition-colors text-sm cursor-pointer"
    >
      {isDark ? "light" : "dark"}
    </button>
  );
}
