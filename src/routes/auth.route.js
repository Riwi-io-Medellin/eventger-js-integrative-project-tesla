const express = require("express")
const router = express.Router();

const authController = require('./../controllers/auth.controller')

// Register
router.post("/register", async (req, res, next) => await authController.register(req, res, next))

// Login
router.post("/login", async (req, res, next) => authController.login(req, res, next))

module.exports = router