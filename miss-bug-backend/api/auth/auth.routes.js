import express from 'express'
import { userSignup, userLogin, userLogout } from './auth.controller.js'

const router = express.Router()

router.post("/signup", userSignup)
router.post("/login", userLogin)
router.post("/logout", userLogout)

export const authRoutes = router