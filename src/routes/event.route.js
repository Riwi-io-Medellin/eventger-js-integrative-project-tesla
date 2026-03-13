const express = require("express")
const router = express.Router()

const routerValidation = require("./../middlewares/routeValidation.middleware")

const eventController = require("./../controllers/event.controller.js")

// Routes validation
//router.use(routerValidation.authToken, routerValidation.authRole("admin-..."))

// Add event
router.post("/", async (req, res, next) => eventController.create(req, res, next))

module.exports = router