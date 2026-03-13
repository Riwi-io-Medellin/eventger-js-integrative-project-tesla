const authService = require('./../services/auth.service')

const validate = require("./../middlewares/validate.middleware")

async function register(req, res, next) {
    try {
        // Validating body parameters
        validate.requiredFields(
            "name",
            "email",
            "password",
            "departmentId"
        )

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
        validate.requiredFields("email", "password")

        // Calling service
        const response = await authService.login(email, password)

        // Returing response
        res.status(200).json(response)
    } catch(err) {
        next(err)
    }
}

async function resetRequest(req, res, next) {
    try {
        const { email } = req.body

        // Validate if email has been sent
        validate.requiredFields("email")

        // Calling service
        const response = await authService.resetRequest(email)

        // Returning response
        res.status(200).json(response)
    } catch(err) {
        next(err)
    }
}
async function resetPassword(req, res, next) {
    try {
        const { token, newPassword } = req.body

        // Validate if token and new password has been sent
        validate.requiredFields("token", "newPassword")

        // Calling service
        const response = await authService.resetPassword(token, newPassword)

        // Returning response
        res.status(200).json(response)
    } catch(err) {
        next(err)
    }
}

module.exports = { register, login, resetRequest, resetPassword }