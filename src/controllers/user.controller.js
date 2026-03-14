const userService = require("./../services/user.service")

const validate = require("./../utils/validate")

// GET
async function get(req, res, next) {
    try {
        const { query } = req
        const filters = {}

        // Adding filters
        if(query.isActive) filters.is_active = query.isActive;
        if(query.departmentId) filters.department_id = query.departmentId;
        if(query.roleName) filters.role_name = query.roleName;

        // Calling service
        const response = await userService.get(filters)

        // Returning response
        return res.status(200).json(response)
    } catch(err) {
        next(err)
    }
}
async function getByPage(req, res, next) {
    try {
        const { page, limit } = req.query

        // Validate params
        validate.requiredFields(req.query, "page", "limit")

        // Calling service
        const response = await userService.getByPage(page, limit);

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
        const response = await userService.getById(id)

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
            req.body,
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
            req.body,
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
async function updateDynamic(req, res, next) {
    try {
        const { id } = req.params

        // Validate ID
        if(!id) {
            const err = new Error("Missing id query parameter")
            err.status = 400

            throw err
        }

        const { query } = req
        const filters = {}

        // Validating what params has been sent
        if(query.name) filters.name = query.name;
        if(query.email) filters.email = query.email;
        if(query.isActive) filters.is_active = query.isActive;
        if(query.departmentId) filters.department_id = query.departmentId;
        if(query.roleId) filters.role_id = query.roleId;

        // Calling service
        const response = await userService.updateDynamic(filters, id)

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
        validate.requiredFields(req.body, "isActive")

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
    getByPage,
    getById, 
    update, 
    updateDynamic, 
    remove 
}