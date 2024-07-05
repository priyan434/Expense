const { urlencoded } = require("body-parser");
const User=require("../Model/model")
const bcrypt = require('bcrypt');
const genAuthtoken = require("../utils/genAuthtoken");
const saltRounds = 10;

exports.register = async (req, res) => {
    try {
        const {name,email,password}=req.body
        console.log(name,email);
      
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).send('Email already exists');
        }
        const salt=bcrypt.genSalt(saltRounds)
        const hashedpassword=bcrypt.hash(password,salt)
    
        const newUser = new User({
            email: req.body.email,
            name: req.body.name,
            expenses: [],
            password:hashedpassword
        });

        
        await newUser.save();
        const token=genAuthtoken(newUser)
        res.status(200).send({ msg: 'Successfully registered',token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
exports.login=async(req,res)=>{
    try{
        const {password}=req.body;
        const user= await User.find({email:req.body.email});
        if(!user) res.status(400).send("user does not exists")
        const isValid=await bcrypt.compare(password,user.password)
        if(!isValid) res.status(400).send("invalid credentials")
        const token=genAuthtoken(user)
        res.status(200).json({token})       
    }
    catch(err){
    res.status(500).send("server error")
}
}
