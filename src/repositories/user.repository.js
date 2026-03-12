const pool  = require('./../db/sql')

// Create, find, findById, findByEmail, update, delete

// GET
async function find(page, limit) {
    // Offset and limit for avoid returning all users data
    const result = await pool.query(`SELECT * FROM "user" LIMIT $1 OFFSET $2`, [limit, page])

    return result.rows
}
async function findById(id) {
    const result = await pool.query(`SELECT * FROM "user" WHERE id = $1`, [id])

    return result.rows
}
async function findByEmail(email) {
    const result = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [email])

    return result.rows
}

// POST
async function create(data) {
    const { name, email, passwordHash, departmentId, roleId, isActive } = data

    const result = await pool.query(
        `
        INSERT INTO "user" (name, email, password_hash, department_id, role_id, is_active) 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
        `,
        [name, email, passwordHash, departmentId, roleId, isActive]
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
    const result = await pool.query(`DELETE FROM "user" WHERE id = $1 RETURNING *`, [id])

    return result.rows
}

module.exports = { find, findById, findByEmail, create, updatePassword, remove }