const logger = require('./logger.js');

const emailer = require('./email.js');

const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;

// setup auth handling
module.exports = function(app, User) {
  // Configure Passport authenticated session persistence.
  passport.serializeUser(
    function(user, cb) {
      logger.debug(`serializing: ${user.displayName}`);
      cb(null, user._id);
    });

  passport.deserializeUser(
    function(id, cb) {
      logger.debug(`deserializing: ${id}`);
      User.findById(id, cb);
    });

  passport.use(
    new TwitterStrategy({
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
      callbackURL: process.env.TWITTER_CALLBACK_URL,
    },
      function(token, tokenSecret, profile, cb) {
        logger.debug(`authenticating: ${profile.id}`);

        //get user email if exists
        let email = null;
        if (profile.emails && profile.emails.length > 0) {
          email = profile.emails[0].value;
        }

        const user = {
          displayName: profile.displayName,
          primaryEmail: email,
          profileImageUrl: profile._json.profile_image_url_https,
          twitterId: profile.id,
          twitterAccessLevel: profile._accessLevel
        };
        User.findOne({"twitterId" : profile.id}).exec(function (err, res) {
          if(err)
            return cb(err, null);
          else {
            if(!res && email) {
              //new user
              emailer(email, profile.displayName)
                .then(() => logger.debug('sent onboarding email'))
                .catch(err => logger.error(`emailer error : ${err}`));
            }

            User.findOrCreate(user, function (err, user) {
              logger.info('created or updated a user');
              return cb(err, user);
            });
          }
        });
      }
    ));
  logger.info('inited twitter passport');

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
      logger.debug(`succesful authentication for: ${req.user.displayName}`);
      res.redirect('/');
    });

  logger.info('setup twitter passport routes');
};
