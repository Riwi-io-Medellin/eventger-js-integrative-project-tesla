const express = require("express");
const router = express.Router();

const departmentController = require("../controllers/department.controller");

router.get("/", async (req, res, next) => await departmentController.get(req, res, next));

module.exports = router;
