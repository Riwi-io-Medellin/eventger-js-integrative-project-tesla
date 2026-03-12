const express = require("express")
const router = express.Router()

const routeValidation = require('./../middlewares/routeValidation.middleware')
const userController = require('./../controllers/user.controller')

// Router Validations
//router.use(routeValidation.authToken, routeValidation.authRole("admin_gen"))

// View unique user info
router.get("/:id", async (req, res, next) => await userController.get(req, res, next))

// Get all users
router.get("/getAll", async (req, res, next) => await userController.getAll(req, res, next))

// Add user
router.post("/add", async (req, res, next) => await userController.add(req, res, next))

// Update user info


// Delete user
router.delete("/:id", async (req, res, next) => await userController.remove(req, res, next))

module.exports = router