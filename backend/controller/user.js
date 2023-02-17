import users from "../models/userModel.js"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const user = await users.findAll({
      attributes:['id', 'name', 'email']
    });
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

export const register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ message: "Password dan Confrim tidak cocok" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await users.create({
      name: name,
      email: email,
      password: hashPassword,
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

    console.log(reqEmail);
    const user = await users.findOne({
      where: {
        email: reqEmail,
      },
    });
    const { id, name, email, password } = user;

    console.log(user.id);
    const match = await bcrypt.compare(reqPassword, password);
    if (!match) return res.status(400).json({ message: "User not found!" });
    console.log(match);
    // res.body({ user: JSON.stringify(user) });
    // const userId = user[0].id;
    // const name = user[0].name;
    // const email = user[0].email;
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