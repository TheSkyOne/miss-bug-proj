import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { bugRoutes } from "./api/bug/bug.routes.js"
import { userRoutes } from "./api/user/user.routes.js"
import { authRoutes } from "./api/auth/auth.routes.js"


const app = express()

if (process.env.NODE_ENV === "production") {
    app.use(express.static("public"))
} else {
    const corsOptions = {
        origin: [
            "http://127.0.0.1:5173",
            "http://localhost:5173"
        ],
        credentials: true
    }
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use("/api/bug", bugRoutes)
app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)

const PORT = process.env.PORT || 3030
app.listen(PORT, () => console.log(`Server ready at port ${PORT}`))