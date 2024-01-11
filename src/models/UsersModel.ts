import mongoose, { Schema, Document } from 'mongoose'
import { Gender } from '../generated/graphql'
import { v4 } from 'uuid'
import argon2 from 'argon2'

export interface UserDocument extends Document {
	uid: string
	name: string
	email: string
	password: string
	lastLogin: Date
	age: number
	gender: Gender
	refreshToken: string
}

interface Methods {
	comparePassword: (password: string) => Promise<boolean>
}

const userSchema = new Schema<UserDocument, unknown, Methods>({
	uid: { type: String, required: true, unique: true, default: v4 },
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	lastLogin: { type: Date, required: true, default: Date.now },
	age: { type: Number },
	gender: { type: String, enum: Object.values(Gender) },
	refreshToken: { type: String },
})

// hash password before saving
userSchema.pre<UserDocument>('save', async function (next) {
	if (!this.isModified('password')) next()
	this.password = await argon2.hash(this.password)
	next()
})

userSchema.methods.comparePassword = async function (password) {
	if (!this.password) return false
	return await argon2.verify(this.password, password)
}

export default mongoose.model('users', userSchema)
