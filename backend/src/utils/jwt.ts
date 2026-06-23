import jwt from 'jsonwebtoken'
import { env } from '@/config/environment'
import { JwtPayload } from '@/types'

type ExpiresIn = jwt.SignOptions['expiresIn']

function safeExpiresIn(value: string, fallback: string): ExpiresIn {
  const v = value?.trim()
  if (!v || v === 'undefined' || v === 'null') return fallback as ExpiresIn
  return v as ExpiresIn
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: safeExpiresIn(env.jwtExpiresIn, '7d'),
  })
}

export const signRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: safeExpiresIn(env.jwtRefreshExpiresIn, '30d'),
  })
}

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtSecret) as JwtPayload
}

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtRefreshSecret) as JwtPayload
}
