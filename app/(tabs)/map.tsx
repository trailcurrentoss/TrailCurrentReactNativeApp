/**
 * Map screen — MapView with vehicle marker, compass, position info.
 * Mirrors the Android app's MapScreen.kt.
 */

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../../src/context/AppContext';
import { useTheme } from '../../src/theme';
import StatusCard from '../../src/components/StatusCard';
import ConnectionBadge from '../../src/components/ConnectionBadge';

// ── Compass widget ────────────────────────────────────────────

function Compass({ heading }: { heading: number }) {
  const { colors, typography: t } = useTheme();
  return (
    <View style={styles.compass}>
      <View
        style={[
          styles.compassInner,
          {
            backgroundColor: colors.surface,
            transform: [{ rotate: `${-heading}deg` }],
          },
        ]}
      >
        <Text style={[t.labelSmall, { color: '#FF5453' }]}>N</Text>
        <View style={[styles.compassNeedle, { backgroundColor: '#FF5453' }]} />
      </View>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────

export default function MapScreen() {
  const { state } = useApp();
  const { colors, typography: t, semantic, spacing: sp, radius: r, shadow: s } = useTheme();
  const mapRef = useRef<MapView>(null);
  const [followVehicle, setFollowVehicle] = useState(true);

  const pos = state.gpsLatLon;
  const alt = state.gpsAltitude;
  const gnss = state.gnssDetails;
  const heading = gnss?.courseOverGround ?? 0;

  // Center on vehicle when position updates and follow is on
  useEffect(() => {
    if (pos && followVehicle && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: pos.latitude,
        longitude: pos.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  }, [pos?.latitude, pos?.longitude, followVehicle]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        showsUserLocation={false}
        initialRegion={{
          latitude: pos?.latitude ?? 39.8283,
          longitude: pos?.longitude ?? -98.5795,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPanDrag={() => setFollowVehicle(false)}
      >
        {pos && (
          <Marker
            coordinate={{ latitude: pos.latitude, longitude: pos.longitude }}
            title="Vehicle"
          >
            <View style={[styles.vehicleMarker, { backgroundColor: colors.primary }]}>
              <Ionicons name="navigate" size={18} color="#fff" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Overlay: connection badge */}
      <View style={styles.topOverlay}>
        <ConnectionBadge connected={state.isConnected} />
      </View>

      {/* Overlay: compass + re-center */}
      <View style={styles.rightOverlay}>
        <Compass heading={heading} />

        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.surface, ...s.card }]}
          onPress={() => setFollowVehicle(true)}
        >
          <Ionicons
            name={followVehicle ? 'locate' : 'locate-outline'}
            size={22}
            color={followVehicle ? colors.primary : colors.onSurfaceVariant}
          />
        </TouchableOpacity>
      </View>

      {/* Bottom position card */}
      {pos && (
        <View style={styles.bottomOverlay}>
          <StatusCard style={styles.posCard}>
            <View style={styles.posRow}>
              <View style={styles.posItem}>
                <Text style={[t.labelSmall, { color: colors.onSurfaceVariant }]}>Lat</Text>
                <Text style={[t.titleSmall, { color: colors.onSurface }]}>
                  {pos.latitude.toFixed(6)}
                </Text>
              </View>
              <View style={styles.posItem}>
                <Text style={[t.labelSmall, { color: colors.onSurfaceVariant }]}>Lon</Text>
                <Text style={[t.titleSmall, { color: colors.onSurface }]}>
                  {pos.longitude.toFixed(6)}
                </Text>
              </View>
              {alt && (
                <View style={styles.posItem}>
                  <Text style={[t.labelSmall, { color: colors.onSurfaceVariant }]}>Alt</Text>
                  <Text style={[t.titleSmall, { color: colors.onSurface }]}>
                    {alt.altitudeFeet.toFixed(0)} ft
                  </Text>
                </View>
              )}
              <View style={styles.posItem}>
                <Text style={[t.labelSmall, { color: colors.onSurfaceVariant }]}>Hdg</Text>
                <Text style={[t.titleSmall, { color: colors.onSurface }]}>
                  {heading.toFixed(0)}°
                </Text>
              </View>
            </View>
          </StatusCard>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  map: { flex: 1 },
  topOverlay: {
    position: 'absolute',
    top: 12,
    left: 16,
  },
  rightOverlay: {
    position: 'absolute',
    top: 12,
    right: 16,
    alignItems: 'center',
    gap: 12,
  },
  compass: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  compassNeedle: {
    width: 2,
    height: 14,
    borderRadius: 1,
    marginTop: 2,
  },
  fab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  posCard: {
    marginBottom: 0,
  },
  posRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  posItem: {
    alignItems: 'center',
  },
});
