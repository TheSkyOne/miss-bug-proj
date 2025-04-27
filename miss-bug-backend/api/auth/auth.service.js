import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'
import { userService } from "../user/user.service"

const cryptr = new Cryptr(process.env.SECRET1 || "super-secret-password")

export const authService = {
    getLoginToken,
    login,
    signup
}

function getLoginToken(user) {
    const str = JSON.stringify(user)
    const encryptedStr = cryptr.encrypt(str)
    return encryptedStr
}

async function signup({ username, password, fullname }) {
    const saltRounds = 10

    if (!username || !password || !fullname) throw 'Missing required signup information'

    const userExists = await userService.getByUsername(username)
    if (userExists) throw 'Username already taken'

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.save({ username, password: hash, fullname })
}

async function login(username, password) {
    var userExists = await userService.getByUsername(username)
    if (!userExists) throw 'Unkown username'

    const match = await bcrypt.compare(password, user.password)
    if (!match) throw 'Invalid username or password'

    const miniUser = {
        _id: user._id,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        score: user.score,
    }
    return miniUser

}