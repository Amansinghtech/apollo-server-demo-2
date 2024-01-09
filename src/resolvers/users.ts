import { Resolvers } from '@graphql'
import UsersModel from '../models/UsersModel'

const userResolvers: Resolvers = {
	Query: {
		getUser: async () => {
			return {
				name: 'John',
				email: 'John@example.com',
				age: 20,
				lastLogin: new Date(),
			}
		},
	},

	Mutation: {
		createUser: async (_, { form }) => {
			try {
				if (form.password.length < 8) {
					return {
						__typename: 'BadUserInput',
						message: 'Password must be at least 8 characters',
						code: 400,
					}
				}

				const userExists = await UsersModel.exists({
					email: form.email,
				})

				if (userExists) {
					return {
						__typename: 'UserExists',
						message: 'User already exists',
						email: form.email,
					}
				}

				const user = await UsersModel.create(form)
				return {
					__typename: 'User',
					...user.toObject(),
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

				return {
					__typename: 'User',
					...user.toObject(),
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
