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
async function findUnactive() {
    const result = await pool.query(`SELECT * FROM "user" WHERE is_active = $1`, [false])

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

// PUT
async function update(data, id) {
    const { name, email, departmentId, roleId, isActive } = data

    const result = await pool.query(
        `UPDATE "user" 
        SET 
            name = $1, 
            email = $2, 
            department_id = $3, 
            role_id = $4, 
            is_active = $5 
        WHERE id = $6
        RETURNING *`,
        [name, email, departmentId, roleId, isActive, id]
    )

    return result.rows
}

// PATCH
async function updatePassword(newPassword, userId) {
    const result = await pool.query(`UPDATE "user" SET password_hash = $1 WHERE id = $2`, [userId, newPassword])

    return result.rows
}
async function updateActive(value, id) {
    const result = await pool.query(`UPDATE "user" SET is_active = $1 WHERE id = $2 RETURNING *`, [value, id])

    return result.rows
}

// DELETE
async function remove(id) {
    const result = await pool.query(`DELETE FROM "user" WHERE id = $1 RETURNING id, email, is_active`, [id])

    return result.rows
}

module.exports = { 
    find, 
    findById, 
    findByEmail, 
    findUnactive, 
    create, 
    update,
    updatePassword, 
    updateActive,
    remove 
}