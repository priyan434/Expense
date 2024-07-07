const express = require('express')
const app = express()

const routers=require('./Routers/Router')
app.use(express.urlencoded({ extended: false })); 
app.use(express.json()); 
app.use('/',routers)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports=app