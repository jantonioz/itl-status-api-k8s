const router = require('express').Router()
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const StatusService = require('../services/status.service')
const UserRepository = require('../repositories/user.repository')

const schema = buildSchema(`
  type KardexItem {
    _id: String,
    subject: Subject,
    grade: Float,
    semester: Int,
    date: String,
    user: String
  }

  type Subject {
    _id: String,
    key: String,
    name: String,
    career: String
  }

  type User {
    _id: String,
    email: String,
    username: String,
  }

  type Query {
    kardex(userId: String, sessionId: String): [KardexItem],
  }
`)

const rootValue = {
	kardex: async ({ userId, sessionId }) => {
		const userExists = await UserRepository.findOne({
			$or: [{ _id: userId }, { sessionId: sessionId }],
		}).exec()
		if (!userExists) throw { code: 401, message: 'Invalid credentials' }
		const kardexByUserId = await StatusService.getKardex({ id: userId })
		return kardexByUserId
	},
}

router.use(
	'/',
	graphqlHTTP({
		schema,
		rootValue,
		graphiql: true,
	})
)

module.exports = router
