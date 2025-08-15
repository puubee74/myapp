import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const TOKEN_NAME = 'token'
const JWT_SECRET = process.env.JWT_SECRET!

export function signJwt(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyJwt<T = any>(token: string): T | null {
  try { return jwt.verify(token, JWT_SECRET) as T } catch { return null }
}

export async function setAuthCookie(token: string) {
  const jar = await cookies()
  jar.set(TOKEN_NAME, token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })
}

export async function getAuth() {
  const jar = await cookies()
  const c = jar.get(TOKEN_NAME)
  if (!c?.value) return null
  return verifyJwt<{ id: number; email: string }>(c.value)
}

export async function clearAuth() {
  const jar = await cookies()
  jar.set(TOKEN_NAME, '', { httpOnly: true, path: '/', maxAge: 0 })
}
