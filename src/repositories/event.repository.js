const pool = require("./../db/sql")

// Util functions

/*
Return all dates where the event start_date is minor than the new finish date,
and where the finish_date it's higher than the new start date.

For example:
    Event:
        - Start Date: 2026/03/12
        - Finish Date: 2026/03/15
    New Event:
        - Start Date: 2026/03/13
        - Finish Date: 2026/03/14
    
    2026/03/12 < 2026/03/14 -> Means that the event ends after the original start date
    AND
    2026/03/15 > 2026/03/13 -> Means that the event starts before the original end date
*/
async function checkDates(initDate, finishDate) {
    const result = await pool.query(
        `SELECT * FROM event WHERE start_date < $1 AND finish_date > $2`,
        [finishDate, initDate]
    )

    return result.rows
}

// GET
async function getRecent() {
    const result = await pool.query(
        `
        SELECT * FROM event GROUP BY id ORDER BY start_date DESC LIMIT 15
        `
    )

    return result.rows
}
async function search(filters) {
    let query = `SELECT * FROM event WHERE 1=1`
    const values = []

    let i = 1

    if(filters.isActive) {
        query += ` AND is_active = $${i++}`
        values.push(filters.isActive)
    }
    if(filters.spaceId) {
        query += ` AND space_id = $${i++}`
        values.push(filters.spaceId)
    }
    if(filters.scenarioId) {
        query += ` AND scenario_id = $${i++}`
        values.push(filters.scenarioId)
    }
    if(filters.disciplineId) {
        query += ` AND discipline_id = $${i++}`
        values.push(filters.disciplineId)
    }
    if(filters.creatorId) {
        query += ` AND creator_id = $${i++}`
        values.push(filters.creatorId)
    }

    const result = await pool.query(query, values)

    return result.rows
}
async function getById(id) {
    const result = await pool.query(
        `SELECT * FROM event WHERE id = $1`,
        [id]
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
    getRecent,
    getById,
    getByDate,
    search,
    create,
    remove
}