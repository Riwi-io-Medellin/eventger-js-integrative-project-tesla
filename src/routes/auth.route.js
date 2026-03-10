const express = require("express")
const router = express.Router();

const authController = require('./../controllers/auth.controller')

// Register
router.post("/register", (req, res) => authController.register(req, res))

module.exports = router