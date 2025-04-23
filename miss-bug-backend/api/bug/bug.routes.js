import express from 'express'
import { getBugs, getBug, updateBug, addBug, removeBug } from './bug.controller.js'

const router = express.Router()

router.get('/', getBugs)
router.get('/:bugId', getBug)
router.put('/:bugId', updateBug)
router.post('/', addBug)
router.delete('/:bugId', removeBug)

export const bugRoutes = router