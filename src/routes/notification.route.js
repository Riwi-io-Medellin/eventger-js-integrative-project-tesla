const {Router} = require('express')
const {emailNot}= require('../controllers/notification.controller.js');

const router = Router();

router.get('/', emailNot)