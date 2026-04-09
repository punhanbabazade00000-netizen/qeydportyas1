/**
 * api.ts — Frontend API servis qatı
 * Bütün backend sorğuları bu fayldan keçir.
 * Vite proxy: /api → http://localhost:4000
 */

import type { Building } from '../types';

const BASE = '/api';

/** Bütün binaları, xəstəxana və polis bölmələrini gətirir */
export async function fetchBuildings(): Promise<Building[]> {
  const res = await fetch(`${BASE}/properties`);
  if (!res.ok) throw new Error(`fetchBuildings: ${res.status} ${res.statusText}`);
  return res.json();
}

/** Bir binanı id-si ilə gətirir (xidmətlər — polis/xəstəxana — daxil) */
export async function fetchBuilding(
  registryId: string
): Promise<{ building: Building; services: { police: any; hospital: any } }> {
  const res = await fetch(`${BASE}/property/${encodeURIComponent(registryId)}`);
  if (!res.ok) throw new Error(`fetchBuilding: ${res.status} ${res.statusText}`);
  return res.json();
}
