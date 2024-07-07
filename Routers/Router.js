const express=require("express")

const { register, login } = require("../Controllers/authController");
const auth=require('../Middleware/auth');
const { addExpense, updateExpense, getAllExpense, deleteExpense } = require("../Controllers/expenseController");
const routers=express.Router()


routers.post('/register', register)
routers.post('/login',login)
routers.post("/addExpense",auth,addExpense)
routers.put("/updateExpense/:id",auth,updateExpense)
routers.get("/getallExpense",auth,getAllExpense)
routers.delete('/deleteExpense/:id',auth,deleteExpense)

module.exports=routers