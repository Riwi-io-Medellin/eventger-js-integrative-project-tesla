const { Router } = require('express')
const {getSpaces, createSpace, deleteSpace, updateSpace, updateSpaceStatus} = require('../controllers/space.controller.js');
const router = Router();

const routeValidation = require("./../middlewares/routeValidation.middleware")

// Routes validation
router.use(routeValidation.authToken)

// Get all created spaces
router.get("/", getSpaces)

// Create a new space
router.post("/", routeValidation.authRole("admin_gen", "admin_spa"), async (req, res, next) => await createSpace(req, res, next))
router.delete('/', routeValidation.authRole("admin_gen, admin_spa, event_creator, visualizer"), (req, res) => {res.status(400).json({ message: "Space id is required" });});
router.delete("/:id", routeValidation.authRole("admin_gen", "admin_spa"), async (req, res, next) => await deleteSpace(req, res, next))
router.put('/', routeValidation.authRole("admin_gen, admin_spa, event_creator, visualizer"), (req, res) => {res.status(400).json({ message: "Space id is required" });});
router.put("/:id", routeValidation.authRole("admin_gen", "admin_spa"), async (req, res, next) => await updateSpace(req, res, next))
router.patch('/', routeValidation.authRole("admin_gen, admin_spa, event_creator, visualizer"), (req, res) => {res.status(400).json({ message: "Space id is required" });});
router.patch("/:id", routeValidation.authRole("admin_gen", "admin_spa"), async (req, res, next) => await updateSpaceStatus(req, res, next))

module.exports = router;