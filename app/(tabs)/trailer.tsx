/**
 * Trailer screen — bubble level indicators + GNSS detail cards.
 * Mirrors the Android app's TrailerScreen.kt.
 */

import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../../src/context/AppContext';
import { useTheme } from '../../src/theme';
import StatusCard from '../../src/components/StatusCard';
import ConnectionBadge from '../../src/components/ConnectionBadge';

// ── Bubble level indicator ────────────────────────────────────

function BubbleLevel({ label, degrees }: { label: string; degrees: number }) {
  const { colors, typography: t, semantic, spacing: sp, radius: r } = useTheme();

  // Clamp to ±15 degrees for display
  const clamped = Math.max(-15, Math.min(15, degrees));
  const offset = (clamped / 15) * 50; // percentage from center
  const isLevel = Math.abs(degrees) < 0.5;
  const dotColor = isLevel ? semantic.statusGood : semantic.statusWarning;

  return (
    <StatusCard>
      <Text style={[t.titleMedium, { color: colors.onSurface, marginBottom: sp.md }]}>
        {label}
      </Text>
      {/* Track */}
      <View style={[styles.levelTrack, { backgroundColor: colors.surfaceVariant, borderRadius: r.badge }]}>
        {/* Center mark */}
        <View style={[styles.centerMark, { backgroundColor: colors.onSurfaceVariant }]} />
        {/* Bubble */}
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: dotColor,
              left: `${50 + offset}%`,
            },
          ]}
        />
      </View>
      <Text style={[t.headlineSmall, { color: colors.onSurface, textAlign: 'center', marginTop: sp.md }]}>
        {degrees.toFixed(1)}°
      </Text>
      <Text style={[t.bodySmall, { color: colors.onSurfaceVariant, textAlign: 'center' }]}>
        {isLevel ? 'Level' : degrees > 0 ? 'Tilted right' : 'Tilted left'}
      </Text>
    </StatusCard>
  );
}

// ── Detail row ────────────────────────────────────────────────

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  const { colors, typography: t, spacing: sp } = useTheme();
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailLeft}>
        <Ionicons name={icon as any} size={20} color={colors.onSurfaceVariant} />
        <Text style={[t.bodyMedium, { color: colors.onSurfaceVariant, marginLeft: sp.sm }]}>{label}</Text>
      </View>
      <Text style={[t.titleSmall, { color: colors.onSurface }]}>{value}</Text>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────

export default function TrailerScreen() {
  const { state, loadAllData } = useApp();
  const { colors, typography: t, spacing: sp } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  }, [loadAllData]);

  const level = state.trailerLevel;
  const gnss = state.gnssDetails;
  const pos = state.gpsLatLon;

  // GNSS mode label
  const gnssModeName = (mode?: number) => {
    switch (mode) {
      case 1: return 'No fix';
      case 2: return '2D Fix';
      case 3: return '3D Fix';
      default: return 'Unknown';
    }
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <ConnectionBadge connected={state.isConnected} />

      {/* Level indicators */}
      <Text style={[t.titleMedium, { color: colors.onSurface, marginTop: sp.lg, marginBottom: sp.sm }]}>
        Leveling
      </Text>
      <BubbleLevel label="Front / Back" degrees={level?.frontBack ?? 0} />
      <BubbleLevel label="Side to Side" degrees={level?.sideToSide ?? 0} />

      {/* Position */}
      {pos && (
        <>
          <Text style={[t.titleMedium, { color: colors.onSurface, marginTop: sp.lg, marginBottom: sp.sm }]}>
            Position
          </Text>
          <StatusCard>
            <DetailRow icon="location-outline" label="Latitude" value={pos.latitude.toFixed(6)} />
            <DetailRow icon="location-outline" label="Longitude" value={pos.longitude.toFixed(6)} />
          </StatusCard>
        </>
      )}

      {/* GNSS Details */}
      {gnss && (
        <>
          <Text style={[t.titleMedium, { color: colors.onSurface, marginTop: sp.lg, marginBottom: sp.sm }]}>
            GNSS Details
          </Text>
          <StatusCard>
            <DetailRow icon="satellite-outline" label="Satellites" value={String(gnss.numberOfSatellites)} />
            <DetailRow icon="speedometer-outline" label="Speed" value={`${gnss.speedOverGround.toFixed(1)} kn`} />
            <DetailRow icon="compass-outline" label="Course" value={`${gnss.courseOverGround.toFixed(1)}°`} />
            <DetailRow icon="radio-outline" label="Mode" value={gnssModeName(gnss.gnssMode)} />
          </StatusCard>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  levelTrack: {
    height: 32,
    position: 'relative',
    justifyContent: 'center',
  },
  centerMark: {
    position: 'absolute',
    width: 2,
    height: '100%',
    left: '50%',
    marginLeft: -1,
  },
  bubble: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: -12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
