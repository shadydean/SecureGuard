const express = require('express')
const app = express()
const dotenv=require('dotenv')
dotenv.config()
const connectDB = require('./config/db')
connectDB()
const loginRoute = require('./routes/login.route')
app.use(express.json())


app.get('/',(req,res)=>{

    res.send('API is running')
})

app.use('/api/login',loginRoute)
app.use('/api/signup',signupRoute)
app.use('/api/bank',bankRoute)
app.use('/api/media',mediaRoute)
app.use('/api/credentials',credentialsRoute)
app.use('/api/admin')



const PORT = process.env.PORT || 4321

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})