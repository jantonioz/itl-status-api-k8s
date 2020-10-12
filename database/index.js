const mongoose = require('mongoose')
const cred = require('../config').database

async function connect() {
	const connection = await mongoose.connect(
		`mongodb://localhost:27017/${cred.name}`,
		{ useNewUrlParser: true, useUnifiedTopology: true }
  )
  return connection
}

module.exports = connect