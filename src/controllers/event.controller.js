const eventService = require("./../services/event.service")

const validate = require("./../utils/validate")

// GET
async function get(req, res, next) {
    try {
        const filters = {}

        if(req.query.isActive) filters.isActive = req.query.isActive;
        if(req.query.scenarioId) filters.scenarioId = req.query.scenarioId;
        if(req.query.spaceId) filters.spaceId = req.query.spaceId;
        if(req.query.disciplineId) filters.disciplineId = req.query.disciplineId;
        if(req.query.creatorId) filters.creatorId = req.query.creatorId;

        // Calling service
        const response = await eventService.get(filters)

        // Returning response
        return res.status(200).json(response)
    } catch(err) {
        next(err)
    }
}
async function getByLapse(req, res, next) {
    try {
        const { startDate, finishDate } = req.query

        // Validating query params
        validate.requiredFields(
            req.query,
            "startDate",
            "finishDate"
        )

        // Calling service
        const response = await eventService.getByLapse(startDate, finishDate)
        
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
        const response = await eventService.getById(id)

        // Returning response
        return res.status(200).json(response)
    } catch(err) {
        next(err)
    }
}

// POST
async function create(req, res, next) {
    try {
        // Validation of parameters
        validate.requiredFields(
            req.body,
            "title",
            "description",
            "startDate",
            "finishDate",
            "isActive",
            "disciplineId",
            "scenarioId",
            "spaceId",
            "creatorId"
        )

        // Calling service
        const response = await eventService.create(req.body)

        // Returning response
        res.status(201).json(response)
    } catch(err) {
        next(err)
    }
}

// UPDATE

// DELETE
async function remove(req, res, next) {
    try {
        const { id } = req.params

        // Validate ID
        if(!id) {
            const err = new Error("Missing id query parameter")
            err.status = 400

            throw err
        }

        // Calling service
        const response = await eventService.remove(id)

        // Returning response
        return res.status(200).json(response)
    } catch(err) {
        next(err)
    }
}

module.exports = {
    get,
    getByLapse,
    getById,
    create,
    remove
}