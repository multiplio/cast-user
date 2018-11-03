const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, printf } = format

const logFormat = printf(info =>
  `${process.env.PROGRAM_ALIAS || ''}:${info.timestamp}:${info.level}: ${info.message}`
)

const logger = createLogger({
  level: process.env.LOG_LEVEL === 'debug' ? 'debug' : 'info',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new transports.Console()
  ]
})

if (process.env.LOG_FILE === 'true') {
  logger.add(
    // - Write all logs error (and below) to `error.log`.
    new transports.File({ filename: 'error.log', level: 'error' })
  )
  logger.add(
    // - Write all logs to `combined.log`
    new transports.File({ filename: 'combined.log' })
  )
}

module.exports = logger
