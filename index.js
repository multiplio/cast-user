// setup logger
const logger = require('./logger.js');
logger.info('starting up');

// app requires
const twitter = require('./twitter.js');
const users = require('./user.js');

const express = require('express');
const helmet = require('helmet');
const app = express();
const session = require('express-session');

app.use(helmet());

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

        // get identity
        app.get(
          '/identity',
          function(req, res) {
            const user = req.user;
            res.send(
              {
                displayName: user.displayName,
                profileImageUrl: user.profileImageUrl,
              }
            );
          }
        );

        // start server
        app.listen(process.env.PORT);
        logger.info(`listening at localhost:${process.env.PORT}`);
      });
  });
