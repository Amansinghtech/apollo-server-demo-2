import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { defaultFieldResolver, GraphQLSchema } from 'graphql'

import { Context } from '../context'
import { tokenIsError } from '../controller/auth'
import UsersModel from '../models/UsersModel'

export function authDirectiveTransform(
	schema: GraphQLSchema,
	directiveName: string
) {
	return mapSchema(schema, {
		[MapperKind.OBJECT_FIELD]: (fieldConfig) => {
			const authDirective = getDirective(
				schema,
				fieldConfig,
				directiveName
			)?.[0]
			if (authDirective) {
				const { resolve = defaultFieldResolver } = fieldConfig

				// Replace the original resolver with a function that *first* calls
				// the original resolver, then converts its result to upper case
				fieldConfig.resolve = async function (
					source,
					args,
					context: Context,
					info
				) {
					if (tokenIsError(context.token)) {
						return {
							__typename: 'Unauthorized',
							message: context.token.name,
							code: 401,
						}
					}

					const user = await UsersModel.findOne({
						uid: context.token.uid,
					})

					if (!user) {
						return {
							__typename: 'NotFound',
							message: 'User not found',
							code: 404,
						}
					}

					context = { ...context, user }

					const result = await resolve(source, args, context, info)
					return result
				}
				return fieldConfig
			}
			return fieldConfig
		},
	})
}
