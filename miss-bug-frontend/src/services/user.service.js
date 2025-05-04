import Axios from 'axios'

const axios = Axios.create({ withCredentials: true })

const STORAGE_KEY_LOGGEDIN_USER = "loggedinUser"

const BASE_URL = (process.env.NODE_ENV !== "development")
    ? "/api/"
    : "http://127.0.0.1:3030/api/"

const BASE_USER_URL = BASE_URL + "user/"
const BASE_AUTH_URL = BASE_URL + "auth/"

export const userService = {
    query,
    getById,
    save,
    remove,
    signup,
    login,
    logout,
    getDefaultFilter,
    getUsers,
    getLoggedinUser,
    getEmptyUser,
    isLoggedinUserAdmin
}


async function query(filterBy = {}) {
    try {
        const { data: users } = await axios.get(BASE_USER_URL, {params: filterBy})
        return users

    } catch (err) {
        console.log(err)
        throw err
    }
}

async function getById(userId) {
    try {
        const { data: user } = await axios.get(BASE_USER_URL + userId)
        return user
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function remove(userId) {
    try {
        const { data: user } = await axios.delete(BASE_USER_URL + userId)
        return user
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function save(user) {
    const method = user._id ? "put" : "post"

    try {
        const {data: savedUser} = await axios[method](BASE_USER_URL + (user._id || ""), user)
        return savedUser
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function signup(credentials) {
    const { data: user } = await axios.post(BASE_AUTH_URL + "signup", credentials)
    return _saveLocalUser(user)
}

async function login(credentials) {
    const { data: user } = await axios.post(BASE_AUTH_URL + "login", credentials)
    if (user) {
        return _saveLocalUser(user)
    }
}

async function logout() {
    await axios.post(BASE_AUTH_URL + "logout")
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getDefaultFilter() {
    return { title: "", severity: "", labels: []}
}

async function getUsers() {
    try {
        const { data: users } = await axios.get(BASE_USER_URL)
        return users
    } catch (err) {
        console.log("couldnt get users, err: ", err)
        throw err
    }
}

function getEmptyUser() {
    return {
        username: "",
        fullname: "",
        password: "",
        imgUrl: "",
    }
}

function _saveLocalUser(user) {
    user = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin}

    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function isLoggedinUserAdmin() {
    return getLoggedinUser()?.isAdmin
}