const knex = require('knex'), config = require('../knexfile'), db = knex(config.development);

Date.prototype.addMinutes = function (minutes) {
	this.setMinutes(this.getMinutes() + minutes);
	return new Date(this);
};

function addUser(user) {
	return db("users").insert(user);
}

function addLocation(location) {
	return db("locations").insert(location);
}

function getLastLocation() {
	return db.raw('SELECT messageTime, lat, lon, busId FROM locations ORDER BY messageTime DESC LIMIT 1')
}

function addNewTmsaMessage(message) {
	return db('tmsa_messages').insert(message);
}

/*function getLastMessage() {
	let now = new Date();
	return db.raw(`SELECT content, broadcastdate FROM tmsa_messages WHERE broadcastdate <= '${now}' ORDER BY broadcastdate DESC LIMIT 1`)
}*/

function getLastMessage() {
	return db.raw('SELECT content, created_at FROM tmsa_messages ORDER BY created_at DESC LIMIT 1')
}

function getOldUsers() {
	let rigthNow = new Date();
	if (rigthNow.getMonth() != 0) rigthNow.setMonth(rigthNow.getMonth() - 1);
	else rigthNow.setMonth(11);
	rigthNow.setHours(0, 0, 0, 0);
	return db.raw(`SELECT id FROM users WHERE created_at < '${rigthNow}'`);
}

function deleteUsers(users) {
	return db('users').delete().whereIn('id', users);
}

function selectUser() {
	return db.raw('SELECT * FROM users')
}

async function syncUsersEOD() {
	const axios = require('axios');
	const apiUrl = 'https://apieod2.metgroupsas.com/CAPTIVE_USER/INSERT';

	const https = require('https');

	const customAgent = new https.Agent({
		rejectUnauthorized: false, // Cambia esto a true si necesitas verificar el certificado, pero asegúrate de tener el certificado raíz correcto
	});

	const instance = axios.create({
		httpsAgent: customAgent,
	});
	try {
		const users = await selectUser()

		if (!users || users.length === 0) {
			console.log('No users to sync');
			return;
		}

		const response = await instance.post(apiUrl, { REGISTERS: users });

		if (response.status === 200 && response.data && response.data.data && response.data.data.length > 0) {
			await deleteUsers(response.data.data);
		} else {
			console.log('No data received or empty data array');
		}
	} catch(error) {
		if (error.response) {
			console.error(`Error: ${error.response.status} - ${error.response.data.message}`);
		} else {
			console.error(`Error: ${error.message}`);
		}
	}
}

module.exports = {
	addUser,
	addLocation,
	getLastLocation,
	addNewTmsaMessage,
	getLastMessage,
	getOldUsers,
	deleteUsers,
	selectUser,
	syncUsersEOD
}
