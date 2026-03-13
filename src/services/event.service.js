const eventRepository = require("./../repositories/event.repository")

const validate = require("./../utils/validate")

// GET
async function get(id) {

}
async function getByLapse(startDate, finishDate) {
    // Making query
    const response = await eventRepository.checkDates(startDate, finishDate)

    // Returning
    return response
}
async function getById(id) {
    // Make query
    const response = await eventRepository.getById(id)

    // Returning
    return response
}
async function get(filters) {
    const filtersLength = Object.keys(filters).length
    let response;
    console.log("FILTERS: ", filters)
    // If there isn't any query, return a list of 15 recent events
    if(filtersLength == 0) {
        response = await eventRepository.getRecent()
    } else {
        // Make a dynamic query
        response = await eventRepository.search(filters)
    }

    return response
}

// POST
async function create(data) {
    const { startDate, finishDate } = data

    // Checking that the date isn't in the past
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
async function remove(id) {
    // Make query
    const response = await eventRepository.remove(id)

    // Checking if there wasn't any result
    if(response.length == 0) {
        const err = new Error("Event with that ID doesn't exists")
        err.status = 404

        throw err
    }

    // Returning
    return response
}

module.exports = {
    get,
    getByLapse,
    getById,
    create,
    remove
}