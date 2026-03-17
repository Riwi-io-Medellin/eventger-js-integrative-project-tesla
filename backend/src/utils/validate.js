function date(dateString) {
    const parsedDate = new Date(dateString)
    const now = new Date()

    // If the date is minor to the actual date
    if(parsedDate < now) {
        const err = new Error("Bad date params")
        err.status = 401

        throw err
    }

    return dateString
}

function dateSchedule(dateString) {
    const date = new Date(dateString)
    
    if(date.getHours() < 6) {
        const err = new Error("Event must start at 6:00 AM or later")
        err.status = 401

        throw err
    } else if(date.getHours() > 22) {
        const err = new Error("Event must finish at 10:00 PM or early")
        err.status = 401

        throw err
    }

    return dateString
}

function dateMinimum(startDateStr, finishDateStr) {
    // Check that each event 
    const startDate = new Date(startDateStr)
    const finishDate = new Date(finishDateStr)

    const diff = startDate - finishDate
    const hour = 60*60*1000

    if(diff < hour) {
        const err = new Error("Event must last at least 1 hour")
        err.status = 401

        throw err
    }

    // Finish date must be after start date
    if(finishDate < startDate) {
        const err = new Error("Event finish must be after start date")
        err.status = 401

        throw err
    }

    return true
}

function requiredFields(body, ...fields) {
    // body?. it's optional chaining. Will select the property only if it exists
    const missing = fields.filter(field => body?.[field] === undefined)

    // If missing length it's diferrent to zero
    if(missing.length) {
        const err = new Error("Missing required fields")
        err.status = 400
        err.missing = missing

        throw err
    }
}

module.exports = {
    date,
    dateSchedule,
    dateMinimum,
    requiredFields
}