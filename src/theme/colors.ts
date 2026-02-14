/**
 * TrailCurrent color palette.
 * Extracted from the Android app's Theme.kt (TrailCurrentPalette + TrailCurrentColors).
 */

// ── Brand colors ──────────────────────────────────────────────

export const palette = {
  primary: '#52A441',
  primaryLight: '#7BC96A',
  primaryDark: '#3D7B31',
  secondary: '#D0E2C7',
  secondaryDark: '#9AB090',
  link: '#83A79C',

  success: '#74FE00',
  info: '#48E6FE',
  danger: '#FF5453',
  warning: '#FFC107',

  white: '#FFFFFF',
  light: '#EBEBEB',
  dark: '#000000',

  primaryBgSubtle: '#DCEDD9',
  secondaryBgSubtle: '#EDF3EA',
  surfaceLight: '#FAFAFA',
  surfaceDark: '#121212',
  surfaceVariantDark: '#1E1E1E',
} as const;

// ── Semantic colors (same in both themes) ─────────────────────

export const semantic = {
  solar: '#FFC107',
  batteryGood: '#74FE00',
  batteryLow: '#FF5453',
  heating: '#FF5453',
  cooling: '#48E6FE',
  freshWater: '#48E6FE',
  greyWater: '#9E9E9E',
  blackWater: '#424242',
  statusGood: '#74FE00',
  statusWarning: '#FFC107',
  statusCritical: '#FF5453',
  statusInfo: '#48E6FE',
} as const;

// ── Theme-aware color sets ────────────────────────────────────

export type ThemeColors = {
  primary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  secondaryContainer: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  onSurface: string;
  onSurfaceVariant: string;
  error: string;
  link: string;
};

export const lightColors: ThemeColors = {
  primary: palette.primary,
  primaryContainer: palette.primaryBgSubtle,
  onPrimaryContainer: palette.primaryDark,
  secondary: palette.secondary,
  secondaryContainer: palette.secondaryBgSubtle,
  background: palette.surfaceLight,
  surface: palette.white,
  surfaceVariant: palette.light,
  onSurface: palette.dark,
  onSurfaceVariant: '#505050',
  error: palette.danger,
  link: palette.link,
};

export const darkColors: ThemeColors = {
  primary: palette.primaryLight,
  primaryContainer: palette.primaryDark,
  onPrimaryContainer: palette.primaryBgSubtle,
  secondary: palette.secondaryDark,
  secondaryContainer: '#3D5035',
  background: palette.surfaceDark,
  surface: palette.surfaceVariantDark,
  surfaceVariant: '#2D2D2D',
  onSurface: palette.light,
  onSurfaceVariant: '#BDBDBD',
  error: palette.danger,
  link: palette.link,
};
