import { TokenResult } from './controller/auth'
import { UserDocument } from './models/UsersModel'

export interface Context {
	authorization?: string
	user?: UserDocument
	token: TokenResult
}
