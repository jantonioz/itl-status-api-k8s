const UserService = require('../services/user.service.js')

class UserController {
	async get(req, res, next) {
		try {
			const data = await UserService.get(req.user)
			res.status(200).json({ ok: true, data })
		} catch (error) {
			next(error)
		}
	}

	async login(req, res, next) {
		try {
			const data = await UserService.login(req.user)
			res.status(200).json({ ok: true, data })
		} catch (error) {
			next(error)
		}
	}

	async getStatus(req, res, next) {
		try {
			const data = await UserService.getStatus(req.user)
			res.status(200).json({ ok: true, data })
		} catch (error) {
			next(error)
		}
	}

	async create(req, res, next) {
		try {
			const data = await UserService.create(req.user)
			res.status(200).json({ ok: true, data })
		} catch (error) {
			console.log(new Date().toISOString(), error)
			next(error)
		}
	}

	async update(req, res, next) {
		try {
			const data = await UserService.update(req.user)
			res.status(200).json({ ok: true, data })
		} catch (error) {
			console.log(error)
			next(error)
		}
	}

	async updateStatus(req, res, next) {
		try {
			const data = await UserService.updateStatus(req.user)
			res.status(200).json({ ok: true, data })
		} catch (error) {
			next(error)
		}
	}

	async delete(req, res, next) {
		try {
			const data = await UserService.delete(req.user)
			res.status(200).json({ ok: true, data })
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new UserController()
