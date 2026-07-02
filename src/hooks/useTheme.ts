"use client";

import { useEffect, useState } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    const goingDark = !html.classList.contains("dark");
    html.classList.toggle("dark");
    try { localStorage.setItem("plenty-theme", goingDark ? "dark" : "light"); } catch {}
    setIsDark(goingDark);
  };

  return { isDark, toggle };
}
