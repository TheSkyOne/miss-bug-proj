
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import axios from 'axios'

const STORAGE_KEY = 'bugDB'
const BASE_URL = "http://127.0.0.1:3030/api/bug/"

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter
}


async function query(filterBy = {}) {
    try {
        const { data: bugs } = await axios.get(BASE_URL, {params: filterBy})
        return bugs

    } catch (err) {
        console.log(err)
        throw err
    }
}

async function getById(bugId) {
    try {
        const { data: bug } = await axios.get(BASE_URL + bugId)
        return bug
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function remove(bugId) {
    try {
        const { data: bug } = await axios.get(BASE_URL + bugId + "/remove")
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function save(bug) {
    try {
        const savedBug = await axios.get(BASE_URL + "save", { params: bug })
        return savedBug.data
    } catch (err) {
        console.log(err)
        throw err
    }
}

function getDefaultFilter() {
    return { title: "", severity: ""}
}