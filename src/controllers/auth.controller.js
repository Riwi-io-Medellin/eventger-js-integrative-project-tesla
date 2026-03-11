const authService = require('./../services/auth.service')

async function register(req, res, next) {
    try {
        const { name, email, password, departmentId } = req.body

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
        };

        // Calling service
        const response = await authService.register(req.body)

        // Returning response
        res.status(201).json(response)
    } catch(err) {
        next(err)
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body

        // Validating body parameters
        if(!email) {
            const err = new Error("Missing email parameter")
            err.status = 400

            throw err
        } else if(!password) {
            const err = new Error("Missing password parameter")
            err.status = 400

            throw err
        }

        // Calling service
        const response = await authService.login(req.body)

        // Returing response
        res.status(200).json(response)
    } catch(err) {
        next(err)
    }
}

module.exports = { register, login }