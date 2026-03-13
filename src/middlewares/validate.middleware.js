function requiredFields(...fields) {
    return (req, res, next) => {
        const missing = fields.filter(field => req.body[field] === undefined)

        // If missing length it's diferrent to zero
        if(missing.length) {
            const err = new Error("Missing required fields")
            err.status = 400
            err.missing = missing

            return next(err)
        }

        next()
    }
}

module.exports = {
    requiredFields
}