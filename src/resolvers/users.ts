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
						code: 400,
						message: 'Email already exists',
						success: false,
					}
				}

				const user = await UsersModel.create(form)
				return {
					code: 200,
					message: 'User created',
					success: true,
					payload: user,
				}
			} catch (error) {
				console.log(error)
				return {
					code: 500,
					message: 'Internal Server Error',
					success: false,
				}
			}
		},
	},
}

export default userResolvers
