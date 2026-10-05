import crypto from 'crypto';

function toBase64Url(str: string | Buffer): string {
  const base64 = Buffer.isBuffer(str) ? str.toString('base64') : Buffer.from(str).toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function signAdminToken(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return null;

  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 8 * 60 * 60; // 8 hours
  const payload = JSON.stringify({ iat, exp });
  
  const encodedPayload = toBase64Url(payload);
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(encodedPayload);
  const signature = toBase64Url(hmac.digest());
  
  return `${encodedPayload}.${signature}`;
}

export function verifyAdminToken(token: string | null | undefined): boolean {
  if (!token) return false;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [encodedPayload, providedSignature] = parts;

  let payload;
  try {
    const jsonStr = Buffer.from(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
    payload = JSON.parse(jsonStr);
  } catch {
    return false;
  }

  if (!payload || typeof payload.exp !== 'number') return false;
  const now = Math.floor(Date.now() / 1000);
  if (now > payload.exp) return false;

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(encodedPayload);
  const expectedSignature = toBase64Url(hmac.digest());

  const providedBuf = Buffer.from(providedSignature);
  const expectedBuf = Buffer.from(expectedSignature);

  if (providedBuf.length !== expectedBuf.length) return false;

  try {
    return crypto.timingSafeEqual(providedBuf, expectedBuf);
  } catch {
    return false;
  }
}
