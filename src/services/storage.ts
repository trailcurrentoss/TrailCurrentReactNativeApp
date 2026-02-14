/**
 * Persistent storage helpers.
 * - SecureStore for sensitive values (API key).
 * - AsyncStorage for general preferences.
 *
 * Mirrors the Android app's PreferencesManager.kt.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// ── Keys ──────────────────────────────────────────────────────

const KEYS = {
  SERVER_URL: 'server_url',
  API_KEY: 'api_key', // stored in SecureStore
  DARK_MODE: 'dark_mode',
  TIMEZONE: 'timezone',
  CLOCK_FORMAT: 'clock_format',
} as const;

// ── Server URL ────────────────────────────────────────────────

export async function getServerUrl(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.SERVER_URL);
}

export async function setServerUrl(url: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.SERVER_URL, url);
}

/**
 * Derive the WebSocket URL from the HTTP server URL.
 * http://… → ws://…   and   https://… → wss://…
 */
export function toWebSocketUrl(httpUrl: string): string {
  return httpUrl.replace(/^http/, 'ws').replace(/\/+$/, '');
}

// ── API Key (secure) ──────────────────────────────────────────

export async function getApiKey(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.API_KEY);
}

export async function setApiKey(key: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.API_KEY, key);
}

export async function clearApiKey(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.API_KEY);
}

// ── Dark mode ─────────────────────────────────────────────────

export async function getDarkMode(): Promise<boolean> {
  const value = await AsyncStorage.getItem(KEYS.DARK_MODE);
  return value === 'true';
}

export async function setDarkMode(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.DARK_MODE, String(enabled));
}

// ── Timezone ──────────────────────────────────────────────────

export async function getTimezone(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.TIMEZONE);
}

export async function setTimezone(tz: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.TIMEZONE, tz);
}

// ── Clock format ──────────────────────────────────────────────

export async function getClockFormat(): Promise<string> {
  const value = await AsyncStorage.getItem(KEYS.CLOCK_FORMAT);
  return value ?? '12h';
}

export async function setClockFormat(format: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.CLOCK_FORMAT, format);
}

// ── Convenience ───────────────────────────────────────────────

/** Returns true if a server URL has been configured. */
export async function isConfigured(): Promise<boolean> {
  const url = await getServerUrl();
  return url !== null && url.length > 0;
}
