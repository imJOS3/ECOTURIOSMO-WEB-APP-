import { useState, useEffect } from "react";

export const useTheme = () => {
  const [dark, setDark] = useState(() => localStorage.getItem("eco_theme") === "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("eco_theme", dark ? "dark" : "light");
  }, [dark]);

  const toggle = () => setDark(d => !d);

  return { dark, toggle };
};