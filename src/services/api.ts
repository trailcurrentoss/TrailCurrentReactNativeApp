/**
 * REST API client using fetch.
 * Mirrors the Android app's ApiService.kt endpoints.
 *
 * All functions accept the base URL and API key so they stay pure —
 * the calling code (AppContext) provides these from storage.
 */

import {
  ApiResult,
  ThermostatState,
  ThermostatResponse,
  Light,
  LightUpdateRequest,
  TrailerLevel,
  EnergyState,
  WaterState,
  AirQualityState,
  AppSettings,
  HealthResponse,
} from '../types';

// ── Helpers ───────────────────────────────────────────────────

type RequestConfig = {
  baseUrl: string;
  apiKey?: string;
};

function headers(apiKey?: string): HeadersInit {
  const h: HeadersInit = { 'Content-Type': 'application/json' };
  if (apiKey) h['Authorization'] = apiKey;
  return h;
}

async function request<T>(
  config: RequestConfig,
  path: string,
  options?: RequestInit,
): Promise<ApiResult<T>> {
  try {
    const url = `${config.baseUrl.replace(/\/+$/, '')}/${path}`;
    const res = await fetch(url, {
      ...options,
      headers: headers(config.apiKey),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => 'Request failed');
      return { ok: false, error: text };
    }
    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Network error';
    return { ok: false, error: message };
  }
}

// ── Thermostat ────────────────────────────────────────────────

export function getThermostat(cfg: RequestConfig) {
  return request<ThermostatState>(cfg, 'api/thermostat');
}

export function updateThermostat(
  cfg: RequestConfig,
  body: { target_temp?: number; mode?: string },
) {
  return request<ThermostatResponse>(cfg, 'api/thermostat', {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

// ── Lights ────────────────────────────────────────────────────

export function getLights(cfg: RequestConfig) {
  return request<Light[]>(cfg, 'api/lights');
}

export function updateLight(
  cfg: RequestConfig,
  id: number,
  body: LightUpdateRequest,
) {
  return request<Light>(cfg, `api/lights/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

// ── Trailer Level ─────────────────────────────────────────────

export function getTrailerLevel(cfg: RequestConfig) {
  return request<TrailerLevel>(cfg, 'api/trailer/level');
}

// ── Energy ────────────────────────────────────────────────────

export function getEnergy(cfg: RequestConfig) {
  return request<EnergyState>(cfg, 'api/energy');
}

// ── Water ─────────────────────────────────────────────────────

export function getWater(cfg: RequestConfig) {
  return request<WaterState>(cfg, 'api/water');
}

// ── Air Quality ───────────────────────────────────────────────

export function getAirQuality(cfg: RequestConfig) {
  return request<AirQualityState>(cfg, 'api/airquality');
}

// ── Settings ──────────────────────────────────────────────────

export function getSettings(cfg: RequestConfig) {
  return request<AppSettings>(cfg, 'api/settings');
}

export function updateSettings(
  cfg: RequestConfig,
  body: { theme?: string; timezone?: string; clock_format?: string },
) {
  return request<AppSettings>(cfg, 'api/settings', {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

// ── Health ────────────────────────────────────────────────────

export function healthCheck(cfg: RequestConfig) {
  return request<HealthResponse>(cfg, 'api/health');
}
