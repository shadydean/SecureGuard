const express = require('express')
const app = express()
const dotenv=require('dotenv')
dotenv.config()
const connectDB = require('./config/db')
connectDB()

app.use(express.json())


app.get('/',(req,res)=>{

    res.send('API is running')
})

const PORT = process.env.PORT || 4321