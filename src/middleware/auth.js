const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const { getUserById } = require("../models");
dotenv.config();

const auth = async (req, res, next) => {
    try {
        let token = req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer';
        if (token) {
            token = req.headers.authorization && req.headers.authorization.split(' ')[1]
            const userId = jwt.verify(token, process.env.TOKEN_SECRET);
            const {username, email, id} = getUserById(userId);
            req.user = {username, email, id};
            next()
        } else {
            return res.status(401).json({status : false, message : "Unauthorized"})
        }
    } catch (error) {
        return res.status(401).json({status : false, message : error.message})
    }
}

module.exports = {
    auth
}