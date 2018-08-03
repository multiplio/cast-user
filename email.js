const fetch = require('node-fetch');

module.exports = (email, name) =>
  fetch(`http://${process.env.EMAILER_ADDRESS}/${email}/${name}`);
