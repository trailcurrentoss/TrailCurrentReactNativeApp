/**
 * Typography scale matching the Android app's Material 3 type definitions.
 * Uses system fonts (San Francisco on iOS, Roboto on Android).
 */

import { TextStyle } from 'react-native';

export const typography = {
  displayLarge: {
    fontSize: 57,
    fontWeight: '400',
    lineHeight: 64,
    letterSpacing: -0.25,
  } as TextStyle,

  displayMedium: {
    fontSize: 45,
    fontWeight: '400',
    lineHeight: 52,
  } as TextStyle,

  displaySmall: {
    fontSize: 36,
    fontWeight: '400',
    lineHeight: 44,
  } as TextStyle,

  headlineLarge: {
    fontSize: 32,
    fontWeight: '400',
    lineHeight: 40,
  } as TextStyle,

  headlineMedium: {
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 36,
  } as TextStyle,

  headlineSmall: {
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 32,
  } as TextStyle,

  titleLarge: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  } as TextStyle,

  titleMedium: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.15,
  } as TextStyle,

  titleSmall: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.1,
  } as TextStyle,

  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.5,
  } as TextStyle,

  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.25,
  } as TextStyle,

  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.4,
  } as TextStyle,

  labelLarge: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.1,
  } as TextStyle,

  labelMedium: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.5,
  } as TextStyle,

  labelSmall: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.5,
  } as TextStyle,
} as const;
