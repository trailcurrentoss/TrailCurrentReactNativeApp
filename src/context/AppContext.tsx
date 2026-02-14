/**
 * Global application state.
 *
 * A single React Context + useReducer holds all vehicle data, connection
 * status, and configuration.  Every screen reads from here; WebSocket
 * events and API responses write to it via dispatch.
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react';

import {
  ThermostatState,
  Light,
  TrailerLevel,
  EnergyState,
  WaterState,
  AirQualityState,
  TempHumidState,
  GpsLatLon,
  GpsAltitude,
  GnssDetails,
} from '../types';

import * as api from '../services/api';
import * as storage from '../services/storage';
import { createWebSocket, WsEvent } from '../services/websocket';

// ── State shape ───────────────────────────────────────────────

export type AppState = {
  // Has the initial storage read finished?
  isInitialized: boolean;

  // Configuration
  serverUrl: string | null;
  apiKey: string | null;
  isConfigured: boolean;
  darkMode: boolean;

  // Connection
  isConnected: boolean;

  // Vehicle data
  thermostat: ThermostatState | null;
  currentTemp: number | null;
  lights: Light[];
  trailerLevel: TrailerLevel | null;
  energy: EnergyState | null;
  water: WaterState | null;
  airQuality: AirQualityState | null;
  tempHumid: TempHumidState | null;
  gpsLatLon: GpsLatLon | null;
  gpsAltitude: GpsAltitude | null;
  gnssDetails: GnssDetails | null;

  // UI
  isLoading: boolean;
  error: string | null;
};

const initialState: AppState = {
  isInitialized: false,
  serverUrl: null,
  apiKey: null,
  isConfigured: false,
  darkMode: false,
  isConnected: false,
  thermostat: null,
  currentTemp: null,
  lights: [],
  trailerLevel: null,
  energy: null,
  water: null,
  airQuality: null,
  tempHumid: null,
  gpsLatLon: null,
  gpsAltitude: null,
  gnssDetails: null,
  isLoading: false,
  error: null,
};

// ── Actions ───────────────────────────────────────────────────

type Action =
  | { type: 'SET_INITIALIZED' }
  | { type: 'SET_CONFIG'; serverUrl: string; apiKey: string | null }
  | { type: 'SET_DARK_MODE'; enabled: boolean }
  | { type: 'SET_CONNECTED'; connected: boolean }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'SET_THERMOSTAT'; data: ThermostatState }
  | { type: 'SET_CURRENT_TEMP'; temp: number }
  | { type: 'SET_LIGHTS'; data: Light[] }
  | { type: 'UPDATE_LIGHT'; data: Light }
  | { type: 'SET_TRAILER_LEVEL'; data: TrailerLevel }
  | { type: 'SET_ENERGY'; data: EnergyState }
  | { type: 'SET_WATER'; data: WaterState }
  | { type: 'SET_AIR_QUALITY'; data: AirQualityState }
  | { type: 'SET_TEMP_HUMID'; data: TempHumidState }
  | { type: 'SET_GPS_LATLON'; data: GpsLatLon }
  | { type: 'SET_GPS_ALTITUDE'; data: GpsAltitude }
  | { type: 'SET_GNSS_DETAILS'; data: GnssDetails };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: true };
    case 'SET_CONFIG':
      return {
        ...state,
        serverUrl: action.serverUrl,
        apiKey: action.apiKey,
        isConfigured: true,
      };
    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.enabled };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.connected };
    case 'SET_LOADING':
      return { ...state, isLoading: action.loading };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'SET_THERMOSTAT':
      return { ...state, thermostat: action.data };
    case 'SET_CURRENT_TEMP':
      return { ...state, currentTemp: action.temp };
    case 'SET_LIGHTS':
      return { ...state, lights: action.data };
    case 'UPDATE_LIGHT': {
      const updated = state.lights.map((l) =>
        l.id === action.data.id
          ? { ...l, state: action.data.state, brightness: action.data.brightness }
          : l,
      );
      return { ...state, lights: updated };
    }
    case 'SET_TRAILER_LEVEL':
      return { ...state, trailerLevel: action.data };
    case 'SET_ENERGY':
      return { ...state, energy: action.data };
    case 'SET_WATER':
      return { ...state, water: action.data };
    case 'SET_AIR_QUALITY':
      return { ...state, airQuality: action.data };
    case 'SET_TEMP_HUMID':
      return { ...state, tempHumid: action.data };
    case 'SET_GPS_LATLON':
      return { ...state, gpsLatLon: action.data };
    case 'SET_GPS_ALTITUDE':
      return { ...state, gpsAltitude: action.data };
    case 'SET_GNSS_DETAILS':
      return { ...state, gnssDetails: action.data };
    default:
      return state;
  }
}

// ── Context value ─────────────────────────────────────────────

type AppContextValue = {
  state: AppState;
  dispatch: React.Dispatch<Action>;

  // Convenience actions (call API + dispatch result)
  configure: (serverUrl: string, apiKey: string | null) => Promise<void>;
  toggleDarkMode: () => Promise<void>;
  loadAllData: () => Promise<void>;
  setThermostatTemp: (temp: number) => Promise<void>;
  toggleThermostat: () => Promise<void>;
  toggleLight: (light: Light) => Promise<void>;
  setLightBrightness: (light: Light, percent: number) => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// ── Provider ──────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const wsRef = useRef<ReturnType<typeof createWebSocket> | null>(null);

  // Helper: build API config from current state
  const apiCfg = useCallback(() => {
    if (!state.serverUrl) return null;
    return { baseUrl: state.serverUrl, apiKey: state.apiKey ?? undefined };
  }, [state.serverUrl, state.apiKey]);

  // ── Load stored config on mount ─────────────────────────────

  useEffect(() => {
    (async () => {
      const [serverUrl, apiKey, darkMode] = await Promise.all([
        storage.getServerUrl(),
        storage.getApiKey(),
        storage.getDarkMode(),
      ]);
      dispatch({ type: 'SET_DARK_MODE', enabled: darkMode });
      if (serverUrl) {
        dispatch({ type: 'SET_CONFIG', serverUrl, apiKey });
      }
      dispatch({ type: 'SET_INITIALIZED' });
    })();
  }, []);

  // ── Connect WebSocket when configured ───────────────────────

  useEffect(() => {
    if (!state.isConfigured || !state.serverUrl) return;

    const wsUrl = storage.toWebSocketUrl(state.serverUrl);

    const onEvent = (event: WsEvent) => {
      switch (event.type) {
        case 'thermostat':
          dispatch({ type: 'SET_THERMOSTAT', data: event.data });
          break;
        case 'light':
          dispatch({ type: 'UPDATE_LIGHT', data: event.data });
          break;
        case 'energy':
          dispatch({ type: 'SET_ENERGY', data: event.data });
          break;
        case 'water':
          dispatch({ type: 'SET_WATER', data: event.data });
          break;
        case 'airquality':
          dispatch({ type: 'SET_AIR_QUALITY', data: event.data });
          break;
        case 'temphumid':
          dispatch({ type: 'SET_TEMP_HUMID', data: event.data });
          dispatch({ type: 'SET_CURRENT_TEMP', temp: event.data.tempInF });
          break;
        case 'latlon':
          dispatch({ type: 'SET_GPS_LATLON', data: event.data });
          break;
        case 'alt':
          dispatch({ type: 'SET_GPS_ALTITUDE', data: event.data });
          break;
        case 'gnss_details':
          dispatch({ type: 'SET_GNSS_DETAILS', data: event.data });
          break;
        case 'level':
          dispatch({ type: 'SET_TRAILER_LEVEL', data: event.data });
          break;
      }
    };

    const onStatus = (connected: boolean) => {
      dispatch({ type: 'SET_CONNECTED', connected });
    };

    wsRef.current = createWebSocket(wsUrl, state.apiKey ?? undefined, onEvent, onStatus);
    wsRef.current.connect();

    return () => {
      wsRef.current?.destroy();
      wsRef.current = null;
    };
  }, [state.isConfigured, state.serverUrl, state.apiKey]);

  // ── Action: configure server ────────────────────────────────

  const configure = useCallback(
    async (serverUrl: string, apiKey: string | null) => {
      await storage.setServerUrl(serverUrl);
      if (apiKey) await storage.setApiKey(apiKey);
      dispatch({ type: 'SET_CONFIG', serverUrl, apiKey });
    },
    [],
  );

  // ── Action: toggle dark mode ────────────────────────────────

  const toggleDarkMode = useCallback(async () => {
    const next = !state.darkMode;
    await storage.setDarkMode(next);
    dispatch({ type: 'SET_DARK_MODE', enabled: next });
  }, [state.darkMode]);

  // ── Action: load all data from REST API ─────────────────────

  const loadAllData = useCallback(async () => {
    const cfg = apiCfg();
    if (!cfg) return;

    dispatch({ type: 'SET_LOADING', loading: true });
    dispatch({ type: 'SET_ERROR', error: null });

    const [therm, lights, level, energy, water, aq] = await Promise.all([
      api.getThermostat(cfg),
      api.getLights(cfg),
      api.getTrailerLevel(cfg),
      api.getEnergy(cfg),
      api.getWater(cfg),
      api.getAirQuality(cfg),
    ]);

    if (therm.ok) dispatch({ type: 'SET_THERMOSTAT', data: therm.data });
    if (lights.ok) dispatch({ type: 'SET_LIGHTS', data: lights.data });
    if (level.ok) dispatch({ type: 'SET_TRAILER_LEVEL', data: level.data });
    if (energy.ok) dispatch({ type: 'SET_ENERGY', data: energy.data });
    if (water.ok) dispatch({ type: 'SET_WATER', data: water.data });
    if (aq.ok) dispatch({ type: 'SET_AIR_QUALITY', data: aq.data });

    // Report first error encountered
    const firstError = [therm, lights, level, energy, water, aq].find((r) => !r.ok);
    if (firstError && !firstError.ok) {
      dispatch({ type: 'SET_ERROR', error: firstError.error });
    }

    dispatch({ type: 'SET_LOADING', loading: false });
  }, [apiCfg]);

  // ── Action: thermostat ──────────────────────────────────────

  const setThermostatTemp = useCallback(
    async (temp: number) => {
      const cfg = apiCfg();
      if (!cfg) return;
      await api.updateThermostat(cfg, { target_temp: temp, mode: 'auto' });
    },
    [apiCfg],
  );

  const toggleThermostat = useCallback(async () => {
    const cfg = apiCfg();
    if (!cfg) return;
    const newMode = state.thermostat?.mode === 'off' ? 'auto' : 'off';
    await api.updateThermostat(cfg, { mode: newMode });
  }, [apiCfg, state.thermostat?.mode]);

  // ── Action: lights ──────────────────────────────────────────

  const toggleLight = useCallback(
    async (light: Light) => {
      const cfg = apiCfg();
      if (!cfg) return;
      const newState = light.state === 1 ? 0 : 1;
      const result = await api.updateLight(cfg, light.id, {
        state: newState,
      });
      if (result.ok) dispatch({ type: 'UPDATE_LIGHT', data: result.data });
    },
    [apiCfg],
  );

  const setLightBrightness = useCallback(
    async (light: Light, percent: number) => {
      const cfg = apiCfg();
      if (!cfg) return;
      const s = percent > 0 ? 1 : 0;
      const brightness = percent > 0 ? Math.round((percent * 255) / 100) : undefined;
      const result = await api.updateLight(cfg, light.id, { state: s, brightness });
      if (result.ok) dispatch({ type: 'UPDATE_LIGHT', data: result.data });
    },
    [apiCfg],
  );

  // ── Provide ─────────────────────────────────────────────────

  const value: AppContextValue = {
    state,
    dispatch,
    configure,
    toggleDarkMode,
    loadAllData,
    setThermostatTemp,
    toggleThermostat,
    toggleLight,
    setLightBrightness,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
