const { Router } = require('express')
const { getScenarios, createScenario, deleteScenario, updateScenario } = require('../controllers/scenario.controller.js');

const router = Router();

router.get('/', getScenarios)
router.post('/', createScenario)
router.delete('/', (req, res) => {res.status(400).json({ message: "Scenario id is required" });});
router.delete('/:id', deleteScenario)
router.put('/', (req, res) => {res.status(400).json({ message: "Scenario id is required" });});
router.put('/:id', updateScenario)

module.exports = router;