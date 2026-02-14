/**
 * Light control card — tap to toggle, long-press to show brightness slider.
 * Mirrors the Android app's light grid items.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import Slider from './Slider';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { Light } from '../types';

type Props = {
  light: Light;
  onToggle: (light: Light) => void;
  onBrightnessChange: (light: Light, percent: number) => void;
};

export default function LightCard({ light, onToggle, onBrightnessChange }: Props) {
  const { colors, typography: t, radius: r, shadow: s, spacing: sp } = useTheme();
  const [showSlider, setShowSlider] = useState(false);

  const isOn = light.state === 1;
  const brightnessPercent = Math.round((light.brightness / 255) * 100);
  const displayName = light.name ?? `Light ${light.id}`;

  return (
    <>
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: isOn ? colors.primaryContainer : colors.surface,
            borderRadius: r.card,
            ...s.card,
          },
        ]}
        onPress={() => onToggle(light)}
        onLongPress={() => setShowSlider(true)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isOn ? 'bulb' : 'bulb-outline'}
          size={28}
          color={isOn ? colors.primary : colors.onSurfaceVariant}
        />
        <Text
          style={[t.labelLarge, { color: colors.onSurface, marginTop: sp.sm }]}
          numberOfLines={1}
        >
          {displayName}
        </Text>
        {isOn && (
          <Text style={[t.labelSmall, { color: colors.onSurfaceVariant, marginTop: 2 }]}>
            {brightnessPercent}%
          </Text>
        )}
      </TouchableOpacity>

      {/* Brightness modal */}
      <Modal visible={showSlider} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setShowSlider(false)}>
          <View
            style={[
              styles.modal,
              { backgroundColor: colors.surface, borderRadius: r.card },
            ]}
          >
            <Text style={[t.titleMedium, { color: colors.onSurface, marginBottom: sp.lg }]}>
              {displayName} Brightness
            </Text>
            <Slider
              value={brightnessPercent}
              onValueChange={(v) => onBrightnessChange(light, v)}
              minimumValue={0}
              maximumValue={100}
              color={colors.primary}
              trackColor={colors.surfaceVariant}
            />
            <Text style={[t.bodyMedium, { color: colors.onSurfaceVariant, marginTop: sp.sm, textAlign: 'center' }]}>
              {brightnessPercent}%
            </Text>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
    minHeight: 100,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  modal: {
    width: '100%',
    padding: 24,
  },
});
