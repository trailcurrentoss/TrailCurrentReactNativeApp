/**
 * Circular thermostat dial — Nest-style.
 * Drag around the arc to adjust the target temperature.
 * Mirrors the Android app's ThermostatDial composable.
 */

import React, { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '../theme';
import { ThermostatState, ThermostatMode } from '../types';

type Props = {
  thermostat: ThermostatState | null;
  currentTemp: number | null;
  onTempChange: (temp: number) => void;
  onToggle: () => void;
};

const DIAL_SIZE = 240;
const STROKE_WIDTH = 14;
const MIN_TEMP = 50;
const MAX_TEMP = 90;
const ARC_START_DEG = 135; // gap at the bottom
const ARC_SWEEP_DEG = 270;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function modeColor(mode: ThermostatMode, semantic: ReturnType<typeof useTheme>['semantic']) {
  switch (mode) {
    case 'heat':
      return semantic.heating;
    case 'cool':
      return semantic.cooling;
    case 'auto':
      return semantic.statusInfo;
    default:
      return '#888';
  }
}

export default function ThermostatDial({ thermostat, currentTemp, onTempChange, onToggle }: Props) {
  const { colors, semantic, typography: t, spacing: sp } = useTheme();
  const layoutRef = useRef({ cx: 0, cy: 0 });

  const mode = thermostat?.mode ?? 'off';
  const target = thermostat?.targetTemp ?? 72;
  const isOff = mode === 'off';
  const arcColor = isOff ? '#888' : modeColor(mode as ThermostatMode, semantic);

  // Fraction of arc filled (based on target temp within range)
  const fraction = (target - MIN_TEMP) / (MAX_TEMP - MIN_TEMP);

  // Pan gesture: convert touch angle to temperature
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (isOff) return;
      const { cx, cy } = layoutRef.current;
      const dx = e.absoluteX - cx;
      const dy = e.absoluteY - cy;
      // Angle from center (0 = right, clockwise)
      let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
      // Rotate so 0 = arc start
      angleDeg = (angleDeg - ARC_START_DEG + 360) % 360;
      if (angleDeg > ARC_SWEEP_DEG) return; // outside arc
      const pct = angleDeg / ARC_SWEEP_DEG;
      const temp = Math.round(MIN_TEMP + pct * (MAX_TEMP - MIN_TEMP));
      onTempChange(clamp(temp, MIN_TEMP, MAX_TEMP));
    })
    .minDistance(0);

  // Tap gesture: toggle on/off
  const tapGesture = Gesture.Tap().onEnd(() => {
    onToggle();
  });

  const composed = Gesture.Race(panGesture, tapGesture);

  return (
    <GestureDetector gesture={composed}>
      <View
        style={styles.container}
        onLayout={(e) => {
          const { x, y, width, height } = e.nativeEvent.layout;
          // We need absolute coords; this is approximate (works for centered layouts)
          layoutRef.current = { cx: x + width / 2, cy: y + height / 2 };
        }}
      >
        {/* Background arc (track) */}
        <View style={[styles.dial, { borderColor: colors.surfaceVariant }]}>
          {/* Colored fill indicator */}
          <View
            style={[
              styles.arcFill,
              {
                borderColor: arcColor,
                borderTopColor: arcColor,
                transform: [{ rotate: `${fraction * ARC_SWEEP_DEG - 45}deg` }],
              },
            ]}
          />

          {/* Center content */}
          <View style={styles.center}>
            <Text style={[t.displaySmall, { color: colors.onSurface }]}>
              {isOff ? '--' : `${target}°`}
            </Text>
            {currentTemp !== null && !isOff && (
              <Text style={[t.bodySmall, { color: colors.onSurfaceVariant, marginTop: sp.xs }]}>
                Currently {Math.round(currentTemp)}°F
              </Text>
            )}
            <Text
              style={[
                t.labelMedium,
                {
                  color: arcColor,
                  marginTop: sp.sm,
                  textTransform: 'uppercase',
                },
              ]}
            >
              {mode}
            </Text>
          </View>
        </View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  dial: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    borderRadius: DIAL_SIZE / 2,
    borderWidth: STROKE_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arcFill: {
    position: 'absolute',
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    borderRadius: DIAL_SIZE / 2,
    borderWidth: STROKE_WIDTH,
    borderColor: 'transparent',
    opacity: 0.3,
  },
  center: {
    alignItems: 'center',
  },
});
