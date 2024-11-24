const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
dotenv.config();

const createToken = (id) => {
  return jwt.sign(id, process.env.TOKEN_SECRET);
};

const decodeToken = (token) => {};

const encryptPassword = (password) => {};

const descryptPassword = (userpassword, dbPassword) => {};

const insertDB = async (data, fileName) => {
   const filePath = path.join(__dirname, `../models/${fileName}.json`);
   await fs.writeFile(filePath, JSON.stringify(data));
};


module.exports = {
  createToken,
  decodeToken,
  encryptPassword,
  descryptPassword,
  insertDB
};
