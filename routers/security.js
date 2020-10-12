const config = require('../config').server

class SecurityRouter {
	validateApiKey(req, res, next) {
		const apiKey = req.get(config.KeyName) || req.query[config.KeyName]
		if (apiKey && apiKey === config.KeyValue) {
			next()
		} else next({ status: 401, message: 'Unauthorized' })
	}
}

module.exports = new SecurityRouter()
