/**
 * Water screen — fresh, grey, and black tank levels.
 * Mirrors the Android app's WaterScreen.kt.
 */

import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';

import { useApp } from '../../src/context/AppContext';
import { useTheme } from '../../src/theme';
import StatusCard from '../../src/components/StatusCard';
import TankBar from '../../src/components/TankBar';
import ConnectionBadge from '../../src/components/ConnectionBadge';

export default function WaterScreen() {
  const { state, loadAllData } = useApp();
  const { colors, typography: t, semantic, spacing: sp } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  }, [loadAllData]);

  const water = state.water;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <ConnectionBadge connected={state.isConnected} />

      <Text style={[t.titleMedium, { color: colors.onSurface, marginTop: sp.lg, marginBottom: sp.sm }]}>
        Water Tanks
      </Text>

      <StatusCard>
        <View style={styles.tanks}>
          <TankBar
            label="Fresh"
            percent={water?.fresh ?? 0}
            color={semantic.freshWater}
            invertWarning={false}
          />
          <TankBar
            label="Grey"
            percent={water?.grey ?? 0}
            color={semantic.greyWater}
            invertWarning
          />
          <TankBar
            label="Black"
            percent={water?.black ?? 0}
            color={semantic.blackWater}
            invertWarning
          />
        </View>
      </StatusCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  tanks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
});
