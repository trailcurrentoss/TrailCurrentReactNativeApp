/**
 * Home screen — thermostat dial + light grid.
 * Mirrors the Android app's HomeScreen.kt.
 */

import { View, Text, FlatList, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';

import { useApp } from '../../src/context/AppContext';
import { useTheme } from '../../src/theme';
import ThermostatDial from '../../src/components/ThermostatDial';
import LightCard from '../../src/components/LightCard';
import ConnectionBadge from '../../src/components/ConnectionBadge';
import StatusCard from '../../src/components/StatusCard';

export default function HomeScreen() {
  const { state, loadAllData, setThermostatTemp, toggleThermostat, toggleLight, setLightBrightness } = useApp();
  const { colors, typography: t, spacing: sp } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  }, [loadAllData]);

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      {/* Connection status */}
      <ConnectionBadge connected={state.isConnected} />

      {/* Thermostat */}
      <Text style={[t.titleMedium, { color: colors.onSurface, marginTop: sp.lg, marginBottom: sp.sm }]}>
        Climate
      </Text>
      <StatusCard>
        <ThermostatDial
          thermostat={state.thermostat}
          currentTemp={state.currentTemp}
          onTempChange={setThermostatTemp}
          onToggle={toggleThermostat}
        />
      </StatusCard>

      {/* Lights */}
      <Text style={[t.titleMedium, { color: colors.onSurface, marginTop: sp.lg, marginBottom: sp.sm }]}>
        Lights
      </Text>

      {state.lights.length === 0 ? (
        <StatusCard>
          <Text style={[t.bodyMedium, { color: colors.onSurfaceVariant, textAlign: 'center' }]}>
            No lights found
          </Text>
        </StatusCard>
      ) : (
        <View style={styles.grid}>
          {state.lights.map((light) => (
            <LightCard
              key={light.id}
              light={light}
              onToggle={toggleLight}
              onBrightnessChange={setLightBrightness}
            />
          ))}
        </View>
      )}

      {/* Error */}
      {state.error && (
        <Text style={[t.bodySmall, { color: colors.error, marginTop: sp.md, textAlign: 'center' }]}>
          {state.error}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
