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

export type TokenData = {
	iat: number
	uid: string
	email: string
	exp: number
}

export type TokenError = {
	name: 'TokenExpiredError' | 'JsonWebTokenError' | 'NotBeforeError'
}

export function tokenIsError(
	token: TokenData | TokenError
): token is TokenError {
	return (token as TokenError).name !== undefined
}

export function verifyAccessToken(token: string): TokenData | TokenError {
	try {
		const decoded = jwt.verify(token, vars.ACCESS_TOKEN_SECRET)
		return decoded as TokenData
	} catch (error) {
		if (error.name == 'JsonWebTokenError') {
			return {
				name: 'JsonWebTokenError',
			} as TokenError
		} else if (error.name == 'TokenExpiredError') {
			return {
				name: 'TokenExpiredError',
			} as TokenError
		} else if (error.name == 'NotBeforeError') {
			return {
				name: 'NotBeforeError',
			} as TokenError
		} else {
			return {
				name: 'JsonWebTokenError',
			} as TokenError
		}
	}
}

export function verifyRefreshToken(token: string) {
	try {
		const decoded = jwt.verify(token, vars.REFRESH_TOKEN_SECRET)
		return decoded
	} catch (error) {
		return null
	}
}
