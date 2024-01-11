export const vars = {
	MONOGO_URI: process.env.MONGO_URI!,
	PORT: parseInt(process.env.PORT) || 4001,
	ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET! || 'thisisasecret',
	REFRESH_TOKEN_SECRET:
		process.env.REFRESH_TOKEN_SECRET! || 'thisissupersecret',
	AT_EXPIRY: process.env.AT_EXPIRY! || '1d',
	RT_EXPIRY: process.env.RT_EXPIRY! || '7d',
}
