const crypto = require('crypto')
const NodeRSA = require('node-rsa')
const _bcrypt = require('bcryptjs')

function keyPairGenerator() {
	return new Promise((resolve, reject) => {
		const key = new NodeRSA()
		key.generateKeyPair()
		const publicKey = key.exportKey('pkcs1-public-pem')
		const privateKey = key.exportKey('pkcs1-private-pem')
		resolve({ publicKey, privateKey })
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

async function decryptCredentials(user) {
	const key = new NodeRSA(user.privateKey)

	return new Promise((resolve, reject) => {
		try {

			const control = key.decrypt(user.controlNum, 'utf-8')
			const password = key.decrypt(user.controlPwd, 'utf-8')
			resolve({ control, password })
		} catch (e) {
			reject(e)
		}
	})
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
	bCompare,
}
