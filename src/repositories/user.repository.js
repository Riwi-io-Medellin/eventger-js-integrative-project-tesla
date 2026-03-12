const pool  = require('./../db/sql')

// Create, find, findById, findByEmail, update, delete

// GET
async function find() {
    const result = await pool.query(`SELECT * FROM "user"`)

    return result.rows
}
async function findById(id) {
    const result = await pool.query(`SELECT * FROM "user" WHERE id = $1`, [id])

    if(result.rows.length = 0) {
        const error = Error(`User with id ${id} not found`);
        error.status = 400

        throw error
    }

    return result.rows
}
async function findByEmail(email) {
    const result = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [email])

    return result.rows
}

// POST
async function create(data) {
    const { name, email, passwordHash, departmentId} = data

    const result = await pool.query(
        `
        INSERT INTO "user" (name, email, password_hash, department_id) 
        VALUES ($1, $2, $3, $4)
        RETURNING id
        `,
        [name, email, passwordHash, departmentId]
    )

    return result.rows[0].id
}

// PATCH
async function updateName(name, userId) {
    const result = await pool.query(`UPDATE "user" SET name = $1 WHERE id = $2`, [name, userId])

    return result.rows
}
async function updateEmail(email, userId) {
    const result = await pool.query(`UPDATE "user" SET email = $1 WHERE id = $2`, [email, userId])
}
async function updateDepartment(department_id) {

}
async function updateRol(rol_id) {

}
async function updatePassword(newPassword, userId) {
    const result = await pool.query(`UPDATE "user" SET password_hash = $1 WHERE id = $2`, [userId, newPassword])

    return result.rows
}

// PUT
async function update(data) {

}

// DELETE
async function remove(id) {

}

module.exports = { find, findById, findByEmail, create, updatePassword }