const pool  = require('./../db/sql')

// GET
async function find(page, limit) {
    // Offset and limit for avoid returning all users data
    const result = await pool.query(`SELECT id, name, email, phone_number, is_active, created_at, department_id, role_id FROM "user" LIMIT $1 OFFSET $2`, [limit, page])
    return result.rows
}
async function findById(id) {
    const result = await pool.query(`SELECT id, name, email, phone_number, is_active, created_at, department_id, role_id FROM "user" WHERE id = $1`, [id])

    return result.rows
}
async function findByEmail(email) {
    const result = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [email])

    return result.rows
}
async function search(filters) {
    let query = `SELECT id, name, email, phone_number, is_active, created_at, department_id, role_id FROM "user" WHERE 1=1`

    const fields = Object.keys(filters)
    const values = Object.values(filters)

    // Adding each where clause
    for(let i = 0; i < fields.length; i++) query += ` AND ${fields[i]} = $${i+1}`;

    // Adding limit clause
    const finalQuery = query + ` LIMIT 50` // Limiting it to 50 queries

    // Doing query
    const result = await pool.query(finalQuery, values)

    return result.rows
}

// POST
async function create(data) {
    const { name, email, phone, passwordHash, departmentId, roleId, isActive } = data

    const result = await pool.query(
        `
        INSERT INTO "user" (name, email, phone_number, password_hash, department_id, role_id, is_active) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
        `,
        [name, email, phone, passwordHash, departmentId, roleId, isActive]
    )

    return result.rows[0].id
}

// PUT
async function update(data, id) {
    const { name, email, phoneNumber, departmentId, roleId, isActive } = data

    const result = await pool.query(
        `UPDATE "user" 
        SET 
            name = $1, 
            email = $2,
            phone_number = $3, 
            department_id = $4, 
            role_id = $5, 
            is_active = $6 
        WHERE id = $7
        RETURNING id, name, email, phone_number, is_active, created_at, department_id, role_id`,
        [name, email, phoneNumber, departmentId, roleId, isActive, id]
    )

    return result.rows
}

// PATCH
async function updateDynamic(data, id) {
    const fields = Object.keys(data)
    const values = Object.values(data)
    
    let query = `UPDATE "user" SET`

    // Dynamic sets
    for(let i = 0; i < fields.length; i++) query += ` ${fields[i]} = $${i+1},`;

    // Remove the last character of the string (comma)
    let finalQuery = query.slice(0, -1)

    // Adding id
    finalQuery += ` WHERE id = $${fields.length + 1} RETURNING id, name, email, phone_number, is_active, created_at, department_id, role_id `
    values.push(id)

    // Query
    const result = await pool.query(finalQuery, values)

    return result.rows
}
async function updatePassword(newPassword, userId) {
    const result = await pool.query(`UPDATE "user" SET password_hash = $1 WHERE id = $2`, [userId, newPassword])

    return result.rows
}

// DELETE
async function remove(id) {
    const result = await pool.query(`DELETE FROM "user" WHERE id = $1 RETURNING id, name, email`, [id])

    return result.rows
}

module.exports = { 
    find, 
    findById, 
    findByEmail, 
    search, 
    create, 
    update,
    updateDynamic,
    updatePassword, 
    remove 
}