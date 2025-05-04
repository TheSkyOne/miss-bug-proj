import express from 'express'
import { getUsers, getUser, updateUser, addUser, removeUser } from './user.controller.js'
import { requireAdmin } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/:userId', getUser)
router.put('/:userId', requireAdmin, updateUser)
router.post('/', addUser)
router.delete('/:userId', requireAdmin, removeUser)

export const userRoutes = router