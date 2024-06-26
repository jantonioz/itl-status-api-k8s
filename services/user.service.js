const UserRepository = require('../repositories/user.repository.js')
const StatusService = require('./status.service')
const { keyPairGenerator } = require('./cypher')
const CloudService = require('./cloud.service')
const cypher = require('./cypher')
const uuid = require('uuid').v4

class UserService {
	async get(user) {
		return UserRepository.find({ ...user, active: true })
	}

	async login(user) {
		const userExists = await UserRepository.findOne({
			active: true,
			$or: [{ email: user.login }, { username: user.login }],
		})
			.select('+password')
			.exec()
		if (!userExists) throw { code: 401, message: 'Invalid credentials' }

		const correctPassword = await cypher.bCompare(
			user.password,
			userExists.password
		)

		if (!correctPassword) throw { code: 401, message: 'Invalid credentials' }
		const sessionId = uuid()
		userExists.sessionId = sessionId
		userExists.lastLogin = new Date().toISOString()

		await userExists.save()
		return UserRepository.findOne({ _id: userExists._id }).lean().exec()
		// return { ...userExists, __v: undefined, password: undefined }
	}

	async create(user) {
		const userExists = await UserRepository.findOne({
			$or: [{ username: user.username }, { email: user.email }],
		}).exec()
		if (userExists) throw { code: 401, message: 'User already exists' }

		const keys = await keyPairGenerator()
		user.password = await cypher.bCrypt(user.password)
		const sessionId = uuid()
		const { _id } = await UserRepository.create({ ...user, ...keys, sessionId })
		return UserRepository.findOne({ _id: _id })
	}

	async update(user) {
		const userExists = await UserRepository.findOne({
			$or: [{ _id: user.id }, { sessionId: user.sessionId }],
		}).exec()
		if (!userExists) throw { code: 401, message: 'Invalid credentials' }

		await UserRepository.updateOne({ _id: user.id }, { $set: user })
		await this.updateStatus(user)
		return UserRepository.findOne({ _id: user.id })
	}

	async getStatus(user) {
		const userExists = await UserRepository.findOne({
			/* $or: [{ _id: user.id }, { */ sessionId: user.sessionId /* }], */
		}).exec()
		if (!userExists) throw { code: 401, message: 'Invalid credentials' }
		const kardex = await StatusService.getKardex(userExists)
		const carga = await StatusService.getCarga(userExists)
		return { kardex, carga }
	}

	async updateStatus(user) {
		const userExists = await UserRepository.findOne({
			/* $or: [{ _id: user.id }, { */ sessionId: user.sessionId /* }], */
		})
			.select('+controlNum +controlPwd +privateKey')
			.exec()
		if (!userExists) throw { code: 401, message: 'Invalid credentials' }

		const credentials = await cypher.decryptCredentials(userExists)
		const [a, b] = await CloudService.getAll(credentials)

		const kardex = await StatusService.createKardexFromList(a.kardex, { ...user, id: userExists._id })
		const carga = await StatusService.createCargaFromList(b.carga, { ...user, id: userExists._id })
		return { kardex, carga }
	}

	async delete(user) {
		await this.update({ ...user, active: false })
		return UserRepository.find({ ...user, active: false })
	}
}

module.exports = new UserService()
