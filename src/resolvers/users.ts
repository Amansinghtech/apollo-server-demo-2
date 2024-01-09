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
	},
}

export default userResolvers
