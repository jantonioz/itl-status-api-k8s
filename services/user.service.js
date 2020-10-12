const UserRepository = require('../repositories/user.repository.js')
const StatusService = require('./status.service')
const { keyPairGenerator } = require('./cypher')
const CloudService = require('./cloud.service')
const cypher = require('./cypher')

class UserService {
	async get(user) {
		return UserRepository.find({ ...user, active: true })
	}

	async create(user) {
		const keys = await keyPairGenerator()
		await UserRepository.create({ ...user, ...keys })
		return this.get(user)
	}

	async update(user) {
		await UserRepository.updateOne({ _id: user.id }, { $set: user })
		return UserRepository.findOne({ _id: user.id })
	}

	async getStatus(user) {
		const kardex = await StatusService.getKardex(user)
		const carga = await StatusService.getCarga(user)
		return { kardex, carga }
	}

	async updateStatus(user) {
		const userPK = await UserRepository.findOneAndUpdate(
			{ _id: user.id },
			{ $set: user }
		).select('+privateKey').exec()

		const credentials = cypher.decryptCredentials(userPK, user)
		const [a, b] = await CloudService.getAll(credentials)

		const kardex = await StatusService.createKardexFromList(a.kardex, user)
		const carga = await StatusService.createCargaFromList(b.carga, user)
		return { kardex, carga }
	}

	async delete(user) {
		await this.update({ ...user, active: false })
		return UserRepository.find({ ...user, active: false })
	}
}

module.exports = new UserService()
