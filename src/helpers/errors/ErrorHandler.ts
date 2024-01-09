import { logger } from '../logger'

import {
	NotFound as TNotFoundError,
	BadUserInput as TBadUserInput,
	InternalServerError as TInternalServerError,
	UserExists as TUserExists,
} from '../../generated/graphql'

class BaseError extends Error {
	public message: string
	public name: string
	public code: number
}

export class CustomError extends Error {
	public name: string
	public object: Object
}

export class NotFoundError extends BaseError {
	public declare name: TNotFoundError['__typename']

	constructor(message: string) {
		super(message)
		this.name = 'NotFound'
		this.message = message
		this.code = 404
	}
}

export class InternalServerError extends BaseError {
	public declare name: TInternalServerError['__typename']

	constructor(message: string) {
		super(message)
		this.name = 'InternalServerError'
		this.message = message
		this.code = 500
	}
}

export class BadUserInputError extends BaseError {
	public declare name: TBadUserInput['__typename']

	constructor(message: string) {
		super(message)
		this.name = 'BadUserInput'
		this.message = message
		this.code = 400
	}
}

export class ErrorHandler {
	public static async handle<T>(error: Error, message?: string): Promise<T> {
		if (error instanceof BaseError) {
			logger.warn(error.message)
			return {
				__typename: error.name,
				message: error.message,
				code: error.code,
			} as T
		}

		if (error instanceof CustomError) {
			logger.warn(error.name, error)
			return {
				__typename: error.name,
				...error.object,
			} as T
		}

		logger.error(error.name, error)
		return {
			__typename:
				'InternalServerError' satisfies TInternalServerError['__typename'],
			message: message || 'Internal Server Error',
			code: 500,
		} as T
	}
}
