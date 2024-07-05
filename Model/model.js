const mongoose = require('mongoose');
const ExpenseSchema=new mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    amount:{
        type:Number,
        required:true,
    },
    expense:{
        type:String,
        required:true
    }
})
const userSchema=new  mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    expenses:[ExpenseSchema],
    password:{
        type:String,
        required:true
    },
    
})

const user=mongoose.model("user",userSchema)
module.exports=user
