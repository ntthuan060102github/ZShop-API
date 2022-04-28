const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')
const stripeRoute = require('./routes/stripe')

const app = express()
app.use(express.json())
dotenv.config()
app.use(cors())

app.listen(process.env.PORT || 5000, () => {
    console.log('ZShop server is running!')
})

app.get("/", (req, res) => {
    res.send(`
        <div>
            <b style="font-size: 24px;display: block;">ZShop API</b>
            <span style="font-size: 18px;display: block;">Version: 0.0.4 Beta</span>
            <span style="font-size: 18px;display: block;">Last update: 28/04/2022</span>
            <span style="font-size: 18px;display: block;">Author: 
                <a href="https://ntt612.github.io/NTThuan/">Nguyen Trong Thuan</a>
            </span>
            <span style="font-size: 18px;display: block;">Document: 
                <a href="https://ntt612.github.io/NTThuan/">Click here</a>
            </span>
        </div>
    `)
})

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/product", productRoute)
app.use("/api/cart", cartRoute)
app.use("/api/order", orderRoute)
app.use("/api/order", stripeRoute)

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connection to database successful!")
    })
    .catch(err => {
        console.log(err)
    })
