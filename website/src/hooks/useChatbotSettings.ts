import { useState } from "react";

export function useChatbotSettings() {
  const [size, setSize] = useState<"small" | "medium" | "large">("medium");
  const [position, setPosition] = useState<
    "right-bottom" | "left-bottom" | "right-top" | "left-top"
  >("right-bottom");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const applyTheme = (mode: "light" | "dark") => {
    setTheme(mode);
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return { size, setSize, position, setPosition, theme, applyTheme };
}
