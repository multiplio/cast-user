const logger = require('./logger')

// app requires
const database = require('./db.js')
const users = require('./user')(database)

const app = require('express')()
const session = require('express-session')

app.use(require('helmet')())

app.use(require('body-parser').urlencoded(
  { extended: true }
))

// setup session store
require('./sessstore')(session)
  .then(store => {
    // use the store
    app.use(session(
      {
        secret: process.env.COOKIE_SECRET,
        store: store,
        resave: true,
        saveUninitialized: true,
        cookie: {
          // secure: true,
          maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        },
      }
    ))

    // setup users database
    users
      .then(User => {
        // setup twitter authentication
        require('./twitter')(app, User)

        // setup other routes
        app.get('/identity', function (req, res) {
          const user = req.user
          if (user !== null) {
            res
              .status(200)
              .send(
                {
                  displayName: user.displayName || null,
                  profileImageUrl: user.profileImageUrl || null,
                }
              )
          }
          else {
            res
              .status(401)
              .send('Not Authenticated')
          }
        })

        // readiness probe
        app.get('/ready', function (req, res) {
          res
            .status(200)
            .send('ok')
        })
        // start server
        app.listen(process.env.PORT)
        logger.info(`listening at localhost:${process.env.PORT}`)
      })
  })

