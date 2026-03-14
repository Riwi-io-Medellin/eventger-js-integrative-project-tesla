const { Router } = require('express')
const {generalMetrics} = require('../controllers/dashboard.controller.js');

const router = Router();

router.get('/', (req, res) => {res.status(400).json({ message: "Year is required" });});
router.get('/:year', generalMetrics)

module.exports = router;