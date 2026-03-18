const pool = require("../db/sql");

async function find() {
    const response = await pool.query("SELECT id, name FROM department ORDER BY name");
    return response.rows;
}

module.exports = { find };
