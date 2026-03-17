const express = require("express")
const router = express.Router()

const disciplineController = require("./../controllers/discipline.controller")

// Get all the disciplines
router.get("/", async (req, res, next) => await disciplineController.get(req, res, next))

// Get by id
router.get("/:id", async (req, res, next) => await disciplineController.getById(req, res, next))

module.exports = router