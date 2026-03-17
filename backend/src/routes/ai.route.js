const express = require("express")
const router = express.Router()

const aiController = require("./../controllers/ai.controller")

// Asking a prompt
router.post("/ask", async (req, res, next) => aiController.askToAi(req, res, next))

module.exports = router