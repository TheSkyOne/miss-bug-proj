import { userService } from "./user.service.js"

export async function getUsers(req, res) {
    const filterBy = {}

    try {
        const users = await userService.query(filterBy)
        res.send(users)
    } catch (err) {
        console.log("err: ", err)
        res.status(400).send("couldn't get users")
    }
}

export async function getUser(req, res) {
    const { userId } = req.params
    try {
        const user = await userService.getById(userId)
        res.send(user)
    } catch (err) {
        console.log("err: ", err)
        res.status(400).send("couldn't get user")
    }
}

export async function updateUser(req, res) {
    const userToSave = {
        _id: req.body._id || req.params.userId,
        fullname: req.body.fullname,
        username: req.body.username,
        password: req.body.password,
        score: req.body.score
    }
    console.log(userToSave)
    try {
        const savedUser = await userService.save(userToSave)
        res.send(savedUser)
    } catch (err) {
        console.log("err: ", err)
        res.status(400).send("couldn't update user")
    }
}

export async function addUser(req, res) {
    const userToSave = {
        fullname: req.body.fullname,
        username: req.body.username,
        password: req.body.password,
        score: req.body.score
    }
    try {
        const savedUser = await userService.save(userToSave)
        res.send(savedUser)
    } catch (err) {
        console.log("err: ", err)
        res.status(400).send("couldn't save user")
    }
}

export async function removeUser(req, res) {
    const { userId } = req.params
    try {
        await userService.remove(userId)
        res.send("OK")
    } catch (err) {
        console.log(err)
        res.status(400).send("couldnt remove user")
    }
}