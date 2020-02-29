// Load App Server (EXPRESS)
const express = require('express')
const pino = require('pino');
const logger = pino({ level: process.env.LOG_LEVEL || 'debug', prettyPrint: true });
const app = express()
const PORT = process.env.PORT || 3000
const router = require('./routes/users.js')

app.use(router)

app.use(express.static('./public'))

app.get("/", (req, res) => {
    logger.debug('Requested /');
    res.json({
        message: 'Welcome to LifeInvader REST API'
    })
})

app.listen(PORT, () => {
    logger.info('Server running on port %d', PORT);
})


