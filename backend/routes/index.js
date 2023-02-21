import express from "express"
import { getUsers, 
        register, 
        login, 
        logout,
        getUsersById,
        updateUsers,
        deleteUsers 
    } from "../controller/user.js" 
import { verifyToken } from "../middleware/verifyToken.js"
import { refreshToken } from "../controller/refreshToken.js"
import { userVerify } from "../middleware/authUser.js"

const router = express.Router()

router.get('/users',verifyToken, userVerify, getUsers)
router.patch('/users/update/:id',verifyToken, userVerify, updateUsers)
router.get('/users/:id',verifyToken, userVerify, getUsersById)
router.delete('/users/delete/:id', deleteUsers)
router.post('/register', register)
router.post('/login', login)
router.get('/token', refreshToken)
router.delete('/logout', logout)

export default router