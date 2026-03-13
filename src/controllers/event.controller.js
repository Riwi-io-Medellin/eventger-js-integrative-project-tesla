const eventService = require("./../services/event.service")

const validate = require("./../utils/validate")

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

module.exports = {
    create
}