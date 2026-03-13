const eventRepository = require("./../repositories/event.repository")

const validate = require("./../utils/validate")

// GET
async function get(id) {

}
async function getAll() {

}

// POST
async function create(data) {
    const { startDate, finishDate } = data

    // Checking that the date it's not in past
    validate.date(startDate)
    validate.date(finishDate)

    // Checking the date isn't busy
    const eventConflict = await eventRepository.checkDates(startDate, finishDate)

    if(eventConflict.length > 1) {
        const err = new Error("Event time conflict")
        err.status = 409 // HTTP Conflict Code

        throw err
    }

    // Getting spaces, disciplines and scenarios ids
    // ...

    // Creating event in db
    const response = await eventRepository.create(data)

    // Returning response
    return response
}

// UPDATE

// DELETE

module.exports = {
    get,
    getAll,
    create
}