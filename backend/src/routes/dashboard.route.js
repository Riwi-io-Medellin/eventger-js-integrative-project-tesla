const { Router } = require('express')
const {generalMetrics, filtredMetrics} = require('../controllers/dashboard.controller.js');

const router = Router();

router.get('/', (req, res) => {res.status(400).json({ message: "Year is required" });});
router.get('/:year', generalMetrics)
router.get('/:year/filter', filtredMetrics)


module.exports = router;