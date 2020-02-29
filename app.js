// Load App Server (EXPRESS)
const express = require('express')
const app = express()
const morgan = require('morgan')

const router = require('./routes/user.js')

app.use(router)

app.use(express.static('./public'))

app.use(morgan('short'))

app.get("/", (req, res) => {
    console.log("Responding to root route")
    res.send("Hello World")
})

app.listen(3000, () => {
    console.log("Server is up and listening on 3000...")
})


