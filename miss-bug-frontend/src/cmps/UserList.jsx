import { UserPreview } from "./UserPreview"

export function UserList({ users, onRemoveUser, onEditUser }) {
    console.log(users)
    return (
        <ul className="user-list">
            {users.map(user => (
                <li className="user-preview" key={user._id}>
                    <UserPreview user={user} />
                    <button onClick={() => onEditUser(user)}>Edit</button>
                    <button onClick={() => onRemoveUser(user._id)}>X</button>
                </li>
            ))}
        </ul>
    )
}