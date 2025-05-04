import express from 'express'
import { getBugs, getBug, updateBug, addBug, removeBug } from './bug.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/', getBugs)
router.get('/:bugId', getBug)
router.put('/:bugId', requireAuth, updateBug)
router.post('/', requireAuth, addBug)
router.delete('/:bugId', requireAuth, removeBug)

export const bugRoutes = router