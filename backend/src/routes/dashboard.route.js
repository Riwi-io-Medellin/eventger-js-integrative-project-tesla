const { Router } = require('express')
const {generalMetrics, filteredMetrics} = require('../controllers/dashboard.controller.js');

const router = Router();

// Get general Metrics
router.get('/', (req, res) => {res.status(400).json({ message: "Year is required" });});
router.get('/:year', generalMetrics)

// Get metrics filtered by department and discipline
router.get('/:year/filter', filteredMetrics)

module.exports = router;