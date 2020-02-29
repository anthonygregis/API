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

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Server is up and listening on: " + PORT)
})


