import express from 'express'
import { userLogin, userSignup } from './auth.controller'

const router = express.Router()

router.get("/login", userLogin)
router.post("/signup", userSignup)

export const authRoutes = router