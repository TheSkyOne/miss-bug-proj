import { useState } from 'react'
import { useEffect } from 'react'
import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { userService } from '../services/user.service.js'


export function BugIndex() {
    const [bugs, setBugs] = useState([])
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())


    useEffect(() => {
        loadBugs()
    }, [filterBy])

    async function loadBugs() {
        const bugs = await bugService.query(filterBy)
        setBugs(bugs)
    }

    async function onRemoveBug(bugId) {
        try {
            await bugService.remove(bugId)
            console.log('Deleted Succesfully!')
            setBugs(prevBugs => prevBugs.filter(bug => bug._id !== bugId))
            showSuccessMsg('Bug removed')
        } catch (err) {
            console.log('Error from onRemoveBug ->', err)
            showErrorMsg('Cannot remove bug')
        }
    }

    async function onAddBug() {
        const loggedInUser = userService.getLoggedinUser()
        const bug = {
            title: prompt('Bug title?'),
            description: prompt('Bug description:') || "default description",
            severity: +prompt('Bug severity?'),
            createdAt: Date.now(),
            creator: {
                _id: loggedInUser?._id || "",
                fullname: loggedInUser?.fullname || "all"
            }
        }
        try {
            const savedBug = await bugService.save(bug)
            console.log('Added Bug', savedBug)
            setBugs(prevBugs => [savedBug, ...prevBugs])
            showSuccessMsg('Bug added')
        } catch (err) {
            console.log('Error from onAddBug ->', err)
            showErrorMsg('Cannot add bug')
        }
    }

    async function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        try {
            const savedBug = await bugService.save(bugToSave)
            console.log('Updated Bug:', savedBug)
            setBugs(prevBugs => prevBugs.map((currBug) =>
                currBug._id === savedBug._id ? savedBug : currBug
            ))
            showSuccessMsg('Bug updated')
        } catch (err) {
            console.log('Error from onEditBug ->', err)
            showErrorMsg('Cannot update bug')
        }
    }

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    return (
        <section >
            <h3>Bugs App</h3>
            <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
            <main>
                <button onClick={onAddBug}>Add Bug ⛐</button>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
        </section>
    )
}
