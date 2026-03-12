const userRepository = require("./../repositories/user.repository")
const roleRepository = require("./../repositories/role.repository")

const jwt = require("./../utils/jwt")

function authToken(req, res, next) {
    try {
        const { token } = req.body

        // Checking that the token was sent
        if(!token) {
            const err = new Error("Missing token")
            err.status = 401

            throw err
        }

        // Adding user id to body request
        const tokenVerified = jwt.verify(token)

        req.body = {...req.body, id: tokenVerified.id}

        // Next middleware
        next()
    } catch(err) {
        // If the token is expired
        if(err.name === "TokenExpiredError") {
            const err = new Error("Token Expired")
            err.status = 401

            return next(err)
        }
        // If the token is invalid
        if(err.name === "JsonWebTokenError") {
            const err = new Error("Invalid Token")
            err.status = 401

            return next(err)
        }

        // Other errors
        next(err)
    }
}

function authRole(...roles) {
    return async (req, res, next) => { 
        try {
            // Getting the user role
            const userRole = await userRepository.findById(req.body.id)
            console.log("USER ROLE: ", userRole)

            // Checking if the role doesn't matches with the allowed
            if(!roles.includes(userRole)) {
                const err = new Error("User hasn't permission for this request")
                err.status = 401

                throw err
            }

            // Next middleware
            next()
        } catch(err) {
            next(err)
        }
    }
}

module.exports = { authToken, authRole }

// Rutas publicas
// - Auth Module

// Rutas privadas

// Bàsicas (todos)
// - Muro de eventos
// - Perfil

// Event Creator / Space admin / Admin plataforma
// - CRUD eventos

// Space admin / Admin plataforma
// - Dashboard
// - CRUD espacios

// Admin plataforma
// - CRUD usuarios