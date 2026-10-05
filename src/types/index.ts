export interface Registrant {
  id: string;
  name: string;
  phone: string;
  email: string;
  college_id: number | null;
  college_other: string | null;
  branch: string;
  grad_year: number;
  slot: string;
  consent: boolean;
  ref_code: string;
  referred_by_code: string | null;
  champion_code: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  device: string | null;
  created_at: string;
}

export interface College {
  id: number;
  name: string;
  city: string;
  state: string;
}

export interface Champion {
  id: string;
  name: string;
  college_id: number | null;
  code: string;
  created_at: string;
}

export interface AnalyticsEvent {
  id?: string;
  session_id: string;
  type: 'page_view' | 'form_start' | 'step_1_complete' | 'step_2_complete' | 'step_3_complete' | 'register_success' | 'share_click' | 'match_complete';
  step?: number;
  meta?: Record<string, unknown>;
  created_at?: string;
}

export interface Referral {
  id?: string;
  referrer_id: string;
  referred_id: string;
  created_at?: string;
}

export interface RegisterFormData {
  // Step 1
  name: string;
  phone: string;
  // Step 2
  college_id: number | null;
  college_other: string;
  branch: string;
  grad_year: number;
  // Step 3
  email: string;
  slot: string;
  consent: boolean;
  // Tracking
  ref?: string;
  champion?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  device?: string;
  // Honeypot
  website?: string;
  // Matcher linking
  session_id?: string;
}

export interface RegisterResponse {
  success: boolean;
  ref_code?: string;
  duplicate?: boolean;
  message?: string;
  errors?: Record<string, string>;
}

export interface StatsResponse {
  count: number;
  college_count: number;
}

export interface TrackingParams {
  ref?: string;
  champion?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  device?: string;
}

export interface RewardTier {
  threshold: number;
  name: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SlotOption {
  value: string;
  label: string;
}
