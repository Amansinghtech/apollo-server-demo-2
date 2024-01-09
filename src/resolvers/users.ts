import { Resolvers } from '@graphql'

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
}

export default userResolvers
