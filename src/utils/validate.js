function date(dateString) {
    const date = new Date(dateString)

    // If the date is minor to the actual date
    if(date < Date.now()) {
        const err = new Error("Bad date params")
        err.status = 401

        throw err
    }

    return dateString
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
    requiredFields
}