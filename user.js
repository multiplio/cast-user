const logger = require('./logger.js');
const mongoose = require('mongoose');

const init = new Promise(function (resolve, reject) {
  require('./db.js')
    .then(function(db) {
      //schema
      const userSchema = mongoose.Schema({
        displayName: String,
        profileImageUrl: String,

        joinedDate: { type: Date, default: Date.now },

        twitterId: String,
        twitterAccessLevel: String
      });

      userSchema.statics.findOrCreate = function(user, cb) {
        return this.model('User').findOneAndUpdate(
          {twitterId: user.twitterId},
          user,
          {new: true, upsert: true, setDefaultsOnInsert: true},
          cb
        );
      };

      const User = mongoose.model('User', userSchema);
      resolve(User);
    })
    .catch(function(error) {
      reject(error);
    });
});
module.exports = init;
