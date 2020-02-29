const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt');
const bip39 = require('bip39')
const saltRounds = 10;

router.use(bodyParser.urlencoded({extended: false}))

router.get("/users", (req, res) => {
    console.log("Fetching all users")

    const connection = getConnection()

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

router.get("/user/:uuid", (req, res) => {
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

router.post('/user_create', (req, res) => {
    console.log("Trying to create new user")

    const connection = getConnection()

    const uuid = uuidv4();
    const username = req.body.username
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const phone = req.body.phone
    const password = bcrypt.hashSync(req.body.password, saltRounds)
    const recoveryPhrase = bcrypt.hashSync(bip39.generateMnemonic(), saltRounds)
    const permissionLevel = req.body.permissionLevel

    const queryString = "INSERT INTO users (UUID, username, fname, lname, phone, password, passphrase, user_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    connection.query(queryString, [uuid, username, firstName, lastName, phone, password, recoveryPhrase, permissionLevel], (err, results, fields) => {
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

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'lifeadmin',
    password: 'wGo67?v7',
    database: 'lifeinvader'
})

function getConnection() {
    return pool
}

module.exports = router