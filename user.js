const logger = require('./logger.js')
const mongoose = require('mongoose')
const database = require('./db.js')

let uri = `${process.env.DATABASE_PROTOCOL}://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_ADDRESS}/${process.env.DATABASE_NAME}`
if (process.env.DATABASE_OPTIONS && process.env.DATABASE_OPTIONS !== '') {
  uri += `?${process.env.DATABASE_OPTIONS}`
}

module.exports = () => new Promise(function (resolve, reject) {
  // schema
  let userSchema = mongoose.Schema({
    displayName: String,
    primaryEmail: String,
    profileImageUrl: String,

    joinedDate: { type: Date, default: Date.now },

    twitter: {
      id: String,
      accessLevel: String,
      token: String,
      secret: String,
    },
  })

  userSchema.statics.findOrCreate = function (user, cb) {
    return this.model('User').findOneAndUpdate(
      { 'twitter.id': user.twitter.id },
      user,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
      cb
    )
  }

  mongoose.model('User', userSchema)
  logger.debug('user schema created')

  // get connection
  database(uri, process.env.DATABASE_NAME)
    .then(conn => {
      logger.info(`got connection to ${process.env.DATABASE_NAME}`)
      resolve(conn.model('User'))
    })
    .catch(err => {
      logger.error(err)
      process.exit(0)
    })
})

