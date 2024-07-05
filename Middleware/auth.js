const jwt = require('jsonwebtoken');
const secretkey = "mysecretkey"
const auth = (req, res, next) => {
    try {
        const token = req.header('x-auth-token')
        if (!token) res.status(400).send("invalid user")
        req.user = jwt.verify(token, secretkey)
        next()
    } catch (error) {
        res.status(400).send("authentication error")
    }
}
module.exports=auth