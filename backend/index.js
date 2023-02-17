import express from "express"
import db from "./config/database.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import router from "./routes/index.js"
import users from "./models/userModel.js"
dotenv.config()
const app = express()

try{

    await users.sync()
}catch(error){
    console.log(error)
}

app.use(cookieParser())
app.use(express.json())

app.use(router)
app.listen(4000, () => console.log('Server running at 4000'))