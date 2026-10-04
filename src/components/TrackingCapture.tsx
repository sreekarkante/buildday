'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { TrackingParams } from '@/types';

const STORAGE_KEY = 'buildday_tracking';

const TRACKED_PARAMS = [
  'ref',
  'champion',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
] as const;

function detectDevice(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android.*mobile|windows.*phone|blackberry/i.test(ua))
    return 'mobile';
  return 'desktop';
}

export default function TrackingCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Read existing tracking from sessionStorage
    let existing: TrackingParams = {};
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) existing = JSON.parse(raw);
    } catch {
      // ignore parse errors
    }

    // Merge URL params — only overwrite if the URL supplies a non-empty value
    let updated = false;
    const merged: TrackingParams = { ...existing };

    for (const param of TRACKED_PARAMS) {
      const value = searchParams.get(param);
      if (value && value.trim()) {
        (merged as Record<string, string>)[param] = value.trim();
        updated = true;
      }
    }

    // Always capture device if missing
    if (!merged.device) {
      merged.device = detectDevice();
      updated = true;
    }

    if (updated) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {
        // sessionStorage full or unavailable
      }
    }
  }, [searchParams]);

  return null; // invisible component
}

/**
 * Helper to read tracking params from sessionStorage.
 * Call this from client components before submitting the registration form.
 */
export function getTrackingParams(): TrackingParams {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
}
