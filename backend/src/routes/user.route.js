const express = require("express")
const router = express.Router()

const routeValidation = require('./../middlewares/routeValidation.middleware')
const userController = require('./../controllers/user.controller')

// Router Validations Middleware
router.use(routeValidation.authToken, routeValidation.authRole("admin_gen"))

// Get users with filters or not
router.get("/", async (req, res, next) => await userController.get(req, res, next))

// Get users by page
router.get("/sheet", async (req, res, next) => await userController.getByPage(req, res, next))

// View unique user info
router.get("/:id", routeValidation.authRole("admin_gen", "admin_spa", "event_creator", "visualizer"), async (req, res, next) => await userController.getById(req, res, next))

// Add user
router.post("/", async (req, res, next) => await userController.add(req, res, next))

// Update user info
router.put("/:id", async (req, res, next) => await userController.update(req, res, next))

// Update active field
router.patch("/:id", async (req, res, next) => await userController.updateDynamic(req, res, next))

// Delete user
router.delete("/:id", async (req, res, next) => await userController.remove(req, res, next))

module.exports = router