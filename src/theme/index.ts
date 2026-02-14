/**
 * Theme provider and useTheme() hook.
 *
 * Wraps the app in a context that provides the current color scheme,
 * typography, spacing, and a toggle for dark mode.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { lightColors, darkColors, semantic, ThemeColors } from './colors';
import { typography } from './typography';
import { spacing, radius, shadow } from './spacing';

export { semantic } from './colors';
export { typography } from './typography';
export { spacing, radius, shadow } from './spacing';

// ── Theme shape ───────────────────────────────────────────────

export type Theme = {
  dark: boolean;
  colors: ThemeColors;
  semantic: typeof semantic;
  typography: typeof typography;
  spacing: typeof spacing;
  radius: typeof radius;
  shadow: typeof shadow;
};

// ── Context ───────────────────────────────────────────────────

const ThemeContext = createContext<Theme | null>(null);

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return theme;
}

// ── Provider ──────────────────────────────────────────────────

type ThemeProviderProps = {
  dark: boolean;
  children: React.ReactNode;
};

export function ThemeProvider({ dark, children }: ThemeProviderProps) {
  const theme = useMemo<Theme>(
    () => ({
      dark,
      colors: dark ? darkColors : lightColors,
      semantic,
      typography,
      spacing,
      radius,
      shadow,
    }),
    [dark],
  );

  return React.createElement(ThemeContext.Provider, { value: theme }, children);
}
