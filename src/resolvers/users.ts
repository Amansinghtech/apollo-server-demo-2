import { Resolvers } from '@graphql'
import UsersModel from '../models/UsersModel'
import { BadUserInputError, ErrorHandler } from '../helpers/errors/ErrorHandler'
import { UserExistsError } from '../helpers/errors/Users'
import {
	createAccessToken,
	createRefreshToken,
	verifyAccessToken,
	TokenError,
	tokenIsError,
} from '../controller/auth'

const userResolvers: Resolvers = {
	Query: {
		getUser: async (_, __, context) => {
			return {
				__typename: 'User',
				...(context.user.toObject() as any),
			}
		},
	},

	Mutation: {
		createUser: async (_, { form }) => {
			try {
				if (form.password.length < 8) {
					throw new BadUserInputError('Password is too short')
				}
				const userExists = await UsersModel.exists({
					email: form.email,
				})

				if (userExists) {
					throw new UserExistsError('User already exists', form.email)
					// return {
					// 	__typename: 'UserExists',
					// 	message: 'User already exists',
					// 	email: form.email,
					// }
				}

				const user = await UsersModel.create(form)
				return {
					__typename: 'User',
					...user.toObject(),
				}
			} catch (error) {
				return ErrorHandler.handle(error)
			}
		},
		loginUser: async (_, { email, password }) => {
			try {
				const user = await UsersModel.findOne({ email })

				if (!user) {
					return {
						__typename: 'NotFound',
						message: 'User not found',
						code: 404,
					}
				}

				let passwordMatch = await user.comparePassword(password)

				if (!passwordMatch) {
					return {
						__typename: 'BadUserInput',
						message: 'Invalid Creadentials',
						code: 400,
					}
				}

				/* create access token and refresh token */

				const AT = createAccessToken(user.email, user.uid)
				const RT = createRefreshToken(user.email, user.uid)

				/* Update refresh token */
				user.refreshToken = RT.token

				/* Update last login */
				user.lastLogin = new Date()
				await user.save()

				return {
					__typename: 'LoginUserData',
					accessToken: AT.token,
					refreshToken: RT.token,
					user,
				}
			} catch (error) {
				console.log(error)
				return {
					__typename: 'InternalServerError',
					message: 'Internal server error',
					code: 500,
				}
			}
		},
	},
}

export default userResolvers
