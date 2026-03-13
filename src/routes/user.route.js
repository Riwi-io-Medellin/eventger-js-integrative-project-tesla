const express = require("express")
const router = express.Router()

const routeValidation = require('./../middlewares/routeValidation.middleware')
const userController = require('./../controllers/user.controller')

// Router Validations Middleware
router.use(routeValidation.authToken, routeValidation.authRole("admin_gen"))

// Get all users
router.get("/getAll", async (req, res, next) => await userController.getAll(req, res, next))

// Get unactive users
router.get("/getUnactive", async (req, res, next) => await userController.getUnactive(req, res, next))

// View unique user info
router.get("/:id", routeValidation.authRole("admin_gen", "visualizer"), async (req, res, next) => await userController.get(req, res, next))

// Add user
router.post("/add", async (req, res, next) => await userController.add(req, res, next))

// Update user info
router.put("/:id", async (req, res, next) => await userController.update(req, res, next))

// Update active field
router.patch("/updateActive", async (req, res, next) => await userController.updateActive(req, res, next))

// Delete user
router.delete("/:id", async (req, res, next) => await userController.remove(req, res, next))

module.exports = router