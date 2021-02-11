const knex = require('knex'), config = require('../knexfile'), db = knex(config.development);

function addUser(user) {
  return db("users").insert(user);
}

function addLocation(location) {
	return db("locations").insert(location);
}

function getLastLocation() {
	return db("locations").orderBy('messageTime', 'desc').first();
}

module.exports = {
	addUser,
	addLocation,
	getLastLocation
}
