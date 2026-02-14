/**
 * Root layout.
 * Wraps the entire app in the AppProvider (state) and ThemeProvider (colors).
 * Redirects to server-config if the app is not yet configured.
 *
 * IMPORTANT: <Slot /> must always be rendered so the navigation tree exists.
 * Redirects happen in useEffect after the navigator has mounted.
 */

import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

import { AppProvider, useApp } from '../src/context/AppContext';
import { ThemeProvider } from '../src/theme';

function RootNavigator() {
  const { state, loadAllData } = useApp();
  const router = useRouter();
  const segments = useSegments();

  // Redirect based on configuration.
  // Skips until isInitialized is true (storage has been read),
  // which guarantees <Slot /> has already rendered and mounted the navigator.
  useEffect(() => {
    if (!state.isInitialized) return;

    const inConfigScreen = segments[0] === 'server-config';

    if (!state.isConfigured && !inConfigScreen) {
      router.replace('/server-config');
    } else if (state.isConfigured && inConfigScreen) {
      router.replace('/');
    }
  }, [state.isInitialized, state.isConfigured, segments, router]);

  // Load all vehicle data once configured
  useEffect(() => {
    if (state.isConfigured) {
      loadAllData();
    }
  }, [state.isConfigured, loadAllData]);

  // Slot is ALWAYS rendered so the navigation container exists.
  return (
    <ThemeProvider dark={state.darkMode}>
      <StatusBar style={state.darkMode ? 'light' : 'dark'} />
      <Slot />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <AppProvider>
        <RootNavigator />
      </AppProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
