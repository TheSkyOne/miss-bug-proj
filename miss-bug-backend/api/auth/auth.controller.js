import { authService } from "./auth.service.js"

export async function userSignup(req, res) {
    try {
        const credentials = req.body
        await authService.signup(credentials)
        const user = await authService.login(credentials.username, credentials.password)
        const loginToken = authService.getLoginToken(user)
        res.cookie("loginToken", loginToken, { sameSite: "None", secure: true })
        res.json(user)
    } catch (err) {
        res.status(400).send({ err: "Failed to signup" })
    }
}

export async function userLogin(req, res) {
    const { username, password } = req.body
    try {
        const user = await authService.login(username, password)
        const loginToken = authService.getLoginToken(user)
        res.cookie("loginToken", loginToken, { sameSite: "None", secure: true })
        res.json(user)
    } catch (err) {
        res.status(401).send({ err: "Failed to Login" })
    }
}


export async function userLogout(req, res) {
    try {
        res.clearCookie("loginToken")
        res.send({ msg: "Logged out successfully" })
    } catch (err) {
        res.status(400).send({ err: "Failed to logout" })
    }
}