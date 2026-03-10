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

module.exports = pool