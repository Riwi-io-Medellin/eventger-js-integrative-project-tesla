const pool = require("./../db/sql")

// Util functions
async function checkDates(initDate, finishDate) {
    const result = await pool.query(
        `SELECT * FROM event WHERE start_date < $1 AND finish_date > $2`,
        [finishDate, initDate]
    )

    return result.rows
}

// GET
async function get(id) {
    const result = await pool.query(
        `SELECT * FROM event WHERE id = $1`,
        [id]
    )

    return result.rows
}
async function getByUserId(userId) {
    const result = await pool.query(
        `SELECT * FROM event WHERE creator_id = $1`,
        [userId]
    )

    return result.rows
}
async function getByDate(date) {
    const result = await pool.query(
        `SELECT * FROM event WHERE start_date >= $1 AND finish_date <= $1`,
        [date]
    )

    return result.rows
}

// POST
async function create(data) {
    const {
        title,
        description,
        startDate,
        finishDate,
        isActive,
        disciplineId,
        scenarioId,
        spaceId,
        creatorId
    } = data

    const result = await pool.query(
        `
        INSERT INTO event 
        (title, description, start_date, finish_date, is_active, discipline_id, scenario_id, space_id, creator_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
        `,
        [title, description, startDate, finishDate, isActive, disciplineId, scenarioId, spaceId, creatorId]
    )

    return result.rows
}

// UPDATE
async function update() {

}
async function updateDates(startDate, finishDate) {
    
}

// DELETE
async function remove(id) {
    const result = await pool.query(`DELETE FROM event WHERE id = $1 RETURNING *`, [id])

    return result.rows
}

module.exports = {
    checkDates,
    get,
    getByUserId,
    getByDate,
    create,
    remove
}