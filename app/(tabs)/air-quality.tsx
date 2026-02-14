/**
 * Air Quality screen — temperature, humidity, IAQ index, CO2.
 * Mirrors the Android app's AirQualityScreen.kt.
 */

import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../../src/context/AppContext';
import { useTheme } from '../../src/theme';
import StatusCard from '../../src/components/StatusCard';
import ConnectionBadge from '../../src/components/ConnectionBadge';

// ── IAQ helpers ───────────────────────────────────────────────

function iaqLabel(index: number): string {
  if (index <= 50) return 'Good';
  if (index <= 100) return 'Moderate';
  if (index <= 150) return 'Sensitive Groups';
  if (index <= 200) return 'Unhealthy';
  if (index <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

function iaqColor(index: number, semantic: ReturnType<typeof useTheme>['semantic']): string {
  if (index <= 50) return semantic.statusGood;
  if (index <= 100) return semantic.statusWarning;
  return semantic.statusCritical;
}

function co2Recommendation(ppm: number): string {
  if (ppm < 800) return 'Air quality is good';
  if (ppm < 1000) return 'Consider ventilating';
  if (ppm < 1500) return 'Ventilation recommended';
  return 'Ventilation needed';
}

function humidityStatus(h: number): string {
  if (h < 30) return 'Too dry';
  if (h <= 60) return 'Comfortable';
  return 'Too humid';
}

// ── Screen ────────────────────────────────────────────────────

export default function AirQualityScreen() {
  const { state, loadAllData } = useApp();
  const { colors, typography: t, semantic, spacing: sp, radius: r } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  }, [loadAllData]);

  const aq = state.airQuality;
  const th = state.tempHumid;

  const iaqIdx = aq?.iaqIndex ?? 0;
  const co2 = aq?.co2Ppm ?? 0;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <ConnectionBadge connected={state.isConnected} />

      {/* Temperature + Humidity */}
      <Text style={[t.titleMedium, { color: colors.onSurface, marginTop: sp.lg, marginBottom: sp.sm }]}>
        Climate
      </Text>

      <View style={styles.row}>
        <StatusCard style={styles.halfCard}>
          <Ionicons name="thermometer-outline" size={28} color={semantic.heating} />
          <Text style={[t.headlineSmall, { color: colors.onSurface, marginTop: sp.sm }]}>
            {th ? `${th.tempInF.toFixed(1)}°F` : '--'}
          </Text>
          <Text style={[t.bodySmall, { color: colors.onSurfaceVariant }]}>
            {th ? `${th.tempInC.toFixed(1)}°C` : ''}
          </Text>
        </StatusCard>

        <StatusCard style={styles.halfCard}>
          <Ionicons name="water-outline" size={28} color={semantic.statusInfo} />
          <Text style={[t.headlineSmall, { color: colors.onSurface, marginTop: sp.sm }]}>
            {th ? `${th.humidity.toFixed(0)}%` : '--'}
          </Text>
          <Text style={[t.bodySmall, { color: colors.onSurfaceVariant }]}>
            {th ? humidityStatus(th.humidity) : ''}
          </Text>
        </StatusCard>
      </View>

      {/* IAQ Index */}
      <Text style={[t.titleMedium, { color: colors.onSurface, marginTop: sp.lg, marginBottom: sp.sm }]}>
        Air Quality Index
      </Text>

      <StatusCard>
        <View style={styles.iaqRow}>
          <View>
            <Text style={[t.displaySmall, { color: colors.onSurface }]}>{iaqIdx || '--'}</Text>
            <Text style={[t.bodySmall, { color: colors.onSurfaceVariant }]}>IAQ Index</Text>
          </View>
          <View style={[styles.iaqBadge, { backgroundColor: iaqColor(iaqIdx, semantic) + '22', borderRadius: r.badge }]}>
            <Text style={[t.labelLarge, { color: iaqColor(iaqIdx, semantic) }]}>{iaqLabel(iaqIdx)}</Text>
          </View>
        </View>
      </StatusCard>

      {/* CO2 */}
      <Text style={[t.titleMedium, { color: colors.onSurface, marginTop: sp.lg, marginBottom: sp.sm }]}>
        CO2 Level
      </Text>

      <StatusCard>
        <Text style={[t.headlineSmall, { color: colors.onSurface }]}>
          {co2 || '--'}
          <Text style={[t.bodySmall, { color: colors.onSurfaceVariant }]}> ppm</Text>
        </Text>
        <Text style={[t.bodyMedium, { color: colors.onSurfaceVariant, marginTop: sp.sm }]}>
          {co2 > 0 ? co2Recommendation(co2) : ''}
        </Text>
      </StatusCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCard: {
    flex: 1,
    alignItems: 'center',
  },
  iaqRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iaqBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
});
