import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const users = db.define(
  "users",
  {
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
          notEmpty: true,
          len:[3, 100]    
      }
  },
  email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
          notEmpty: true,
          isEmail: true
      }
  },
  password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
          notEmpty: true,
          len:[8, 100]
      }
  },
  role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
          notEmpty: true
      }
  },
  no_telepon: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
          notEmpty: true,
          len: [12, 100]
      }
  },
  jenis_kelamin: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
          notEmpty: true
      }
  },
  refresh_token: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  freezeTableName: true
})

export default users