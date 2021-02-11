const knex = require('knex'), config = require('../knexfile'), db = knex(config.development);

function addUser(user) {
  return db("users").insert(user);
}

function addLocation(location) {
	return db("locations").insert(location);
}

function getLastLocation() {
	return db.raw('SELECT messageTime, lat, lon, busId FROM locations ORDER BY messageTime DESC LIMIT 1')
}

module.exports = {
	addUser,
	addLocation,
	getLastLocation
}
