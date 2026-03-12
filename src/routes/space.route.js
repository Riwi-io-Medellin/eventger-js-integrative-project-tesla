const { Router } = require('express')
const {getSpaces, createSpace, deleteSpace, updateSpace, updateSpaceStatus} = require('../controllers/space.controller.js');

const router = Router();

router.get('/', getSpaces)
router.post('/', createSpace)
router.delete('/:id', deleteSpace)
router.put('/:id', updateSpace)
router.patch('/:id', updateSpaceStatus)

module.exports = router;
