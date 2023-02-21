import express from "express"
import db from "./config/database.js"
import session from "express-session"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import router from "./routes/index.js"
dotenv.config()
const app = express()


app.use(session({
    secret: process.env.ACCESS_TOKEN_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: 'auto'
    }
}))
app.use(cookieParser())
app.use(express.json())

app.use(router)
app.listen(4000, () => console.log('Server running at 4000'))