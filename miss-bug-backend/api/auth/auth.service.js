import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'
import { userService } from "../user/user.service.js"

const cryptr = new Cryptr(process.env.SECRET1 || "super-secret-password")

export const authService = {
    getLoginToken,
    validateToken,
    login,
    signup
}

function getLoginToken(user) {
    const str = JSON.stringify(user)
    const encryptedStr = cryptr.encrypt(str)
    return encryptedStr
}

function validateToken(token) {
    try {
        const json = cryptr.decrypt(token)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

async function signup({ username, password, fullname }) {
    const saltRounds = 10

    if (!username || !password || !fullname) throw Error("Missing required signup information")

    const userExists = await userService.getByUsername(username)
    console.log(userExists)
    if (userExists) throw Error("Username already taken")

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.save({ username, password: hash, fullname })
}

async function login(username, password) {
    var user = await userService.getByUsername(username)
    if (!user) throw Error("Unkown username")

    // const match = await bcrypt.compare(password, user.password)
    // if (!match) throw Error('Invalid username or password')

    const miniUser = {
        _id: user._id,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        score: user.score,
        isAdmin: user.isAdmin
    }
    return miniUser

}