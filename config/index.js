require('dotenv').config()

module.exports = {
  database: {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PWD,
    port: process.env.DATABASE_PORT,
    name: process.env.DATABASE_NAME,
  },
  cloud: {
    kardexUrl: process.env.CLOUD_FUNCTION_KARDEX_URL,
    cargaUrl: process.env.CLOUD_FUNCTION_CARGA_URL,
  },
  server: {
    KeyName: process.env.API_KEY_NAME,
    KeyValue: process.env.API_KEY_VALUE
  }
}