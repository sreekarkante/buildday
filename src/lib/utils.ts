const REF_CHARSET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

export function generateRefCode(): string {
  const chars: string[] = [];
  const array = new Uint8Array(6);
  crypto.getRandomValues(array);
  for (let i = 0; i < 6; i++) {
    chars.push(REF_CHARSET[array[i] % REF_CHARSET.length]);
  }
  return chars.join('');
}

export function normalizePhone(phone: string): string {
  // Strip everything except digits
  let digits = phone.replace(/[^0-9]/g, '');
  // Remove leading 91 country code if present (12 digits starting with 91)
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  }
  // Remove leading 0 if present (11 digits starting with 0)
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  return digits;
}

export function validatePhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return /^[6-9]\d{9}$/.test(normalized);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getDeviceType(userAgent: string): string {
  if (!userAgent) return 'unknown';
  const ua = userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android.*mobile|windows.*phone|blackberry/i.test(ua)) return 'mobile';
  return 'desktop';
}

export function generateSessionId(): string {
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}
