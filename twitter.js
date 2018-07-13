const logger = require('./logger.js');

const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Twitter profile is serialized
// and deserialized.
passport.serializeUser(
  function(user, cb) {
    logger.log('debug', `serializing: ${user}`);
    cb(null, user);
  });

passport.deserializeUser(
  function(obj, cb) {
    logger.log('debug', `deserializing: ${obj}`);
    cb(null, obj);
  });

passport.use(
  new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/auth/twitter/callback`
  },
    function(token, tokenSecret, profile, cb) {
      // In this example, the user's Twitter profile is supplied as the user
      // record.  In a production-quality application, the Twitter profile should
      // be associated with a user record in the application's database, which
      // allows for account linking and authentication with other identity
      // providers.
      logger.log('debug', `authenticating: ${profile.id}`);
      return cb(null, profile);

      // User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
    }
  ));
logger.info('inited twitter passport');

// setup auth handling
const setup = function(app) {
  // initialize passport and restore authentication state, if any, from the session.
  app.use(passport.initialize());
  app.use(passport.session());

  // path handlers
  app.get(
    '/auth/twitter',
    passport.authenticate('twitter'));

  app.get(
    '/auth/twitter/callback',
    passport.authenticate(
      'twitter',
      { failureRedirect: '/login' }
    ),
    function(req, res) {
      // Successful authentication, redirect home.
      logger.log('debug', `succesful authentication for: ${req.user}`)
      res.redirect('/');
    });

  logger.info('setup twitter passport routes');
}
module.exports = setup;
