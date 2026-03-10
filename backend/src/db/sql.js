const { Pool } = require('pg')

const pool = new Pool({
    host: process.env.DB_SQL_HOST || "localhost",
    user: process.env.DB_SQL_USER || "postgres", 
    password: process.env.DB_SQL_PASSWORD || "1234",
    database: 'project_institute_db',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
})

pool.connect()
  .then(client => {
      console.log("✅ Conexión a PostgreSQL exitosa")
      client.release()
  })
  .catch(err => {
      console.error("❌ Error de conexión a PostgreSQL:", err)
  })

module.exports = pool