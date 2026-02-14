/**
 * Energy screen — solar, battery, voltage, charge status.
 * Mirrors the Android app's EnergyScreen.kt.
 */

import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../../src/context/AppContext';
import { useTheme } from '../../src/theme';
import StatusCard from '../../src/components/StatusCard';
import ConnectionBadge from '../../src/components/ConnectionBadge';

// ── Progress bar ──────────────────────────────────────────────

function ProgressBar({ percent, color, trackColor }: { percent: number; color: string; trackColor: string }) {
  return (
    <View style={[styles.progressTrack, { backgroundColor: trackColor }]}>
      <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, percent))}%`, backgroundColor: color }]} />
    </View>
  );
}

// ── Energy card ───────────────────────────────────────────────

function EnergyCard({
  icon,
  label,
  value,
  unit,
  color,
  progress,
}: {
  icon: string;
  label: string;
  value: string;
  unit: string;
  color: string;
  progress?: number;
}) {
  const { colors, typography: t, spacing: sp } = useTheme();

  return (
    <StatusCard>
      <View style={styles.cardHeader}>
        <Ionicons name={icon as any} size={24} color={color} />
        <Text style={[t.labelLarge, { color: colors.onSurfaceVariant, marginLeft: sp.sm }]}>{label}</Text>
      </View>
      <Text style={[t.headlineSmall, { color: colors.onSurface, marginTop: sp.sm }]}>
        {value}
        <Text style={[t.bodySmall, { color: colors.onSurfaceVariant }]}> {unit}</Text>
      </Text>
      {progress !== undefined && (
        <ProgressBar percent={progress} color={color} trackColor={colors.surfaceVariant} />
      )}
    </StatusCard>
  );
}

// ── Screen ────────────────────────────────────────────────────

export default function EnergyScreen() {
  const { state, loadAllData } = useApp();
  const { colors, typography: t, semantic, spacing: sp } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  }, [loadAllData]);

  const energy = state.energy;

  // Battery color based on level
  const batteryColor =
    (energy?.batteryPercent ?? 100) > 20 ? semantic.batteryGood : semantic.batteryLow;

  // Charge type display
  const chargeLabel = (type?: string) => {
    switch (type) {
      case 'float': return 'Float';
      case 'bulk': return 'Bulk';
      case 'absorption': return 'Absorption';
      case 'equalize': return 'Equalize';
      default: return '--';
    }
  };

  // Time remaining
  const timeLabel = (minutes?: number | null) => {
    if (!minutes || minutes <= 0) return '--';
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <ConnectionBadge connected={state.isConnected} />

      <Text style={[t.titleMedium, { color: colors.onSurface, marginTop: sp.lg, marginBottom: sp.sm }]}>
        Energy
      </Text>

      <EnergyCard
        icon="sunny-outline"
        label="Solar Input"
        value={energy?.solarWatts.toFixed(0) ?? '--'}
        unit="W"
        color={semantic.solar}
      />

      <EnergyCard
        icon="battery-half-outline"
        label="Battery Level"
        value={energy?.batteryPercent.toFixed(0) ?? '--'}
        unit="%"
        color={batteryColor}
        progress={energy?.batteryPercent}
      />

      <EnergyCard
        icon="flash-outline"
        label="Battery Voltage"
        value={energy?.batteryVoltage.toFixed(1) ?? '--'}
        unit="V"
        color={colors.primary}
      />

      <StatusCard>
        <View style={styles.cardHeader}>
          <Ionicons name="swap-vertical-outline" size={24} color={colors.primary} />
          <Text style={[t.labelLarge, { color: colors.onSurfaceVariant, marginLeft: sp.sm }]}>
            Charge Status
          </Text>
        </View>
        <Text style={[t.headlineSmall, { color: colors.onSurface, marginTop: sp.sm }]}>
          {chargeLabel(energy?.chargeType)}
        </Text>
      </StatusCard>

      <StatusCard>
        <View style={styles.cardHeader}>
          <Ionicons name="time-outline" size={24} color={colors.primary} />
          <Text style={[t.labelLarge, { color: colors.onSurfaceVariant, marginLeft: sp.sm }]}>
            Time Remaining
          </Text>
        </View>
        <Text style={[t.headlineSmall, { color: colors.onSurface, marginTop: sp.sm }]}>
          {timeLabel(energy?.timeRemainingMinutes)}
        </Text>
      </StatusCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
