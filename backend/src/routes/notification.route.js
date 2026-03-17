const {Router} = require('express')
const {webNotificationsByUserCont}= require('../controllers/notification.controller.js');

const router = Router();

router.get('/', (req, res) => {res.status(400).json({ message: "User id is required" });});
router.get('/:id', webNotificationsByUserCont)

module.exports = router