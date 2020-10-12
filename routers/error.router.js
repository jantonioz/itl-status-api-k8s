module.exports = function (error, req, res, next) {
	res.status(error.status || 400).json({ ok: false, error })
}
