import express from 'express'
import { getUsers, getUser, updateUser, addUser, removeUser } from './user.controller.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/:userId', getUser)
router.put('/:userId', updateUser)
router.post('/', addUser)
router.delete('/:userId', removeUser)

export const userRoutes = router