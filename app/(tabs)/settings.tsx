/**
 * Settings screen — server URL, API key, dark mode, about.
 * Mirrors the Android app's SettingsScreen.kt.
 */

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../../src/context/AppContext';
import { useTheme } from '../../src/theme';
import StatusCard from '../../src/components/StatusCard';
import * as storage from '../../src/services/storage';

export default function SettingsScreen() {
  const { state, toggleDarkMode, configure } = useApp();
  const { colors, typography: t, spacing: sp, radius: r } = useTheme();

  const [showApiKey, setShowApiKey] = useState(false);
  const [editingKey, setEditingKey] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');

  async function saveApiKey() {
    if (newApiKey.trim()) {
      await storage.setApiKey(newApiKey.trim());
      // Re-configure to pick up new key
      if (state.serverUrl) {
        await configure(state.serverUrl, newApiKey.trim());
      }
    }
    setEditingKey(false);
    setNewApiKey('');
  }

  function confirmClearConfig() {
    Alert.alert(
      'Reset Configuration',
      'This will clear your server URL and API key. You will need to reconfigure the app.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await storage.setServerUrl('');
            await storage.clearApiKey();
            // Force a reload — setting empty URL triggers server-config redirect
            await configure('', null);
          },
        },
      ],
    );
  }

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Server URL */}
      <Text style={[t.titleMedium, { color: colors.onSurface, marginBottom: sp.sm }]}>
        Server
      </Text>
      <StatusCard>
        <View style={styles.row}>
          <Ionicons name="server-outline" size={20} color={colors.onSurfaceVariant} />
          <Text style={[t.bodyMedium, { color: colors.onSurface, marginLeft: sp.sm, flex: 1 }]} numberOfLines={1}>
            {state.serverUrl || 'Not configured'}
          </Text>
        </View>
      </StatusCard>

      {/* API Key */}
      <Text style={[t.titleMedium, { color: colors.onSurface, marginTop: sp.lg, marginBottom: sp.sm }]}>
        API Key
      </Text>
      <StatusCard>
        {editingKey ? (
          <View>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceVariant,
                  color: colors.onSurface,
                  borderRadius: r.input,
                },
              ]}
              placeholder="Enter new API key"
              placeholderTextColor={colors.onSurfaceVariant}
              value={newApiKey}
              onChangeText={setNewApiKey}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
            />
            <View style={[styles.row, { marginTop: sp.md }]}>
              <TouchableOpacity onPress={() => setEditingKey(false)} style={styles.linkBtn}>
                <Text style={[t.labelLarge, { color: colors.onSurfaceVariant }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveApiKey} style={styles.linkBtn}>
                <Text style={[t.labelLarge, { color: colors.primary }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.row}>
              <Ionicons name="key-outline" size={20} color={colors.onSurfaceVariant} />
              <Text style={[t.bodyMedium, { color: colors.onSurface, marginLeft: sp.sm, flex: 1 }]}>
                {state.apiKey
                  ? showApiKey
                    ? state.apiKey
                    : '••••••••••••'
                  : 'Not set'}
              </Text>
              {state.apiKey && (
                <TouchableOpacity onPress={() => setShowApiKey(!showApiKey)}>
                  <Ionicons
                    name={showApiKey ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.onSurfaceVariant}
                  />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={() => setEditingKey(true)} style={{ marginTop: sp.md }}>
              <Text style={[t.labelLarge, { color: colors.primary }]}>
                {state.apiKey ? 'Change API Key' : 'Set API Key'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </StatusCard>

      {/* Dark Mode */}
      <Text style={[t.titleMedium, { color: colors.onSurface, marginTop: sp.lg, marginBottom: sp.sm }]}>
        Appearance
      </Text>
      <StatusCard>
        <View style={styles.row}>
          <Ionicons name="moon-outline" size={20} color={colors.onSurfaceVariant} />
          <Text style={[t.bodyMedium, { color: colors.onSurface, marginLeft: sp.sm, flex: 1 }]}>
            Dark Mode
          </Text>
          <Switch
            value={state.darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: colors.surfaceVariant, true: colors.primary }}
            thumbColor={colors.surface}
          />
        </View>
      </StatusCard>

      {/* About */}
      <Text style={[t.titleMedium, { color: colors.onSurface, marginTop: sp.lg, marginBottom: sp.sm }]}>
        About
      </Text>
      <StatusCard>
        <Text style={[t.titleMedium, { color: colors.onSurface }]}>TrailCurrent</Text>
        <Text style={[t.bodySmall, { color: colors.onSurfaceVariant, marginTop: sp.xs }]}>
          Version 1.0.0
        </Text>
        <Text style={[t.bodyMedium, { color: colors.onSurfaceVariant, marginTop: sp.md }]}>
          Open-source Software Defined Vehicle platform built on edge-first autonomous intelligence.
        </Text>
      </StatusCard>

      {/* Reset */}
      <TouchableOpacity
        style={[styles.dangerButton, { borderColor: colors.error, borderRadius: r.button }]}
        onPress={confirmClearConfig}
      >
        <Text style={[t.labelLarge, { color: colors.error }]}>Reset Configuration</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 48 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  linkBtn: {
    marginRight: 16,
  },
  dangerButton: {
    height: 48,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
});
