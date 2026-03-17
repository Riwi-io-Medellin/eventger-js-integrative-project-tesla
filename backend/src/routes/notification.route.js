const {Router} = require('express')
const {webNotificationsByUserCont, read}= require('../controllers/notification.controller.js');

const router = Router();

// Get all notifications
router.get('/', (req, res) => {res.status(400).json({ message: "User id is required" });});
router.get('/:id', webNotificationsByUserCont)

// Change status of a notification
router.patch('/', (req, res) => {res.status(400).json({ message: "User id is required" });});
router.patch('/:id', read)

module.exports = router