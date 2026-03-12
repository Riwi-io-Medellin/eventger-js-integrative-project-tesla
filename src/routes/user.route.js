const express = require("express")
const router = express.Router()

const routeValidation = require('./../middlewares/routeValidation.middleware')
const userController = require('./../controllers/user.controller')

// Router Validations
//router.use(routeValidation.authToken, routeValidation.authRole("admin_gen"))

// Add user
router.post("/add", async (req, res, next) => userController.add(req, res, next))

// Get users
router.get("/getAll", async (req, res, next) => userController.getAll(req, res, next))

// View unique user info

module.exports = router