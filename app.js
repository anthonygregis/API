// Load App Server (EXPRESS)
const express = require('express')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt');
const bip39 = require('bip39')
const saltRounds = 10;

app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static('./public'))

app.use(morgan('short'))

app.post('/user_create', (req, res) => {
    console.log("Trying to create new user")

    const uuid = uuidv4();
    const username = req.body.username
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const phone = req.body.phone
    const password = bcrypt.hashSync(req.body.password, saltRounds)
    const recoveryPhrase = bcrypt.hashSync(bip39.generateMnemonic(), saltRounds)
    const permissionLevel = req.body.permissionLevel

    const queryString = "INSERT INTO users (UUID, username, fname, lname, phone, password, passphrase, user_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    getConnection().query(queryString, [uuid, username, firstName, lastName, phone, password, recoveryPhrase, permissionLevel], (err, results, fields) => {
        if (err) {
            console.log("Failed to insert new user: " + err)
            res.sendStatus(500)
            return
        }

        console.log("Inserted a new user with id: ", results.insertId);
        res.end()
    })

    res.end()
})

app.get("/user/:uuid", (req, res) => {
    console.log("Fetching user with uuid: " + req.params.uuid)

    const connection = getConnection()

    const userUuid = req.params.uuid
    const queryString = "SELECT * FROM users WHERE UUID = ?"
    connection.query(queryString, [userUuid], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for uuid: " + err)
            res.sendStatus(500)
            return
        }

        console.log("Successfull query for uuid: " + userUuid)

        const users = rows.map((row) => {
            return {username: row.username, firstName: row.fname, lastName: row.lname, phone: row.phone, permissionLevel: row.user_level}
        })

        res.json(users)
    })

    //res.end()
})

app.get("/", (req, res) => {
    console.log("Responding to root route")
    res.send("Hello World")
})

app.get("/users", (req, res) => {
    console.log("Fetching all users")

    const connection = mysql.createConnection({
        host: '149.28.58.181',
        user: 'lifeadmin',
        password: 'wGo67?v7',
        database: 'lifeinvader'
    })

    const userUuid = req.params.uuid
    const queryString = "SELECT * FROM users"
    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for uuid: " + err)
            res.sendStatus(500)
            return
        }

        console.log("Successfull query for users")

        res.json(rows)
    })
})

app.listen(3000, () => {
    console.log("Server is up and listening on 3000...")
})

function getConnection() {
    return mysql.createConnection({
        host: '149.28.58.181',
        user: 'lifeadmin',
        password: 'wGo67?v7',
        database: 'lifeinvader'
    })
}
