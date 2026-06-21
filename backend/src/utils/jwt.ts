import jwt from 'jsonwebtoken'
import { env } from '@/config/environment'
import { JwtPayload } from '@/types'

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  })
}

export const signRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn as jwt.SignOptions['expiresIn'],
  })
}

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtSecret) as JwtPayload
}

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtRefreshSecret) as JwtPayload
}