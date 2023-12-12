const knex = require('knex'), config = require('../knexfile'), db = knex(config.development);

Date.prototype.addMinutes = function(minutes) {
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
	if (rigthNow.getMonth() != 0) rigthNow.setMonth(rigthNow.getMonth()-1); 
	else rigthNow.setMonth(11);
	rigthNow.setHours(0,0,0,0);
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
	const apiUrl = 'https://18.221.51.191:3005/CAPTIVE_USER/INSERT';
	
	const https = require('https');
	
	const customAgent = new https.Agent({
	  rejectUnauthorized: false, // Cambia esto a true si necesitas verificar el certificado, pero asegúrate de tener el certificado raíz correcto
	});
	
	const instance = axios.create({
	  httpsAgent: customAgent,
	});
	return await selectUser().then(async users => {
	  if (users?.length > 0) {
		   
		  await instance.post(`${apiUrl}`,{REGISTERS:users})
		   .then(async function (response) {
		
			if (response?.data?.data?.length > 0) {
				await deleteUsers(response.data.data).then(async response =>{}).catch(err=>console.log(err));
			}
		   }).catch(function (error) {
			console.log(error);
		   })
	  }
	}).catch(err => console.log(err));
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
