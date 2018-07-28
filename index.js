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

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded(
  {
    extended: true
  }
));
app.use(require('express-session')(
  {
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true
  }
));

// setup users database
users()
  .then(User => {
    // setup twitter auth
    twitter(app, User);

    // DEBUG routes
    if (process.env.NODE_ENV !== 'production') {
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
      logger.debug('setup debug routes');
    }

    // start server
    app.listen(process.env.PORT);
    logger.info(`listening at localhost:${process.env.PORT}`);
  });
