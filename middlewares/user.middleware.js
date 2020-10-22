'use strict'
const UserValidator = require('../validators/user.validator')
class UserMiddleware {
	async get(req, res, next) {
		try {
			req.user = await UserValidator.get().validateAsync({
				...req.query,
				...req.params,
				...req.body,
			})
			next()
		} catch (error) {
			next(error)
		}
	}

	async getStatus(req, res, next) {
		try {
			req.user = await UserValidator.getStatus().validateAsync({
				...req.query,
				...req.params,
				...req.body,
			})
			next()
		} catch (error) {
			next(error)
		}
	}

	async create(req, res, next) {
		try {
			req.user = await UserValidator.create().validateAsync({
				...req.query,
				...req.params,
				...req.body,
			})
			next()
		} catch (error) {
			next(error)
		}
	}

	async login(req, res, next) {
		try {
			req.user = await UserValidator.login().validateAsync({
				...req.query,
				...req.params,
				...req.body,
			})
			next()
		} catch (error) {
			next(error)
		}
	}

	async update(req, res, next) {
		try {
			req.user = await UserValidator.update().validateAsync({
				...req.query,
				...req.params,
				...req.body,
			})
			next()
		} catch (error) {
			next(error)
		}
	}

	async updateStatus(req, res, next) {
		try {
			req.user = await UserValidator.updateStatus().validateAsync({
				...req.query,
				...req.params,
				...req.body,
			})
			next()
		} catch (error) {
			next(error)
		}
	}

	async delete(req, res, next) {
		try {
			req.user = await UserValidator.delete().validateAsync({
				...req.query,
				...req.params,
				...req.body,
			})
			next()
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new UserMiddleware()
