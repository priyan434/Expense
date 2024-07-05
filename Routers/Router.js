const express=require("express")
const {addExpense, updateExpense, getAllExpense, deleteExpense} = require("../Controllers/controller");
const { register } = require("../Controllers/authController");
const auth=require("../mio")
const routers=express.Router()


routers.post('/register',auth,register)
routers.post("/addExpense",auth,addExpense)
routers.put("/updateExpense/:id",updateExpense)
routers.get("/getallExpense",getAllExpense)
routers.delete('/deleteExpense/:id',deleteExpense)

module.exports=routers