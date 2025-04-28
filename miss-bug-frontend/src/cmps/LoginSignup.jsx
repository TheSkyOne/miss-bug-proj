import { useEffect, useState } from "react"
import { userService } from "../services/user.service"

export function LoginSignup({ onLogin, onSignup }) {
    const [isSignup, setIsSignup] = useState(true)
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const [users, setUsers] = useState([])

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        try {
            const users = await userService.getUsers()
            setUsers(users)
        } catch (err) {
            console.error(err)
        }
    }

    function onModeChange() {
        setIsSignup(prevState => !prevState)
    }

    function handleChange({ target }) {
        const field = target.name
        const value = target.value
        setCredentials({ ...credentials, [field]: value })
    }

    async function onSubmitForm(ev = null) {
        if (ev) ev.preventDefault()
        if (isSignup) {
            if (!credentials.username || !credentials.password || !credentials.fullname) return
            await onSignup(credentials)
        } else {
            if (!credentials.username) return
            await onLogin(credentials)
        }
        clearState()
    }

    function clearState() {
        setCredentials(userService.getEmptyUser())
        setIsSignup(false)
    }

    const label = isSignup ? "Login" : "Signup"
    return (
        <div className="login-signup">
            <button onClick={onModeChange}>{label}</button>
            {
                isSignup && <SignupForm credentials={credentials} handleChange={handleChange} /> ||
                !isSignup &&
                <form className="login-form" onSubmit={onSubmitForm}>
                    <select
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                    >
                        <option value="">Select User</option>
                        {users.map(user => <option key={user._id} value={user.username}>{user.fullname}</option>)}
                    </select>
                    <button>Login!</button>
                </form>
            }
        </div>
    )
}

function SignupForm({ credentials, handleChange }) {
    return (
        <form className="signup-form">
            <input
                type="text"
                name="fullname"
                value={credentials.fullname}
                placeholder="Fullname"
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="username"
                value={credentials.username}
                placeholder="Username"
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                value={credentials.password}
                placeholder="Password"
                onChange={handleChange}
                required
            />
            <button >Signup!</button>
        </form>
    )
}