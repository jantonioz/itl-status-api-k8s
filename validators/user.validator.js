const Joi = require('@hapi/joi')

const id = { id: Joi.string().required() }

class UserValidator {
	get() {
		return Joi.object()
			.keys()
			.options({ allowUnknown: true, stripUnknown: true })
	}

	create() {
		return Joi.object()
			.keys({
				email: Joi.string().required(),
				password: Joi.string().required(),
				username: Joi.string().required(),
			})
			.options({ allowUnknown: true, stripUnknown: true })
	}

	update() {
		return Joi.object()
			.keys({
				email: Joi.string().required(),
				password: Joi.string().required(),
				username: Joi.string().required(),
				controlNum: Joi.string().optional(),
				controlPwd: Joi.string().optional(),
				...id,
			})
			.options({ allowUnknown: true, stripUnknown: true })
	}

	getStatus() {
		return Joi.object()
			.keys(id)
			.options({ allowUnknown: true, stripUnknown: true })
	}

	updateStatus() {
		return Joi.object()
			.keys({
				controlNum: Joi.string().required(),
				controlPwd: Joi.string().required(),
				...id,
			})
			.options({ allowUnknown: true, stripUnknown: true })
	}

	delete() {
		return Joi.object()
			.keys(id)
			.options({ allowUnknown: true, stripUnknown: true })
	}
}

module.exports = new UserValidator()
