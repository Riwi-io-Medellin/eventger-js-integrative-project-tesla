const {Router} = require('express')
const {webNotificationsByUserCont}= require('../controllers/notification.controller.js');

const router = Router();

router.get('/:id', webNotificationsByUserCont)

module.exports = router