const { Router } = require('express')
const {getSpaces, getSpaceByName, getSpaceByStatus, createSpace, deleteSpace, updateSpace, updateSpaceStatus, countAllSpaces,
  countAllActiveSpaces, countAllInactiveSpaces, percentage} = require('../controllers/space.controller.js');

const router = Router();

router.get('/', getSpaces)
router.get('/name/:name',getSpaceByName)
router.get('/status/:status',getSpaceByStatus)
router.post('/', createSpace)
router.delete('/:id', deleteSpace)
router.put('/:id', updateSpace)
router.patch('/:id', updateSpaceStatus)
router.get('/count/all', countAllSpaces)
router.get('/count/active', countAllActiveSpaces)
router.get('/count/inactive', countAllInactiveSpaces)
router.get('/percentage', percentage)

module.exports = router;
