import { bugsService } from "./bug.service.js"

export async function getBugs(req, res) {
    const filterBy = {
        title: req.query.title,
        severity: +req.query.severity,
        labels: req.query['labels[]'] || req.query.labels,
        pageIdx: +req.query.pageIdx,
        creator: req.query.creator
    }

    try {
        const bugs = await bugsService.query(filterBy)
        res.send(bugs)
    } catch (err) {
        console.log("err: ", err)
        res.status(400).send("couldn't get bugs")
    }
}

export async function getBug(req, res) {
    let visitedBugs = req.cookies.visitedBugs || []
    const { bugId } = req.params
    try {
        if (visitedBugs.length >= 3) return res.status(401).send("Wait for a bit")
        if (!visitedBugs.includes(bugId)) {
            visitedBugs.push(bugId)
            res.cookie("visitedBugs", visitedBugs, { maxAge: 1000 * 7 })
        }
        
        const bug = await bugsService.getById(bugId)
        res.send(bug)
    } catch (err) {
        console.log("err: ", err)
        res.status(400).send("couldn't get bug")
    }
}

export async function updateBug(req, res) {
    const bugToSave = {
        _id: req.body._id || req.params.bugId,
        title: req.body.title,
        description: req.body.description,
        severity: +req.body.severity,
        createdAt: +req.body.createdAt,
        labels: req.body.labels,
        creator: req.body.creator
    }

    const loggedInUser = req.loggedInUser

    try {
        if (!loggedInUser?.isAdmin && bugToSave.creator._id !== loggedInUser?._id) throw "Unauthorized to update this bug"

        const savedBug = await bugsService.save(bugToSave)
        res.send(savedBug)
    } catch (err) {
        console.log("err: ", err)
        res.status(400).send("couldn't update bug")
    }
}

export async function addBug(req, res) {
    const bugToSave = {
        title: req.body.title,
        description: req.body.description,
        severity: +req.body.severity,
        createdAt: +req.body.createdAt,
        labels: req.body.labels,
        creator: req.body.creator
    }
    try {
        const savedBug = await bugsService.save(bugToSave)
        res.send(savedBug)
    } catch (err) {
        console.log("err: ", err)
        res.status(400).send("couldn't save bug")
    }
}

export async function removeBug(req, res) {
    const { bugId } = req.params
    const bug = await bugsService.getById(bugId)
    const loggedInUser = req.loggedInUser

    try {
        if (!loggedInUser?.isAdmin && bug.creator._id !== loggedInUser?._id) throw "Unauthorized to delete this bug"

        await bugsService.remove(bugId)
        res.send("OK")
    } catch (err) {
        console.log("err: ", err)
        res.status(400).send("couldnt remove bug")
    }
}