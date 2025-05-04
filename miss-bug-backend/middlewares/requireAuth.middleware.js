import { authService } from "../api/auth/auth.service.js"

export function requireAuth(req, res, next) {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send("Must be logged-in")
    req.loggedinUser = loggedinUser
    next()
}

export function requireAdmin(req, res, next) {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send("Must be logged-in")
    req.loggedinUser = loggedinUser
    if (!loggedinUser.isAdmin) return res.status(403).send("Must be Admin")
    next()
}