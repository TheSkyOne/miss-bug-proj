import { makeId, readJsonFile, writeJsonFile } from "../../services/utils.js";

export const userService = {
    query,
    getById,
    remove,
    save,
    getByUsername
}

const users = readJsonFile("./data/users.json")

async function query(filterBy) {
    let usersToDisplay = users
    try {
        return usersToDisplay
        
    } catch (err) {
        throw err
    }
}

async function getById(userId) {
    try {
        const user = users.find(user => user._id === userId)
        if (!user) throw new Error("Could not find user")
        return user
    } catch (err) {
        throw err
    }
}

async function remove(userId) {
    try {
        const userIdx = users.findIndex(user => user._id === userId)
        if (userIdx === -1) throw Error("Cant find user")
        users.splice(userIdx, 1)
        await _saveUsersToFile()
    } catch (err) {
        throw err
    }
}

async function save(userToSave) {
    try {
        if (userToSave._id) {
            const userIdx = users.findIndex(user => user._id === userToSave._id)
            if (userIdx === -1) throw Error("Cant find user")
            users[userIdx] = {...users[userIdx], ...userToSave}
        } else {
            userToSave._id = makeId()
            userToSave.score = 100
            userToSave.createdAt = Date.now()
            if (!userToSave.imgUrl) userToSave.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
            users.push(userToSave)
        }

        await _saveUsersToFile()
        return userToSave
    } catch (err) {
        throw err
    }
}

function getByUsername(username) {
    return users.find(user => user.username === username)
}

function _saveUsersToFile() {
    return writeJsonFile("./data/users.json", users)
}