import users from "../models/userModel.js"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const user = await users.findAll({
      attributes: ['nama', 'email', 'no_telepon', 'jenis_kelamin', 'role']
      });
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

export const getUsersById = async(req, res) => {
  try{ 
      const response = await users.findOne({
          where: {
              id: req.params.id
          },
          attributes: ['nama', 'email', 'no_telepon', 'jenis_kelamin', 'role']
      })
      res.status(200).json(response)
  }catch (error){
      res.status(500).json({
          message: error.message
      })
  }
}

export const updateUsers = async(req, res) => {
  const user = await users.findOne({
      where: {
          id: req.params.id
      }
  })

  if(!user){
      return res.status(404).json({
          message: "User tidak ditemukan"
      })
  }
  const {nama, email, password, confPassword, no_telepon, jenis_kelamin, role} = req.body 
  let hashPassword
  if(password  === "" || password === null){
      hashPassword = user.password
  }

  if(password !== confPassword){
      return res.status(400).json({
          message: "Password dan Confirm Password tidak cocok  "
      })
  }

  try{
      await users.update({
          nama: nama,
          email: email,
          password: hashPassword,
          no_telepon: no_telepon,
          jenis_kelamin: jenis_kelamin,
          role: role
      }, {
          where:{
              id: user.id
          }
      })
      res.status(201).json({
          message: "User updated"
      })
  }catch (error){
      res.status(400).json({
          message: error.message
      })
  }
}

export const deleteUsers = async (req, res) => {
  const user = await users.findOne({
      where: {
          id: req.params.id
      }
  })

  if(!user){
      return res.status(404).json({
          message: "User tidak ditemukan"
      })
  }

  try{
      await users.destroy({
          where:{
              id: user.id
          }
      })
      res.status(200).json({
          message: "User deleted"
      })
  }catch (error){
      res.status(400).json({
          message: error.message
      })
  }
}

export const register = async (req, res) => {
  const { nama,  email, password, confPassword, no_telepon, jenis_kelamin, role } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ message: "Password dan Confrim tidak cocok" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await users.create({
            nama: nama,
            email: email,
            password: hashPassword,
            no_telepon: no_telepon,
            jenis_kelamin: jenis_kelamin,
            role: role
    });
    res.json({
      message: "register berhasil!",
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email: reqEmail, password: reqPassword } = req.body;

    // req.body.email

      const user = await users.findOne({
      where: {
        email: reqEmail,
      },
    });
    const { id, name, email, password } = user;

    const match = await bcrypt.compare(reqPassword, password);
    if (!match) return res.status(400).json({ message: "User not found!" });
    const accessToken = jwt.sign(
      { id, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );
    const refreshToken = jwt.sign(
      { id, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "email tidak ditemukan",
    });
  }
};

export const logout = async(req, res) => {
  const refreshToken = req.cookies.refreshToken
  if(!refreshToken) return res.sendStatus(204)
        const user = await users.findAll({
            where: {
                refresh_token: refreshToken
            }
        })
        if(!user[0]) return res.sendStatus(204)
        const userId = user[0].id
        await users.update({refresh_token: null},{
          where:{
            id: userId
          }
        }) 
        res.clearCookie('refreshToken')
        return res.sendStatus(200)
}
