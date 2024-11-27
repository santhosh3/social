const { findEmail, InsertUser, getUserByEmail } = require("../models");
const { createToken } = require("../utils");
const bcrypt = require("bcryptjs");
const {users} = require("../models")


function isValid(body) {
    return (Object.keys(body).length < 0) ? true : false
}

const RegisterUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (isValid(req.body)) {
            return res.status(400).json({ status: false, message: "body is missing" })
        }
        if (!username || !email || !password) {
            return res.status(400).json({ status: false, message: "fields are missing" })
        }
        if (findEmail(email)) {
            return res.status(400).json({ status: false, message: "user already present please login" })
        }
        let result = await InsertUser({ username, email, password });

        return res.status(201).json({ status: true, message: { ...result, token: createToken(result?.id) } });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (isValid(req.body)) {
            return res.status(400).json({ status: false, message: "body is missing" })
        }
        if (!email || !password) {
            return res.status(400).json({ status: false, message: "fields are missing" })
        }
        if (!findEmail(email)) {
            return res.status(400).json({ status: false, message: "user not found please register" })
        }
        const user = getUserByEmail(email);
        if (await bcrypt.compare(password, user.password)) {
            return res.status(200).json({ status: true, token: createToken(user?.id) })
        } else {
            return res.status(401).json({ status: false, message: "Unauthorized access" }) 
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}


//auth

const showUsers = async(req, res) => {
    try {
        let user = req.user.id;
        const showUser = await users(user);
        return res.status(200).send({ status: true, message: showUser})
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}

module.exports = {
    RegisterUser, LoginUser, showUsers
}