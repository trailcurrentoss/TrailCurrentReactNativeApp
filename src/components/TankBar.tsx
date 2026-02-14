/**
 * Vertical fill bar for water tank levels.
 * Fill rises from bottom, colored by tank type.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

type Props = {
  label: string;
  percent: number; // 0-100
  color: string;
  /** For waste tanks (grey/black), high = bad. For fresh, low = bad. */
  invertWarning?: boolean;
};

const BAR_HEIGHT = 180;

export default function TankBar({ label, percent, color, invertWarning }: Props) {
  const { colors, typography: t, semantic, spacing: sp, radius: r } = useTheme();

  const clamped = Math.max(0, Math.min(100, percent));
  const fillHeight = (clamped / 100) * BAR_HEIGHT;

  // Determine status
  const isWarning = invertWarning ? clamped > 75 : clamped < 25;
  const isCritical = invertWarning ? clamped > 90 : clamped < 10;
  const statusColor = isCritical ? semantic.statusCritical : isWarning ? semantic.statusWarning : semantic.statusGood;
  const statusLabel = isCritical ? 'Critical' : isWarning ? 'Warning' : 'Good';

  return (
    <View style={styles.container}>
      <Text style={[t.labelLarge, { color: colors.onSurface, marginBottom: sp.sm }]}>{label}</Text>
      {/* Tank bar */}
      <View style={[styles.tank, { backgroundColor: colors.surfaceVariant, borderRadius: r.input }]}>
        <View
          style={[
            styles.fill,
            {
              height: fillHeight,
              backgroundColor: color,
              borderRadius: r.input,
            },
          ]}
        />
      </View>
      {/* Percentage */}
      <Text style={[t.headlineSmall, { color: colors.onSurface, marginTop: sp.sm }]}>
        {clamped}%
      </Text>
      {/* Status */}
      <View style={[styles.statusBadge, { backgroundColor: statusColor + '22', borderRadius: r.badge }]}>
        <Text style={[t.labelSmall, { color: statusColor }]}>{statusLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tank: {
    width: '100%',
    height: BAR_HEIGHT,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  fill: {
    width: '100%',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 6,
  },
});
