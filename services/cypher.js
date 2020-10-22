const crypto = require('crypto')
const NodeRSA = require('node-rsa')
const _bcrypt = require('bcryptjs')

function keyPairGenerator() {
	return new Promise((resolve, reject) => {
		crypto.generateKeyPair(
			'rsa',
			{
				modulusLength: 2048,
			},
			(err, publicKey, privateKey) => {
				privateKey = privateKey
					.export({ type: 'pkcs1', format: 'pem' })
					.toString()
				publicKey = publicKey
					.export({ type: 'pkcs1', format: 'pem' })
					.toString()
				if (!err) resolve({ publicKey, privateKey })
				else reject(err)
			}
		)
	})
}

async function encrypt(data, publicKey) {
	const key = new NodeRSA(publicKey)
	return key.encrypt(data, 'base64')
}

async function decrypt(data, privateKeyStr) {
	const key = new NodeRSA(privateKeyStr)
	return key.decrypt(data, 'utf-8')
}

function decryptCredentials(user, cred) {
	const key = new NodeRSA(user.privateKey)
	return {
		control: key.decrypt(cred.controlNum, 'utf-8'),
		password: key.decrypt(cred.controlPwd, 'utf-8'),
	}
}

async function bCrypt(data) {
	const salt = await _bcrypt.genSalt(10)
	return _bcrypt.hash(data, salt)
}

function bCompare(data, crypt) {
	return _bcrypt.compare(data, crypt)
}

module.exports = {
	keyPairGenerator,
	encrypt,
	decrypt,
	decryptCredentials: decryptCredentials,
	bCrypt,
	bCompare
}
