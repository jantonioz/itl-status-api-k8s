const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
	email: { type: String, unique: true },
	username: { type: String, unique: true },
	publicKey: { type: String, unique: true },
	sessionId: { type: String, default: null },
	password: { type: String, select: false },
	controlNum: { type: String, default: null, select: false },
	privateKey: { type: String, unique: true, select: false },
	controlPwd: { type: String, default: null, select: false },
	active: { type: Boolean, default: true, select: false },
})

const User = mongoose.model('User', UserSchema)

module.exports = User
