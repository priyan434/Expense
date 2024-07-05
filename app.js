const express = require('express')
const routers = require('./Routers/Router')
const app = express()
const port = 3000
app.use(express.urlencoded({ extended: false })); 
app.use(express.json()); 
app.use('/',routers)
app.use(express.urlencoded());



module.exports=app;