import {Router} from 'express'
import {getSpaces, getSpaceByName, getSpaceByStatus, createSpace, deleteSpace, updateSpace, updateSpaceStatus, countAllSpaces, countAllActiveSpaces, countAllInactiveSpaces, percentage} from '../controllers/space.controller.js'

const router = Router();

router.get('/', getSpaces)
router.get('/:name',getSpaceByName)
router.get('/:status',getSpaceByStatus)
router.post('/', createSpace)
router.delete('/:id', deleteSpace)
router.put('/:id', updateSpace)
router.put('/:id', updateSpaceStatus)
router.get('/', countAllSpaces)
router.get('/', countAllActiveSpaces)
router.get('/', countAllInactiveSpaces)
router.get('/', percentage)

export default router;