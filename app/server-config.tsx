/**
 * Server Configuration screen.
 * Shown on first launch. Collects server URL and API key,
 * tests the connection via /api/health, then saves.
 */

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../src/context/AppContext';
import { useTheme } from '../src/theme';
import { healthCheck } from '../src/services/api';

export default function ServerConfigScreen() {
  const { configure } = useApp();
  const theme = useTheme();
  const router = useRouter();
  const { colors, typography: t, spacing: sp, radius: r } = theme;

  const [serverUrl, setServerUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testOk, setTestOk] = useState(false);

  async function testConnection() {
    if (!serverUrl.trim()) {
      setTestResult('Please enter a server URL');
      setTestOk(false);
      return;
    }

    setTesting(true);
    setTestResult(null);

    const result = await healthCheck({
      baseUrl: serverUrl.trim(),
      apiKey: apiKey.trim() || undefined,
    });

    setTesting(false);

    if (result.ok) {
      setTestResult('Connection successful!');
      setTestOk(true);
    } else {
      setTestResult(`Connection failed: ${result.error}`);
      setTestOk(false);
    }
  }

  async function save() {
    await configure(serverUrl.trim(), apiKey.trim() || null);
    router.replace('/');
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="server-outline" size={64} color={colors.primary} />
          <Text style={[t.headlineSmall, { color: colors.onSurface, marginTop: sp.lg }]}>
            Server Setup
          </Text>
          <Text style={[t.bodyMedium, { color: colors.onSurfaceVariant, marginTop: sp.sm, textAlign: 'center' }]}>
            Enter the URL of your TrailCurrent server to get started.
          </Text>
        </View>

        {/* Server URL */}
        <Text style={[t.labelLarge, { color: colors.onSurface, marginBottom: sp.xs }]}>
          Server URL
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surfaceVariant,
              color: colors.onSurface,
              borderRadius: r.input,
            },
          ]}
          placeholder="http://192.168.1.100:3000"
          placeholderTextColor={colors.onSurfaceVariant}
          value={serverUrl}
          onChangeText={setServerUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />

        {/* API Key */}
        <Text style={[t.labelLarge, { color: colors.onSurface, marginTop: sp.lg, marginBottom: sp.xs }]}>
          API Key (optional)
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surfaceVariant,
              color: colors.onSurface,
              borderRadius: r.input,
            },
          ]}
          placeholder="Enter API key"
          placeholderTextColor={colors.onSurfaceVariant}
          value={apiKey}
          onChangeText={setApiKey}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />

        {/* Test Connection */}
        <TouchableOpacity
          style={[styles.buttonOutline, { borderColor: colors.primary, borderRadius: r.button, marginTop: sp['2xl'] }]}
          onPress={testConnection}
          disabled={testing}
        >
          {testing ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={[t.labelLarge, { color: colors.primary }]}>Test Connection</Text>
          )}
        </TouchableOpacity>

        {/* Test result message */}
        {testResult && (
          <Text
            style={[
              t.bodyMedium,
              {
                color: testOk ? theme.semantic.statusGood : theme.semantic.statusCritical,
                marginTop: sp.md,
                textAlign: 'center',
              },
            ]}
          >
            {testResult}
          </Text>
        )}

        {/* Save & Continue */}
        <TouchableOpacity
          style={[
            styles.buttonFilled,
            {
              backgroundColor: testOk ? colors.primary : colors.surfaceVariant,
              borderRadius: r.button,
              marginTop: sp.lg,
            },
          ]}
          onPress={save}
          disabled={!serverUrl.trim()}
        >
          <Text
            style={[
              t.labelLarge,
              { color: testOk ? '#000' : colors.onSurfaceVariant },
            ]}
          >
            Save & Continue
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  input: {
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  buttonOutline: {
    height: 48,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonFilled: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
