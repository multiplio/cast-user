// read dotenv
let r = require('dotenv').config();

// setup logger
const logger = require('./logger.js');

// handle dotenv error
if (r.error) {
  logger.error(r.error);
  logger.info('could not parse dotenv');
}
else
  logger.info('parsed dotenv succesfully');

// app requires
const express = require('express');
const app = express();

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: process.env.COOKIE_SECRET, resave: true, saveUninitialized: true }));

// setup users database
require('./user.js')
  .then(function(User) {
    // setup twitter auth
    require('./twitter.js')(app, User);

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
  })
  .catch(function(err) {
    logger.error(err);
    process.exit(0);
  });
