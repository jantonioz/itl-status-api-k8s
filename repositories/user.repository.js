const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
	email: { type: String, unique: true },
	username: { type: String, unique: true },
	publicKey: { type: String },
	sessionId: { type: String, default: null, unique: true },
	password: { type: String, select: false },
	controlNum: {
		type: String,
		index: {
			unique: true,
			partialFilterExpression: { controlNum: { $type: 'string' } },
		},
		default: null,
		select: false,
	},
	privateKey: { type: String, select: false },
	controlPwd: { type: String, default: null, select: false },
	active: { type: Boolean, default: true, select: false },
})

const User = mongoose.model('User', UserSchema)

module.exports = User
