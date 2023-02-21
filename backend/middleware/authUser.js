import users from "../models/userModel.js"

export const userVerify = async (req, res, next) => {
    const user = await users.findByPk(req.userId)
    if(user.role !== "employee"){
        res.status(401).json({
            message: "Anda bukan pegawai"
        })
    }else{
        next()
    }
}

export const adminVerify = async (req, res, next) => {
    const user = await users.findByPk(req.userId)
    if(user.role !== "admin"){
        res.status(401).json({
            message: "Anda bukan admin"
        })
    }else{
        next()
    }
}
