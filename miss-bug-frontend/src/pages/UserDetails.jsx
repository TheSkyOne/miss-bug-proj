import { useEffect, useState } from "react"
import { userService } from "../services/user.service"
import { useLocation, useParams } from "react-router"
import { showErrorMsg } from "../services/event-bus.service"
import { bugService } from "../services/bug.service"
import { BugList } from "../cmps/BugList"

export function UserDetails() {
    const [user, setUser] = useState(null)
    const { userId } = useParams()
    const location = useLocation()
    const [loggedInUser, setLoggedInUser] = useState(userService.getLoggedinUser())
    const [userBugs, setUserBugs] = useState([])

    useEffect(() => {
        const intervalId = setInterval(() => {
            const result = userService.getLoggedinUser()
            setLoggedInUser(result)
        }, 100)

        return () => clearInterval(intervalId)
    }, [])

    useEffect(() => {
        loadUser()
    }, [loggedInUser])

    useEffect(() => {
        loadBugs()
    }, [user?._id])

    async function loadUser() {
        try {
            let user
            if (location.pathname === "/profile") {
                if (!loggedInUser) {
                    showErrorMsg("Please login first")
                    setUser(null)
                    return
                }
                user = await userService.getById(loggedInUser._id)
            } else {
                user = await userService.getById(userId)
            }
            setUser(user)
        } catch (err) {
            showErrorMsg("Cannot load user")
        }
    }

    async function loadBugs() {
        if (user) {
            try {
                const bugsFilter = { creator: { _id: user._id } }
                const bugs = await bugService.query(bugsFilter)
                setUserBugs(bugs)
            } catch (err) {
                console.log("log in to see user's bugs")
            }
        }
    }

    if (!user) {
        if (location.pathname === "/profile") return <h3>Log-in first</h3>
        return <h3>Loading...</h3>
    }

    return (
        <section className="user-details">
            <h1>{user.fullname}</h1>
            <h2>My Bugs:</h2>
            {(userBugs.length > 0 && <BugList bugs={userBugs} />) || <h4>No bugs to display...</h4>}
        </section>
    )
}