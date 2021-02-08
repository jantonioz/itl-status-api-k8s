const mongoose = require('mongoose')
const Schema = mongoose.Schema

const KardexSchema = new Schema({
	subject: { type: mongoose.Types.ObjectId, ref: 'Subject' },
	grade: { type: Number },
	semester: { type: Number },
	date: { type: String },
	user: { type: mongoose.Types.ObjectId, ref: 'User' },
})

module.exports = mongoose.model('Kardex', KardexSchema)
