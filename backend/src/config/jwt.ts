import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const JWT_EXPIRE_RAW = process.env.JWT_EXPIRE || '7d';

/**
 * التحقق من صحة JWT_EXPIRE
 * يجب أن تكون إما:
 * - رقم (عدد الثواني)
 * - string بصيغة صحيحة (مثل '7d', '24h', '60', إلخ)
 */
function validateJWTExpire(value: string): string | number {
  // التحقق إذا كانت رقماً
  if (!isNaN(Number(value))) {
    const numValue = Number(value);
    if (numValue > 0) {
      return numValue;
    }
    throw new Error('JWT_EXPIRE number must be greater than 0');
  }

  // التحقق من صيغة string المعروفة
  const validTimeFormats = /^(\d+)([smhd])$/;
  if (validTimeFormats.test(value)) {
    return value;
  }

  throw new Error(
    `JWT_EXPIRE has invalid format: "${value}". Expected format: number (seconds) or string like "7d", "24h", "60", etc.`
  );
}

const JWT_EXPIRE = validateJWTExpire(JWT_EXPIRE_RAW);

export interface TokenPayload {
  userId: number;
  username: string;
  role: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(
    payload,
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE } as jwt.SignOptions
  );
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
