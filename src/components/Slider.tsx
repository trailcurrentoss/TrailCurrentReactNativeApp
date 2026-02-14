/**
 * Simple horizontal slider built with PanResponder.
 * Avoids pulling in a third-party slider library.
 */

import React, { useRef, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent, PanResponder } from 'react-native';

type Props = {
  value: number;
  minimumValue: number;
  maximumValue: number;
  onValueChange: (value: number) => void;
  color: string;
  trackColor: string;
};

export default function Slider({
  value,
  minimumValue,
  maximumValue,
  onValueChange,
  color,
  trackColor,
}: Props) {
  const widthRef = useRef(0);
  const [localValue, setLocalValue] = useState(value);
  const dragging = useRef(false);

  const fraction = (localValue - minimumValue) / (maximumValue - minimumValue);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        dragging.current = true;
      },
      onPanResponderMove: (_, gesture) => {
        if (widthRef.current === 0) return;
        const rawFraction = gesture.moveX / widthRef.current;
        const clamped = Math.max(0, Math.min(1, rawFraction));
        const newValue = Math.round(minimumValue + clamped * (maximumValue - minimumValue));
        setLocalValue(newValue);
      },
      onPanResponderRelease: () => {
        dragging.current = false;
        onValueChange(localValue);
      },
    }),
  ).current;

  // Keep in sync when not dragging
  if (!dragging.current && value !== localValue) {
    setLocalValue(value);
  }

  function onLayout(e: LayoutChangeEvent) {
    widthRef.current = e.nativeEvent.layout.width;
  }

  return (
    <View
      style={styles.container}
      onLayout={onLayout}
      {...panResponder.panHandlers}
    >
      <View style={[styles.track, { backgroundColor: trackColor }]}>
        <View
          style={[
            styles.fill,
            { backgroundColor: color, width: `${fraction * 100}%` },
          ]}
        />
      </View>
      <View
        style={[
          styles.thumb,
          {
            backgroundColor: color,
            left: `${fraction * 100}%`,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: -12,
    top: 8,
  },
});
