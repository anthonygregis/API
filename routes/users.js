require('dotenv').config()
const express = require('express')
const pino = require('pino');
const logger = pino({ level: process.env.LOG_LEVEL || 'debug', prettyPrint: true });
const router = express.Router()
const mysql = require('mysql')
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt');
const bip39 = require('bip39')
const saltRounds = 10;

router.use(bodyParser.urlencoded({extended: false}))

router.get("/users", (req, res) => {
    logger.info("Fetching all users")

    const connection = getConnection()

    const userUuid = req.params.uuid
    const queryString = "SELECT * FROM users"
    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            logger.error("Failed to query for uuid: " + err)
            res.sendStatus(500)
            return
        }

        logger.info("Successfull query for users")

        res.json(rows)
    })
})

router.get("/users/:uuid", (req, res) => {
    logger.info("Fetching user with uuid: " + req.params.uuid)

    const connection = getConnection()

    const userUuid = req.params.uuid
    const queryString = "SELECT * FROM users WHERE UUID = ?"
    connection.query(queryString, [userUuid], (err, rows, fields) => {
        if (err) {
            logger.error("Failed to query for uuid: " + err)
            res.sendStatus(500)
            return
        }

        logger.info("Successfull query for uuid: " + userUuid)

        const users = rows.map((row) => {
            return {username: row.username, firstName: row.fname, lastName: row.lname, phone: row.phone, permissionLevel: row.user_level}
        })

        res.json(users)
    })

    //res.end()
})

router.post('/users/create', (req, res) => {
    logger.info("Trying to create new user")

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
            logger.error("Failed to insert new user: " + err)
            res.sendStatus(500)
            return
        }

        logger.info("Inserted a new user with id: ", results.insertId);
        res.end()
    })

    res.end()
})

router.post('/users/update', (req, res) => {
    logger.info("Trying to update existing user")

    const connection = getConnection()

    const uuid = uuidv4();
    const username = req.body.username
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const phone = req.body.phone
    const password = bcrypt.hashSync(req.body.password, saltRounds)
    const recoveryPhrase = bcrypt.hashSync(bip39.generateMnemonic(), saltRounds)
    const permissionLevel = req.body.permissionLevel

    const queryString = "UPDATE users SET username = ?, fname = ?, lname = ?, phone = ?, password = ?, user_level = ? WHERE UUID = ?"
    connection.query(queryString, [username, firstName, lastName, phone, password, permissionLevel, uuid], (err, results, fields) => {
        if (err) {
            logger.error("Failed to update existing user: " + err)
            res.sendStatus(500)
            return
        }

        logger.info("Updated existing user with id: ", results.insertId);
        res.end()
    })

    res.end()
})

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST || 'localhost',
    user: 'lifeadmin',
    password: 'wGo67?v7',
    database: 'lifeinvader'
})

function getConnection() {
    return pool
}

module.exports = router