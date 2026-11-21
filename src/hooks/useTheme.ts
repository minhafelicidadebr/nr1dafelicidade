import { useCallback, useEffect, useState } from "react";

export type AppThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "theme";
const THEME_CHANGE_EVENT = "ift-theme-change";

export function readStoredTheme(): AppThemeMode {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw === "light" || raw === "dark") {
      return raw;
    }
  } catch {
    // Storage may be unavailable in restricted contexts
  }
  if (typeof document !== "undefined") {
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  }
  return "dark";
}

export function applyThemeToDom(theme: AppThemeMode): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
    root.style.colorScheme = "light";
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage errors
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<AppThemeMode>(() => readStoredTheme());

  useEffect(() => {
    applyThemeToDom(theme);
  }, [theme]);

  useEffect(() => {
    const handleExternalChange = (event: Event) => {
      const custom = event as CustomEvent<AppThemeMode>;
      if (custom.detail === "light" || custom.detail === "dark") {
        setThemeState(custom.detail);
      } else {
        setThemeState(readStoredTheme());
      }
    };
    window.addEventListener(THEME_CHANGE_EVENT, handleExternalChange);
    window.addEventListener("storage", handleExternalChange);
    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleExternalChange);
      window.removeEventListener("storage", handleExternalChange);
    };
  }, []);

  const setTheme = useCallback((next: AppThemeMode) => {
    applyThemeToDom(next);
    setThemeState(next);
    window.dispatchEvent(new CustomEvent<AppThemeMode>(THEME_CHANGE_EVENT, { detail: next }));
  }, []);

  const toggleTheme = useCallback(() => {
    const next: AppThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(next);
  }, [theme, setTheme]);

  return {
    theme,
    isDark: theme === "dark",
    isLight: theme === "light",
    setTheme,
    toggleTheme,
  };
}
