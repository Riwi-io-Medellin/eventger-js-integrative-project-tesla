const eventRepository = require("./../repositories/event.repository")

const validate = require("./../utils/validate")

// GET
async function get(filters) {
    const filtersLength = Object.keys(filters).length
    
    let response;

    // If there isn't any query, return a list of 15 recent events
    if(filtersLength == 0) {
        response = await eventRepository.getRecent()
    } else {
        // Make a dynamic query
        response = await eventRepository.search(filters)
    }

    return response
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

// POST
async function create(data) {
    const { startDate, finishDate } = data

    // Checking that the date isn't in the past
    validate.date(startDate)
    validate.date(finishDate)

    // Checking the schedule restrictions
    validate.dateSchedule(startDate)
    validate.dateSchedule(finishDate)

    // Checking the minimum time (1 hour)
    //validate.dateMinimum(startDate, finishDate)

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
async function update(id, data) {
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

    // Updating event in db
    const response = await eventRepository.update(id, data)

    // Returning response
    return response
}
async function updateDynamic(id, data) {
    // Checking if there isn't any data
    if(Object.keys(data).length == 0) return {message: "Nothing to date."};

    // Call dynamic update
    const result = await eventRepository.updateDynamic(id, data)

    // Checking that the ID Event exists
    if(result.length == 0) {
        const err = new Error("ID not found.")
        err.status = 404

        throw err
    }

    // Return response
    return result
}

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
    update,
    updateDynamic,
    remove
}