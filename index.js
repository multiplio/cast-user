// read dotenv
let r = require('dotenv').config()

// setup logger
const logger = require('./logger.js');

// handle dotenv error
if (r.error) {
  logger.error(r.error);
  throw r.error;
}
logger.info('parsed dotenv succesfully');

// app requires
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
const express = require('express');
const app = express();

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: `http://127.0.0.1:${process.env.PORT}/auth/twitter/callback`
},
  function(token, tokenSecret, profile, cb) {
    User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
logger.info('inited twitter passport');

app.get(
  '/auth/twitter',
  passport.authenticate('twitter'));

app.get(
  '/auth/twitter/callback',
  passport.authenticate(
    'twitter',
    {
      failureRedirect: '/login'
    }
  ),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
logger.info('setup express routes');

app.listen(process.env.PORT);
logger.info(`listening at localhost:${process.env.PORT}`);
