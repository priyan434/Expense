const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretkey = process.env.JWT_SECRET
const auth = (req, res, next) => {
    try {
        const token = req.header('x-auth-token')
        if (!token) res.status(400).send("invalid user")
        const data = jwt.verify(token, secretkey)
        req.user=data.userId
        next()
    } catch (error) {
        res.status(400).send("authentication error")
    }
}
module.exports=auth