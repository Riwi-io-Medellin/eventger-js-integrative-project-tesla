const { Router } = require('express')
const {getSpaces, createSpace, deleteSpace, updateSpace, updateSpaceStatus} = require('../controllers/space.controller.js');
const router = Router();

const routeValidation = require("./../middlewares/routeValidation.middleware")

// Routes validation
router.use(routeValidation.authToken, routeValidation.authRole("admin_gen", "admin_spa", "event_creator", "visualizer"))

// Get all created spaces
router.get("/", getSpaces)

// Create a new space
router.post("/", routeValidation.authRole("admin_gen", "admin_spa"), async (req, res, next) => await createSpace(req, res, next))

// Delete a space
router.delete('/', (req, res) => {res.status(400).json({ message: "Space id is required" });});
router.delete("/:id", routeValidation.authRole("admin_gen", "admin_spa"), async (req, res, next) => await deleteSpace(req, res, next))

// Update a space name, description and scenario
router.put('/', (req, res) => {res.status(400).json({ message: "Space id is required" });});
router.put("/:id", routeValidation.authRole("admin_gen", "admin_spa"), async (req, res, next) => await updateSpace(req, res, next))

// Update the status of a space
router.patch('/', (req, res) => {res.status(400).json({ message: "Space id is required" });});
router.patch("/:id", routeValidation.authRole("admin_gen", "admin_spa"), async (req, res, next) => await updateSpaceStatus(req, res, next))

module.exports = router;