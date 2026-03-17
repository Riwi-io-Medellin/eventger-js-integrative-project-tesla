const { Router } = require('express')
const { getEventsByUser} = require('../controllers/profile.controller.js');

const router = Router();

// Get all events of the user
router.get('/', (req, res) => {res.status(400).json({ message: "User id is required" });});
router.get('/:id', getEventsByUser)

module.exports = router;