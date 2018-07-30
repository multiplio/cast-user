const StoreIniter = require('connect-mongodb-session');
const logger = require('./logger.js');

const uri = `mongodb://${process.env.SESSION_DB_USER}:${process.env.SESSION_DB_PASSWORD}@${process.env.SESSION_DB_ADDRESS}/${process.env.SESSION_DB_NAME}`;

module.exports = function (session) {
  return new Promise(function (resolve, reject) {
    (function init () {
      const MongoDBStore = StoreIniter(session);

      let store = new MongoDBStore({
        uri: uri,
        collection: 'sessions'
      });

      store.on('connected', function() {
        store.client; // The underlying MongoClient object from the MongoDB driver
        logger.info(`got connection to session store ${process.env.SESSION_DB_NAME}`);
        resolve(store);
      });

      store.on('error', function(err) {
        logger.error(`${err} : retrying for session store`);
        setTimeout(init, 2000);
      });
    })();
  });
};
