const { Router } = require('express')
const { getScenarios, createScenario, deleteScenario, updateScenario } = require('../controllers/scenario.controller.js');

const router = Router();

const routeValidation = require("./../middlewares/routeValidation.middleware")

// Routes validation
router.use(routeValidation.authToken)

// Get all scenarios
router.get("/", routeValidation.authRole("admin_gen", "admin_spa"), async (req, res, next) => await getScenarios(req, res, next))

// Create a new scenario
router.post("/", routeValidation.authRole("admin_gen", "admin_spa"), async (req, res, next) => await createScenario(req, res, next))
router.delete('/', routeValidation.authRole("admin_gen, admin_spa, event_creator, visualizer"), (req, res) => {res.status(400).json({ message: "Scenario id is required" });});
router.delete("/:id", routeValidation.authRole("admin_gen", "admin_spa"), async (req, res, next) => await deleteScenario(req, res, next))
router.put('/', routeValidation.authRole("admin_gen, admin_spa, event_creator, visualizer"), (req, res) => {res.status(400).json({ message: "Scenario id is required" });});
router.put("/:id", routeValidation.authRole("admin_gen", "admin_spa"), async (req, res, next) => await updateScenario(req, res, next))

module.exports = router;