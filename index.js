if (process.env.NODE_ENV !== 'production') {
  // read dotenv
  var ret = require('dotenv').config();
}

// setup logger
const logger = require('./logger.js');
logger.info('starting up');

if (process.env.NODE_ENV !== 'production') {
  // handle dotenv error
  if (ret.error) {
    logger.error(ret.error);
    logger.info('could not parse dotenv');
  }
  else
    logger.info('parsed dotenv succesfully');
}

// app requires
const twitter = require('./twitter.js');
const users = require('./user.js');

const express = require('express');
const app = express();
const session = require('express-session');

app.use(require('body-parser').urlencoded(
  {
    extended: true
  }
));

// setup session store
require('./sessstore.js')(session)
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
          maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
        }
      }
    ));

    // setup users database
    users()
      .then(User => {
        // setup twitter auth
        twitter(app, User);

        // DEBUG routes
        if (process.env.EXPANDED_ROUTES) {
          app.get(
            '/login',
            function(req, res) {
              res.send('login')
            });
          app.get(
            '/',
            function(req, res) {
              res.send(req.user);
            });
          logger.info('setup debug routes');
        }

        // start server
        app.listen(process.env.PORT);
        logger.info(`listening at localhost:${process.env.PORT}`);
      });
  });
