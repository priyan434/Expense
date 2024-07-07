const jwt = require('jsonwebtoken');
const secretkey="mysecretkey"
const genAuthtoken=(user)=>{

const token=jwt.sign(user,secretkey)

return token
}
module.exports=genAuthtoken