/**
 * WebSocket client with auto-reconnect.
 * Mirrors the Android app's WebSocketService.kt.
 *
 * Usage:
 *   const ws = createWebSocket(url, apiKey, onEvent, onStatusChange);
 *   ws.connect();
 *   // later…
 *   ws.disconnect();
 */

import {
  ThermostatState,
  Light,
  EnergyState,
  WaterState,
  AirQualityState,
  TempHumidState,
  GpsLatLon,
  GpsAltitude,
  GnssDetails,
  TrailerLevel,
} from '../types';

// ── Event types ───────────────────────────────────────────────

export type WsEvent =
  | { type: 'thermostat'; data: ThermostatState }
  | { type: 'light'; data: Light }
  | { type: 'energy'; data: EnergyState }
  | { type: 'water'; data: WaterState }
  | { type: 'airquality'; data: AirQualityState }
  | { type: 'temphumid'; data: TempHumidState }
  | { type: 'latlon'; data: GpsLatLon }
  | { type: 'alt'; data: GpsAltitude }
  | { type: 'gnss_details'; data: GnssDetails }
  | { type: 'level'; data: TrailerLevel };

// ── Constants ─────────────────────────────────────────────────

const MAX_RECONNECT_ATTEMPTS = 10;
const INITIAL_DELAY_MS = 1000;
const MAX_DELAY_MS = 30000;

// ── Factory ───────────────────────────────────────────────────

export function createWebSocket(
  url: string,
  apiKey: string | undefined,
  onEvent: (event: WsEvent) => void,
  onStatusChange: (connected: boolean) => void,
) {
  let ws: WebSocket | null = null;
  let reconnectAttempts = 0;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let disposed = false;

  function connect() {
    if (disposed) return;
    disconnect();

    ws = new WebSocket(url, undefined);

    ws.onopen = () => {
      reconnectAttempts = 0;
      onStatusChange(true);
    };

    ws.onmessage = (e: MessageEvent) => {
      try {
        const msg = JSON.parse(e.data as string);
        const { type, data } = msg;
        if (type && data) {
          onEvent({ type, data } as WsEvent);
        }
      } catch {
        // ignore malformed messages
      }
    };

    ws.onclose = () => {
      onStatusChange(false);
      scheduleReconnect();
    };

    ws.onerror = () => {
      onStatusChange(false);
      // onclose will fire after onerror, which triggers reconnect
    };
  }

  function scheduleReconnect() {
    if (disposed || reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) return;

    const delay = Math.min(
      INITIAL_DELAY_MS * Math.pow(2, reconnectAttempts),
      MAX_DELAY_MS,
    );
    reconnectAttempts++;

    reconnectTimer = setTimeout(() => {
      connect();
    }, delay);
  }

  function disconnect() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (ws) {
      ws.onopen = null;
      ws.onmessage = null;
      ws.onclose = null;
      ws.onerror = null;
      ws.close(1000, 'Client disconnect');
      ws = null;
    }
  }

  function destroy() {
    disposed = true;
    disconnect();
  }

  return { connect, disconnect, destroy };
}
