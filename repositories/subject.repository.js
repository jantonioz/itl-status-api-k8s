const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SubjectSchema = new Schema({
	clave: { type: String, unique: true },
	name: { type: String },
	career: { type: String, default: null },
})

module.exports = mongoose.model('Subject', SubjectSchema)