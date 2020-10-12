const axios = require('axios')
const crypto = require('./cypher')
const urls = require('../config').cloud

class CloudService {
	async getKardex({ control, password }) {
		const { data } = await axios.post(urls.kardexUrl, { control, password })
		return data
	}

	async getCarga({ control, password }) {
		const { data } = await axios.post(urls.cargaUrl, { control, password })
		return data
	}

	async getAll(credentials) {
		return Promise.all([
			this.getKardex(credentials),
			this.getCarga(credentials),
		])
	}
}

module.exports = new CloudService()
