const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GroupSchema = new Schema({
	group: { type: String },
	subject: { type: mongoose.Types.ObjectId, ref: 'Subject' },
	professor: { type: String },
	students: [{ type: mongoose.Types.ObjectId, ref: 'User', select: false }],
	schedule: { type: Object },
})

module.exports = mongoose.model('Group', GroupSchema)
