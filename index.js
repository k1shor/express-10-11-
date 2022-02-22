const express = require('express')    // to create express api, require - importing 
require('dotenv').config()
const db = require('./Database/connection')

const body_Parser = require('body-parser')
const CategoryRoute = require('./Route/categoryRoute')


const app = express()
const port = process.env.PORT  ||  8000


// app.get('/',(request,response)=>{
//     response.send("welcome to express js. we are starting express today. Thank you")
// })

app.use(body_Parser.json())



app.use('/api',CategoryRoute)

app.listen(port,()=>{
    console.log(`Server started at port ${port}`)
})