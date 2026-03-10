import {Router} from 'express'
import {getSpaces, getSpace, createSpace, deleteSpace, updateSpace} from '../controllers/space.controller.js'

const router = Router();

router.get('/', getSpaces)
router.get('/:id',getSpace)
router.post('/', createSpace)
router.delete('/:id', deleteSpace)
router.put('/:id', updateSpace)

export default router;