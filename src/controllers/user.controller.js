const userService = require("./../services/user.service")

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

module.exports = { add, getAll }