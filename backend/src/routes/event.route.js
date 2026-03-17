const express = require("express")
const router = express.Router()

const routeValidation = require("./../middlewares/routeValidation.middleware")

const eventController = require("./../controllers/event.controller.js")

// Routes validation
router.use(routeValidation.authToken, routeValidation.authRole("admin_gen", "admin_spa", "event_creator", "visualizer"))

// Get events by activity status, scenarioId, disciplineId or spaceId. Sent with query
router.get("/", routeValidation.authRole("admin_gen", "admin_spa", "event_creator", "visualizer"), async (req, res, next) => await eventController.get(req, res, next))

// Get events by lapse
router.get("/by-lapse", routeValidation.authRole("admin_gen", "admin_spa", "event_creator", "visualizer"), async (req, res, next) => await eventController.getByLapse(req, res, next))

// Get events by id
router.get("/:id", routeValidation.authRole("admin_gen", "admin_spa", "event_creator", "visualizer"), async (req, res, next) => await eventController.getById(req, res, next))

// Add event
router.post("/", routeValidation.authRole("admin_gen", "admin_spa", "event_creator"), async (req, res, next) => await eventController.create(req, res, next))

// Update full event
router.put("/:id", routeValidation.authRole("admin_gen", "admin_spa", "event_creator"), async (req, res, next) => await eventController.update(req, res, next))

// Update partial event
router.patch("/:id", routeValidation.authRole("admin_gen", "admin_spa", "event_creator"), async (req, res, next) => await eventController.updateDynamic(req, res, next))

// Delete event
router.delete("/:id", routeValidation.authRole("admin_gen", "admin_spa", "event_creator"), async (req, res, next) => await eventController.remove(req, res, next))

module.exports = router