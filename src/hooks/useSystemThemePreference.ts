import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

export interface SystemThemePreferenceResult {
  /**
   * The live, real-time operating system preference ('dark' or 'light')
   */
  systemTheme: ResolvedTheme;
  /**
   * The effective theme currently applied to the workspace ('dark' or 'light')
   */
  resolvedTheme: ResolvedTheme;
  /**
   * The user-selected mode setting ('system', 'light', or 'dark')
   */
  themeMode: ThemeMode;
  /**
   * Whether the active theme is currently being driven automatically by OS system preferences
   */
  isSystemPreference: boolean;
  /**
   * Updates the theme mode setting ('system', 'light', or 'dark')
   */
  setThemeMode: (mode: ThemeMode) => void;
  /**
   * Manually sets an explicit theme ('light' or 'dark')
   */
  setTheme: (theme: ResolvedTheme) => void;
  /**
   * Toggles between light and dark modes
   */
  toggleTheme: () => void;
}

export interface UseSystemThemePreferenceOptions {
  storageKey?: string;
  defaultMode?: ThemeMode;
  onThemeChange?: (theme: ResolvedTheme, mode: ThemeMode) => void;
}

const STORAGE_KEY_MODE = 'growvest_theme_mode';
const STORAGE_KEY_LEGACY = 'growvest_theme';
const STORAGE_KEY_FALLBACK_LEGACY = 'greeneza_theme';

/**
 * Reads the current OS color scheme preference safely
 */
export const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'dark';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * Automated hook that detects OS system color scheme preferences,
 * listens for real-time OS theme switching (sunset/sunrise, OS toggles),
 * and coordinates between automatic system sync and explicit user overrides.
 */
export const useSystemThemePreference = (
  options: UseSystemThemePreferenceOptions = {}
): SystemThemePreferenceResult => {
  const {
    storageKey = STORAGE_KEY_MODE,
    defaultMode = 'system',
    onThemeChange
  } = options;

  // 1. Initialize OS preference
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => getSystemTheme());

  // 2. Initialize Theme Mode ('system' | 'light' | 'dark')
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return defaultMode;
    try {
      const savedMode = localStorage.getItem(storageKey) as ThemeMode | null;
      if (savedMode && (savedMode === 'system' || savedMode === 'light' || savedMode === 'dark')) {
        return savedMode;
      }
      // Check legacy single-theme storage
      const savedLegacy = (localStorage.getItem(STORAGE_KEY_LEGACY) ||
        localStorage.getItem(STORAGE_KEY_FALLBACK_LEGACY)) as ResolvedTheme | null;
      if (savedLegacy === 'light' || savedLegacy === 'dark') {
        return savedLegacy;
      }
    } catch (_e) {
      // LocalStorage access restricted or unavailable
    }
    return defaultMode;
  });

  // Calculate resolved effective theme
  const resolvedTheme: ResolvedTheme = themeMode === 'system' ? systemTheme : themeMode;
  const isSystemPreference = themeMode === 'system';

  // 3. Real-time media query listener for OS preference changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const newSysTheme: ResolvedTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newSysTheme);
    };

    // Initialize with latest reading
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
    // Safari < 14 and legacy fallback
    else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(handleSystemThemeChange);
      return () => (mediaQuery as any).removeListener(handleSystemThemeChange);
    }
  }, []);

  // 4. Apply theme to DOM (document.documentElement) and notify listeners
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    // Persist active settings
    try {
      localStorage.setItem(storageKey, themeMode);
      localStorage.setItem(STORAGE_KEY_LEGACY, resolvedTheme);
      localStorage.setItem(STORAGE_KEY_FALLBACK_LEGACY, resolvedTheme);
    } catch (_e) {
      // Ignore storage errors
    }

    if (onThemeChange) {
      onThemeChange(resolvedTheme, themeMode);
    }
  }, [resolvedTheme, themeMode, storageKey, onThemeChange]);

  // Set explicit theme mode ('system', 'light', or 'dark')
  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem(storageKey, mode);
    } catch (_e) {
      // Ignore storage error
    }
  }, [storageKey]);

  // Set explicit light or dark theme (switches mode to user-directed)
  const setTheme = useCallback((theme: ResolvedTheme) => {
    setThemeMode(theme);
  }, [setThemeMode]);

  // Toggle theme helper
  const toggleTheme = useCallback(() => {
    setThemeModeState(prevMode => {
      if (prevMode === 'system') {
        // If currently following system, toggle to the opposite of current system
        const next = systemTheme === 'dark' ? 'light' : 'dark';
        try {
          localStorage.setItem(storageKey, next);
        } catch (_e) {}
        return next;
      }
      const next = prevMode === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(storageKey, next);
      } catch (_e) {}
      return next;
    });
  }, [storageKey, systemTheme]);

  return {
    systemTheme,
    resolvedTheme,
    themeMode,
    isSystemPreference,
    setThemeMode,
    setTheme,
    toggleTheme
  };
};
