import axios from 'axios'

const BASE_URL = "http://127.0.0.1:3030/api/user/"

export const userService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter
}


async function query(filterBy = {}) {
    try {
        const { data: users } = await axios.get(BASE_URL, {params: filterBy})
        return users

    } catch (err) {
        console.log(err)
        throw err
    }
}

async function getById(userId) {
    try {
        const { data: user } = await axios.get(BASE_URL + userId)
        return user
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function remove(userId) {
    try {
        const { data: user } = await axios.delete(BASE_URL + userId)
        return user
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function save(user) {
    const method = user._id ? "put" : "post"

    try {
        const {data: savedUser} = await axios[method](BASE_URL + (user._id || ""), user)
        return savedUser
    } catch (err) {
        console.log(err)
        throw err
    }
}

function getDefaultFilter() {
    return { title: "", severity: "", labels: []}
}