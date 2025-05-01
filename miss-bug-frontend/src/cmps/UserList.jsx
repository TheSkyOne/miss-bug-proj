import { Link } from "react-router-dom"
import { UserPreview } from "./UserPreview"

export function UserList({ users, onRemoveUser, onEditUser }) {
    return (
        <ul className="user-list">
            {users.map(user => (
                <li className="user-preview" key={user._id}>
                    <UserPreview user={user} />
                    <Link to={`/user/${user._id}`} className="link">Details</Link>
                    <button onClick={() => onEditUser(user)}>Edit</button>
                    <button onClick={() => onRemoveUser(user._id)}>X</button>
                </li>
            ))}
        </ul>
    )
}