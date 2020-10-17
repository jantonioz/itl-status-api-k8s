const mongoose = require('mongoose')
const cred = require('../config').database

async function connect() {
	const str = `mongodb://${cred.username}:${cred.password}@${cred.host}:${cred.port}/${cred.name}?authSource=admin`
	return mongoose.connect(str, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
}

module.exports = connect
