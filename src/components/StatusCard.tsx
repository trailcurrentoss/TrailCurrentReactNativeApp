/**
 * Reusable card wrapper matching the style guide:
 * rounded corners, subtle shadow, themed background.
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme';

type Props = {
  children: ReactNode;
  style?: ViewStyle;
};

export default function StatusCard({ children, style }: Props) {
  const { colors, radius: r, shadow: s } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderRadius: r.card,
          ...s.card,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
  },
});
