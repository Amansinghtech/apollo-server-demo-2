import { Resolvers } from '@graphql'

const postResolvers: Resolvers = {
	Mutation: {
		createPost: async (_, args, context) => {
			console.log('context', context.user?.name)

			return {
				__typename: 'Post',
				title: args.form.title,
				content: args.form.content,
				id: '123',
			}
		},
	},
}

export default postResolvers
