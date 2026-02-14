/**
 * TypeScript interfaces mirroring the Android app's Models.kt.
 * Field names use camelCase locally but match the API's snake_case via mapping in api.ts.
 */

// ── Thermostat ────────────────────────────────────────────────

export type ThermostatMode = 'heat' | 'cool' | 'auto' | 'off';

export interface ThermostatState {
  targetTemp: number;
  mode: ThermostatMode;
}

export interface ThermostatResponse {
  success: boolean;
  targetTemp: number;
  mode: string;
}

// ── Lights ────────────────────────────────────────────────────

export interface Light {
  id: number;
  _id?: string;
  name?: string;
  state: number; // 0 or 1
  brightness: number; // 0-100
  updated_at?: string;
}

export interface LightUpdateRequest {
  state: number;
  brightness?: number;
}

// ── Trailer Level ─────────────────────────────────────────────

export interface TrailerLevel {
  _id?: string;
  frontBack: number; // degrees
  sideToSide: number; // degrees
  updated_at?: string;
}

// ── Energy ────────────────────────────────────────────────────

export type ChargeType = 'float' | 'bulk' | 'absorption' | 'equalize';

export interface EnergyState {
  solarWatts: number;
  batteryPercent: number;
  batteryVoltage: number;
  chargeType: ChargeType;
  timeRemainingMinutes: number | null;
}

// ── Water ─────────────────────────────────────────────────────

export interface WaterState {
  fresh: number; // 0-100
  grey: number; // 0-100
  black: number; // 0-100
  updated_at?: string;
}

// ── Air Quality ───────────────────────────────────────────────

export interface AirQualityState {
  iaqIndex: number;
  co2Ppm: number;
}

export interface TempHumidState {
  tempInC: number;
  tempInF: number;
  humidity: number;
}

// ── GPS ───────────────────────────────────────────────────────

export interface GpsLatLon {
  latitude: number;
  longitude: number;
}

export interface GpsAltitude {
  altitudeInMeters: number;
  altitudeFeet: number;
}

export interface GnssDetails {
  numberOfSatellites: number;
  speedOverGround: number;
  courseOverGround: number;
  gnssMode?: number;
}

// ── Settings ──────────────────────────────────────────────────

export interface AppSettings {
  _id?: string;
  theme: string;
  timezone: string;
  clockFormat: string;
  availableTimezones?: string[];
  updated_at?: string;
}

// ── Health ────────────────────────────────────────────────────

export interface HealthResponse {
  status: string;
  timestamp: string;
}

// ── WebSocket ─────────────────────────────────────────────────

export type WebSocketEventType =
  | 'thermostat'
  | 'light'
  | 'energy'
  | 'water'
  | 'airquality'
  | 'temphumid'
  | 'latlon'
  | 'alt'
  | 'gnss_details'
  | 'level';

export interface WebSocketMessage {
  type: WebSocketEventType;
  data: unknown;
  timestamp?: string;
}

// ── API Result ────────────────────────────────────────────────

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
