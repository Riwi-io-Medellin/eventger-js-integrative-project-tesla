const express = require("express")
const router = express.Router()

const routerValidation = require("./../middlewares/routeValidation.middleware")

const eventController = require("./../controllers/event.controller.js")

// Routes validation
//router.use(routerValidation.authToken, routerValidation.authRole("admin-..."))

// Get events by activity status, scenarioId, disciplineId or spaceId. Sent with query
router.get("/", async (req, res, next) => await eventController.get(req, res, next))

// Get events by week
router.get("/by-lapse", async (req, res, next) => await eventController.getByLapse(req, res, next))

// Get events by id
router.get("/:id", async (req, res, next) => await eventController.getById(req, res, next))

// Add event
router.post("/", async (req, res, next) => await eventController.create(req, res, next))

// Delete event
router.delete("/:id", async (req, res, next) => await eventController.remove(req, res, next))

module.exports = router