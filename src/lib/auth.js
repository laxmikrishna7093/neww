import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error('❌ JWT_SECRET is not defined in .env.local — please add it and restart the server.');
}

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '1d' });
}

export function verifyToken(token) {
  try {
    if (!token) return null;
    return jwt.verify(token, SECRET);
  } catch (err) {
    console.error('verifyToken failed:', err.message);
    return null;
  }
}