const userService = require("./../services/user.service")

// GET
async function get(req, res, next) {
    try {
        const { id } = req.params

        // Validate params
        if(!id) {
            const err = new Error("Missing ID parameter")
            err.status = 400

            throw err
        }

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
        if(!page) {
            const err = new Error("Missing page query param.")
            err.status = 400

            throw err
        } else if(!limit) {
            const err = new Error("Missing limit query param.")
            err.status = 400

            throw err
        }

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
        let { name, email, password, departmentId, roleName } = req.body

        // Validating body parameters
        if(!name) {
            const err = new Error("Missing name parameter");
            err.status = 400

            throw err
        }
        else if(!email) {
            const err = new Error("Missing email parameter");
            err.status = 400

            throw err
        }
        else if(!password) {
            const err = new Error("Missing password parameter");
            err.status = 400

            throw err
        }
        else if(!departmentId) {
            const err = new Error("Missing deparmentId parameter");
            err.status = 400

            throw err
        } else if(!roleName) {
            const err = new Error("Missing role parameter")
            err.status = 400

            throw err
        }

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
        const { name, email, departmentId, roleName, isActive } = req.body

        // Validating body parameters
        if(!name) {
            const err = new Error("Missing name parameter");
            err.status = 400

            throw err
        }
        else if(!email) {
            const err = new Error("Missing email parameter");
            err.status = 400

            throw err
        }
        else if(!departmentId) {
            const err = new Error("Missing deparmentId parameter");
            err.status = 400

            throw err
        }
        else if(!roleName) {
            const err = new Error("Missing roleName parameter");
            err.status = 400

            throw err
        }
        else if(!("isActive" in req.body)) {
            const err = new Error("Missing isActive parameter");
            err.status = 400

            throw err
        };
        // Validating ID Path parameter
        if(!id) {
            const err = new Error("Missing ID path parameter");
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
        if(!("isActive" in req.body)) {
            const err = new Error("Missing isActive param")
            err.status = 400

            throw err
        }

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