import { useEffect, useState } from "react"
import { userService } from "../services/user.service"
import { UserList } from "../cmps/UserList"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service"
import { bugService } from "../services/bug.service"

export function UserIndex() {
    const [users, setUsers] = useState()

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        try {
            const users = await userService.query()
            setUsers(users)
        } catch (err) {
            console.log("could not load users, err:", err)
        }
    }

    async function onAddUser() {
        const newUser = {
            fullname: prompt("enter user full name", "fullname"),
            username: prompt("enter username for login"),
            password: prompt("set your password")
        }
        try {
            const savedUser = await userService.save(newUser)
            setUsers(prevUsers => [...prevUsers, savedUser])
            showSuccessMsg("User Added")
        } catch (err) {
            console.log("error on adding user: ", err)
            showErrorMsg("Cannot add user")
        }
    }

    async function onRemoveUser(userId) {
        const userOwnedBugs = await bugService.query({ creator: { _id: userId } })
        if (userOwnedBugs.length !== 0) {
            showErrorMsg("Cant delete user, they own bugs!")
            return
        }

        const confirmRemove = confirm("are you sure you want to remove this user?")
        if (!confirmRemove) {
            showErrorMsg("User removal canceled")
            return
        }

        try {
            await userService.remove(userId)
            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId))
            showSuccessMsg("User removed")
        } catch (err) {
            console.log("error removing user: ", err)
            showErrorMsg("Cannot remove user")
        }
    }

    async function onEditUser(user) {
        const fullname = prompt("enter new full name")
        const userToSave = { ...user, fullname }
        try {
            const savedUser = await userService.save(userToSave)
            setUsers(prevUsers => prevUsers.map(currUser =>
                currUser._id === savedUser._id ? savedUser : currUser
            ))
            showSuccessMsg("User updated")
        } catch (err) {
            console.log("error editing user: ", err)
            showErrorMsg("Cannot update user")
        }
    }

    if (!users) return <p>Loading users...</p>
    return (
        <section className="user-index">
            <h2>Manage Users:</h2>
            <button onClick={onAddUser}>Add User</button>
            <UserList users={users} onRemoveUser={onRemoveUser} onEditUser={onEditUser} />
        </section>
    )
}