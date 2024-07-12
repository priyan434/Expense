const express=require("express")

const { register, login, fetchUserDetails } = require("../Controllers/authController");
const auth=require('../Middleware/auth');
const { addExpense, updateExpense, getAllExpense, deleteExpense,   } = require("../Controllers/expenseController");
const routers=express.Router()
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });


routers.post('/register',upload.single('profile_url'), register)
routers.post('/login',login)
routers.get('/fetchUserDetails/:id',fetchUserDetails)
routers.post("/addExpense",auth,addExpense)
routers.put("/updateExpense/:id",auth,updateExpense)
routers.get("/getallExpense",auth,getAllExpense)
routers.delete('/deleteExpense/:id',auth,deleteExpense)
// routers.get('/splitExpenses/:id',splitExpenses)

module.exports=routers