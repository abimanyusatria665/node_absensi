import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.status(401).json({msg: "Silahkan isi token teerlebih dahulu" })
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) return res.status(403).json({message: "Token anda salah"})
        req.userId = decoded.id
        next()
    })
}


