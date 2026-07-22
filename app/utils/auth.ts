import crypto from 'crypto';

const SECRET = process.env.SESSION_SECRET || 'a-very-secure-fallback-secret-for-session-tokens-12345';

/**
 * Hash password using scrypt sync
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

/**
 * Verify password with scrypt sync, with fallback to legacy SHA-256
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    if (storedHash.startsWith('scrypt$')) {
      const parts = storedHash.split('$');
      if (parts.length !== 3) return false;
      const [, salt, hash] = parts;
      const calculatedHash = crypto.scryptSync(password, salt, 64).toString('hex');
      return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(calculatedHash, 'hex'));
    }

    // Legacy fallback for plain SHA-256
    const legacyHash = crypto.createHash('sha256').update(password).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(storedHash, 'hex'), Buffer.from(legacyHash, 'hex'));
  } catch (e) {
    console.error('Password verification error:', e);
    return false;
  }
}

/**
 * Helper to encode string to base64url
 */
function base64urlEncode(str: string): string {
  return Buffer.from(str, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Helper to decode base64url string
 */
function base64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Create a signed session token
 */
export function signSession(username: string): string {
  const payload = JSON.stringify({
    username,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });
  
  const payloadB64 = base64urlEncode(payload);
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(payloadB64)
    .digest('base64url');
    
  return `${payloadB64}.${signature}`;
}

/**
 * Verify signed session token signature and expiration
 */
export function verifySession(token: string | undefined): boolean {
  if (!token) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    
    const [payloadB64, signature] = parts;
    
    const expectedSignature = crypto
      .createHmac('sha256', SECRET)
      .update(payloadB64)
      .digest('base64url');
      
    if (signature !== expectedSignature) return false;
    
    const payloadStr = base64urlDecode(payloadB64);
    const payload = JSON.parse(payloadStr);
    
    if (payload.expiresAt < Date.now()) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}
