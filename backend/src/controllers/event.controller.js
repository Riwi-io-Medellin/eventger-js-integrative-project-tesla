const eventService = require("./../services/event.service")
const { notifyUsersEmail, notifyUsersPhone, createNotification } = require("./../services/notification.service")
const validate = require("./../utils/validate")

// GET
async function get(req, res, next) {
    try {
        const filters = {}

        if(req.query.isActive) filters.is_active = req.query.isActive;
        if(req.query.scenarioId) filters.scenario_id = req.query.scenarioId;
        if(req.query.spaceId) filters.space_id = req.query.spaceId;
        if(req.query.disciplineId) filters.discipline_id = req.query.disciplineId;
        if(req.query.creatorId) filters.creator_id = req.query.creatorId;

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

        // Send email notification
        await notifyUsersEmail(response[0])

        //Send Whatsapp notification
        await notifyUsersPhone(response[0])

        //Create Notification
        await createNotification(response[0].id)

        // Returning response
        res.status(201).json(response)
    } catch(err) {
        next(err)
    }
}

// UPDATE
async function update(req, res, next) {
    try {
        const { id } = req.params

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

        // Validate ID
        if(!id) {
            const err = new Error("Missing id query parameter")
            err.status = 400

            throw err
        }

        // Calling service
        const response = await eventService.update(id, req.body)

        // Returning response
        res.status(200).json(response)
    } catch(err) {
        next(err)
    }
}
async function updateDynamic(req, res, next) {
    try {
        const { id } = req.params
        const { query } = req
        // Checking ID
        if(!id) {
            const err = new Error("Missing ID Parameter")
            err.status = 400

            throw err
        }

        // Checking what dates has been sent
        const dates = {}

        if(query.title) dates.title = query.title;
        if(query.description) dates.description = query.description;
        if(query.startDate) dates.start_date = query.startDate;
        if(query.finishDate) dates.finish_date = query.finishDate;
        if(query.isActive) dates.is_active = query.isActive;
        if(query.disciplineId) dates.discipline_id = query.disciplineId;
        if(query.scenarioId) dates.scenario_id = query.scenarioId;
        if(query.spaceId) dates.space_id = query.spaceId;
        if(query.creatorId) dates.creator_id = query.creatorId;

        // Calling service
        const response = await eventService.updateDynamic(id, dates)

        // Returning response
        return res.status(200).json(response)
    } catch(err) {
        next(err)
    }
}

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
    update,
    updateDynamic,
    remove
}