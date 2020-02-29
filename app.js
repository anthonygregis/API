const { spawn } = require('child_process')
const pino = require('pino')
const { getPrettyStream: pinoGetPrettyStream } = require('pino/lib/tools')
const { multistream } = require('pino-multi-stream')
const pinoPretty = require('pino-pretty')
const teeStream = spawn(
  process.execPath,
  [require.resolve('pino-tee'), 'debug', `logs/debug.log`, 'warn', 'logs/warn.log', 'info', 'logs/info.log'],
  { cwd: process.cwd(), env: process.env },
)
const prettyConsoleStream = pinoGetPrettyStream(
  { translateTime: true },
  pinoPretty,
  process.stdout,
)
const logger = pino(
  {},
  multistream([{ stream: prettyConsoleStream }, { stream: teeStream.stdin }]),
)
const express = require('express')
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


