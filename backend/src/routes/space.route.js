const { Router } = require('express')
const {getSpaces, createSpace, deleteSpace, updateSpace, updateSpaceStatus} = require('../controllers/space.controller.js');
const router = Router();

const routeValidation = require("./../middlewares/routeValidation.middleware")

// Routes validation
router.use(routeValidation.authToken, routeValidation.authRole("admin_gen, admin_spa, event_creator, visualizer"))


router.get("/", routeValidation.authRole("admin_gen", "admin_spa"), async (req, res, next) => await getSpaces(req, res, next))
router.post("/", routeValidation.authRole("admin_gen", "admin_spa"), async (req, res, next) => await createSpace(req, res, next))
router.delete('/', (req, res) => {res.status(400).json({ message: "Space id is required" });});
router.delete("/:id", routeValidation.authRole("admin_gen", "admin_spa"), async (req, res, next) => await deleteSpace(req, res, next))
router.put('/', (req, res) => {res.status(400).json({ message: "Space id is required" });});
router.put("/:id", routeValidation.authRole("admin_gen", "admin_spa"), async (req, res, next) => await updateSpace(req, res, next))
router.patch('/', (req, res) => {res.status(400).json({ message: "Space id is required" });});
router.patch("/:id", routeValidation.authRole("admin_gen", "admin_spa"), async (req, res, next) => await updateSpaceStatus(req, res, next))

module.exports = router;