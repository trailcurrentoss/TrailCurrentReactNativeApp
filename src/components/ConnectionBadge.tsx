/**
 * Small pill badge showing online/offline connection status.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

type Props = { connected: boolean };

export default function ConnectionBadge({ connected }: Props) {
  const { semantic: s, typography: t, radius: r } = useTheme();
  const color = connected ? s.statusGood : s.statusCritical;
  const label = connected ? 'Connected' : 'Offline';

  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderRadius: r.badge }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[t.labelSmall, styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  label: {},
});
