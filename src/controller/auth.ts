import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { vars } from '../env'

export function createAccessToken(email: string, uid: string) {
	const iat = Math.floor(Date.now() / 1000)

	const token = jwt.sign({ uid, email, iat }, vars.ACCESS_TOKEN_SECRET, {
		expiresIn: vars.AT_EXPIRY,
	})

	return { token, iat }
}

export function createRefreshToken(email: string, uid: string) {
	const iat = Math.floor(Date.now() / 1000)

	const token = jwt.sign({ uid, email, iat }, vars.REFRESH_TOKEN_SECRET, {
		expiresIn: vars.RT_EXPIRY,
	})

	return { token, iat }
}
