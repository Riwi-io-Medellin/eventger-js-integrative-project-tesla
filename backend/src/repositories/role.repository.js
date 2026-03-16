const pool = require("../db/sql")

async function find() {
    const results = await pool.query("SELECT * FROM role")

    return results.rows
}
async function findByName(name) {
    const results = await pool.query("SELECT id FROM role WHERE name = $1", [name])

    return results.rows[0]
}
async function findById(id) {
    const results = await pool.query("SELECT name FROM role WHERE id = $1", [id])

    return results.rows[0]
}

module.exports = { find, findByName, findById }