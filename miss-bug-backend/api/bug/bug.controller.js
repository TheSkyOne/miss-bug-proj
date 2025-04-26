import { bugsService } from "./bug.service.js"

export async function getBugs(req, res) {
    const filterBy = {
        title: req.query.title,
        severity: +req.query.severity,
        labels: req.query['labels[]'] || req.query.labels,
        pageIdx: +req.query.pageIdx
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
    const { bugId } = req.params
    try {
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
        labels: req.body.labels
    }
    try {
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
        labels: req.body.labels
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
    try {
        await bugsService.remove(bugId)
        res.send("OK")
    } catch (err) {
        console.log(err)
        res.status(400).send("couldnt remove bug")
    }
}