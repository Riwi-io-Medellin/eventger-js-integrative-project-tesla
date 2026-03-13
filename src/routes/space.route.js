const { Router } = require('express')
const {getSpaces, createSpace, deleteSpace, updateSpace, updateSpaceStatus} = require('../controllers/space.controller.js');

const router = Router();

router.get('/', getSpaces)
router.post('/', createSpace)
router.delete('/', (req, res) => {res.status(400).json({ message: "Space id is required" });});
router.delete('/:id', deleteSpace)
router.put('/', (req, res) => {res.status(400).json({ message: "Space id is required" });});
router.put('/:id', updateSpace)
router.patch('/', (req, res) => {res.status(400).json({ message: "Space id is required" });});
router.patch('/:id', updateSpaceStatus)

module.exports = router;