import { UserExists as TUserExists } from '../../generated/graphql'
import { CustomError } from './ErrorHandler'

export class UserExistsError extends CustomError {
	public declare name: TUserExists['__typename']

	constructor(message: string, email: string) {
		super(message)
		this.name = 'UserExists'
		this.object = { email, message }
	}
}
