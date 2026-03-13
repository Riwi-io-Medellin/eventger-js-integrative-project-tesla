const userService = require("./../services/user.service")

const validate = require("./../middlewares/validate.middleware")

// GET
async function get(req, res, next) {
    try {
        const { id } = req.params

        // Validate params
        validate.requiredFields("id")

        // Calling service
        const response = await userService.get(id)

        // Returning response
        return res.status(200).json(response)
    } catch(err) {
        next(err)
    }
}
async function getAll(req, res, next) {
    try {
        const { page, limit } = req.query

        // Validate params
        validate.requiredFields("page", "limit")

        // Calling service
        const response = await userService.getAll(page, limit);

        // Returning response
        return res.status(200).json(response)
    } catch(err) {
        next(err)
    }
}
async function getUnactive(req, res, next) {
    try {
        // Calling service
        const response = await userService.getUnactive()

        // Returning response
        return res.status(200).json(response)
    } catch(err) {
        next(err)
    }
}

// POST
async function add(req, res, next) {
    try {
        // Validating body parameters
        validate.requiredFields(
            "name",
            "email",
            "password",
            "departmentId",
            "roleName"
        )

        // Calling service
        const response = await userService.add(req.body)

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

        // Validating body parameters
        validate.requiredFields(
            "name",
            "email",
            "departmentId",
            "roleName",
            "isActive"
        )
        // Validate ID
        if(!id) {
            const err = new Error("Missing id query parameter")
            err.status = 400

            throw err
        }

        // Calling service
        const response = await userService.update(req.body, id)

        // Returning response
        return res.status(200).json(response)
    } catch(err) {
        next(err)
    }
}
async function updateActive(req, res, next) {
    try {
        const { isActive } = req.body
        const { id } = req.query

        // Validating parameters
        validate.requiredFields("isActive")

        // Validating ID
        if(!id) {
            const err = new Error("Missing id query")
            err.status = 400

            throw err
        }

        // Calling service
        const response = await userService.updateActive(isActive, id)

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

        if(!id) {
            const err = new Error("Missing ID param")
            err.status = 400

            throw err
        }

        // Calling service
        const response = await userService.remove(id)

        // Returning response
        return res.status(200).json(response)
    } catch(err) {
        next(err)
    }
}

module.exports = { 
    add, 
    get, 
    getAll, 
    getUnactive, 
    update, 
    updateActive, 
    remove 
}