const express = require("express")
const router = express.Router();

const authController = require('./../controllers/auth.controller')

// Register
router.post("/register", async (req, res, next) => await authController.register(req, res, next))

// Login
router.post("/login", async (req, res, next) => await authController.login(req, res, next))

// Request Reset Password
router.post("/reset-request", async (req, res, next) => await authController.resetRequest(req, res, next))

// Reset Password
router.post("/reset-password", async (req, res, next) => await authController.resetPassword(req, res, next))

module.exports = router