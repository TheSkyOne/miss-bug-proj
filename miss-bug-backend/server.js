import express from "express"
import cors from "cors"
import { bugsService } from "./services/bugs.service.js"


const app = express()
app.listen(3030, () => console.log("Server ready at port 3030"))

const corsOptions = {
    origin: [
        "http://127.0.0.1:5173",
        "http://localhost:5173"
    ],
    credentials: true
}
app.use(cors(corsOptions))
app.use(express.static("public"))
app.use(express.json())


//* bugs crudl

app.get('/api/bug', async (req, res) => {
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
})

app.get('/api/bug/:bugId', async (req, res) => {
    const { bugId } = req.params
    try {
        const bug = await bugsService.getById(bugId)
        res.send(bug)
    } catch (err) {
        console.log("err: ", err)
        res.status(400).send("couldn't get bug")
    }
})

app.put('/api/bug/:bugId', async (req, res) => {
    const bugToSave = {
        _id: req.body._id,
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
})

app.post('/api/bug', async (req, res) => {
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
})

app.delete('/api/bug/:bugId', async (req, res) => {
    const { bugId } = req.params
    try {
        await bugsService.remove(bugId)
        res.send("OK")
    } catch (err) {
        console.log(err)
        res.status(400).send("couldnt remove bug")
    }
})