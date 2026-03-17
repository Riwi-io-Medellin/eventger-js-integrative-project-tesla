const disciplineService = require("./../services/discipline.service");//

async function get(req, res, next) {
    try {
        // Calling service
        const response = await disciplineService.get()

        // Returning response
        return res.status(200).json(response)
    } catch(err) {
        next(err)
    }
}

async function getById(req, res, next) {
    try {
        const { id } = req.params

        // Validate ID
        if(!id) {
            const err = new Error("Missing id query parameter")
            err.status = 400

            throw err
        }

        // Calling service
        const response = await disciplineService.getById(id)

        // Returning response
        res.status(200).json(response)
    } catch(err) {
        next(err)
    }
}

module.exports = {
    get,
    getById
}