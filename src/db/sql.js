require('dotenv').config({ path: '../../.env' });
const { Pool } = require('pg')

const pool = new Pool({
    host: process.env.DB_SQL_HOST || "localhost",
    user: process.env.DB_SQL_USER || "postgres", 
    password: process.env.DB_SQL_PASSWORD || "1234",
    database: process.env.DB_SQL_NAME,
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
})
console.log(process.env.DB_SQL_HOST)
console.log(process.env.DB_SQL_USER)

pool.connect()
  .then(client => {
      console.log("Succesful Connection")
  })
  .catch(err => {
      console.error("Connection error", err)
  })

module.exports = pool