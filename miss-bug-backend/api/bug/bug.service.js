import { makeId, readJsonFile, writeJsonFile } from "../../services/utils.js";

export const bugsService = {
    query,
    getById,
    remove,
    save
}

const PAGE_SIZE = 2
const bugs = readJsonFile("./data/bugs.json")
const bugLabels = ["critical", "need-CR", "dev-branch"]

async function query(filterBy) {
    let bugsToDisplay = bugs
    try {
        if (filterBy.title) {
            const regExp = new RegExp(filterBy.title, 'i')
            bugsToDisplay = bugsToDisplay.filter(bug => regExp.test(bug.title))
        }

        if (filterBy.severity) {
            bugsToDisplay = bugsToDisplay.filter(bug => bug.severity >= filterBy.severity)
        }

        if (filterBy.labels) {
            bugsToDisplay = bugsToDisplay.filter(bug => 
                bug.labels.some(label => 
                    filterBy.labels.includes(label)
                )
            )
        }

        if (filterBy.creator) {
            bugsToDisplay = bugsToDisplay.filter(bug => bug.creator._id === filterBy.creator._id)
        }

        if (filterBy.pageIdx || filterBy.pageIdx === 0){
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            bugsToDisplay = bugsToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
        }

        return bugsToDisplay
        
    } catch (err) {
        throw err
    }
}

async function getById(bugId) {
    try {
        const bug = bugs.find(bug => bug._id === bugId)
        if (!bug) throw new Error("Could not find bug")
        return bug
    } catch (err) {
        throw err
    }
}

async function remove(bugId) {
    try {
        const bugIdx = bugs.findIndex(bug => bug._id === bugId)
        if (bugIdx === -1) throw Error("Cant find bug")
        bugs.splice(bugIdx, 1)
        await saveBugsToFile()
    } catch (err) {
        throw err
    }
}

async function save(bugToSave) {
    try {
        if (!bugToSave.labels) bugToSave.labels = [pickLabel()]
        if (bugToSave._id) {
            const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (bugIdx === -1) throw Error("Cant find bug")
            bugs[bugIdx] = bugToSave
        } else {
            bugToSave._id = makeId()
            bugs.unshift(bugToSave)
        }
        await saveBugsToFile()
        return bugToSave
    } catch (err) {
        console.log("error saving bug, err:", err)
        throw err
    }
}

function pickLabel() {
    return bugLabels[Math.floor(Math.random() * bugLabels.length)]
}


function saveBugsToFile() {
    return writeJsonFile("./data/bugs.json", bugs)
}