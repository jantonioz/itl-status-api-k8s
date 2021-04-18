// require('dotenv').config()
const app = require('express')()
const bodyParser = require('body-parser')
const rateLimit = require('express-rate-limit')

const db = require('./database')
const config = require('./config').server

// CORS
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header(
		'Access-Control-Allow-Headers',
		`Origin, X-Requested-With, Content-Type, Accept, Authorization, ${config.KeyName}`
	)
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
		return res.status(200).json({})
	}
	next()
})

// BodyParser config
app.use(
	bodyParser.json({
		limit: '5mb',
	})
)

app.use(
	bodyParser.urlencoded({
		limit: '5mb',
		extended: true,
		parameterLimit: 50,
	})
)

const API_URL = '/api'
const loginLimit = rateLimit({ windowMs: 15 * 6e4, max: 100 })
const registerLimit = rateLimit({ windowMs: 1 * 3.6e6, max: 50 })

/* app.use(`${API_URL}/register`, registerLimit)
app.use(`${API_URL}/login`, registerLimit, loginLimit) */

app.use(API_URL, require('./routers'))

app.use('/graphql', require('./graphql'))

async function startServer() {
	try {
		console.log('NODE ENV', process.env.NODE_ENV)
		const port = process.env.HTTP_PORT || 4000
		await db()

		app.listen(port, () => {
			console.log(new Date().toISOString(), `Running API ON ${API_URL}:${port}`)
		})
	} catch (error) {
		console.log(new Date(), error)
	}
}

if (!process.env.test) startServer()
module.exports = app
