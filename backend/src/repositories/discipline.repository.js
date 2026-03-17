const pool = require("./../db/sql")

async function get() {
    const response = await pool.query("SELECT * FROM discipline")

    return response.rows
}

async function getById(id) {
    const response = await pool.query("SELECT * FROM discipline WHERE id = $1", [id])

    return response.rows
}

async function getByName(name) {
    const response = await pool.query("SELECT * FROM discipline WHERE name = $1", [name])

    return response.rows
}

module.exports = {
    get,
    getById,
    getByName
}