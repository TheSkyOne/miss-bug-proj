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


//* bugs crudl
app.get('/api/bug', async (req, res) => {
    console.log(req.query)
    const filterBy = {
        title: req.query.title,
        severity: +req.query.severity
    }
    try {
        const bugs = await bugsService.query(filterBy)
        res.send(bugs)
    } catch (err) {
        console.log("err: ", err)
        res.status(400).send("couldn't get bugs")
    }
})

app.get('/api/bug/save', async (req, res) => {
    const bugToSave = {
        _id: req.query._id,
        title: req.query.title,
        description: req.query.description,
        severity: +req.query.severity,
        createdAt: +req.query.createdAt
    }
    try {
        const savedBug = await bugsService.save(bugToSave)
        res.send(savedBug)
    } catch (err) {
        console.log("err: ", err)
        res.status(400).send("couldn't save bug")
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

app.get('/api/bug/:bugId/remove', async (req, res) => {
    const { bugId } = req.params
    try {
        await bugsService.remove(bugId)
        res.send("OK")
    } catch (err) {
        console.log(err)
        res.status(400).send("couldnt remove bug")
    }
})


app.get("/", (req, res) => {
    res.send("Welcome!")

})
