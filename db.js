const logger = require('./logger.js');
const mongoose = require('mongoose');

const url = `mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_ADDRESS}/${process.env.DATABASE_NAME}`;

const connect = new Promise(function(resolve, reject) {
  mongoose.connect(url);
  const db = mongoose.connection;

  let resolved = false;

  // On connection error
  db.on('error', function(error) {
    if(!resolved) {
      resolved = true;
      reject(error);
    }
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', function () {
    logger.info(`database ${process.env.DATABASE_NAME} disconnected`);
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', function() {
    mongoose.connection.close(function () {
      logger.info(`${process.env.DATABASE_NAME} connection disconnected through app termination`);
      process.exit(0);
    });
  });

  // When the connection is opened
  db.once('open', function() {
    // we're connected!
    if(!resolved) {
      logger.info(`database ${process.env.DATABASE_NAME} connected`);
      resolved = true;
      resolve(db);
    }
  });
});
module.exports = connect;
