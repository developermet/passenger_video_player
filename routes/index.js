const express = require('express'), fs = require('fs'), router = express.Router(), path = require('path'), dbHelpers = path.join(__dirname, "../models/dbHelpers"), tables = require(dbHelpers);

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { navbar: 0 });
});

router.get('/terms', (req, res) => {
  res.render('terms', { navbar: 2 });
});

router.get('/help', (req, res) => {
  res.render('help', { navbar: 2 });
});

router.get('/login', (req, res) => {
  res.render('initialForm', { navbar: 1 });
});

router.get('/announcer', (req, res) => {
  const directoryPath = "public/media/videos/adds";
	fs.readdir(directoryPath, function (err, files) {
    if (err) return console.log('Unable to scan directory: ' + err); 
		else {
      let fileName = files[0];
      res.render('announcer', {title: 'SITP - Transmilenio', files: files, file: fileName, navbar: 2}); 
		}
	});
});

router.post('/updatemap', (req, res) => {
  let location = {messageTime: req.body.time, lat: req.body.lat, lon: req.body.lon, speed: req.body.speed, busId: busId}
  tables.addLocation(location);
  res.sendStatus(200);
});

router.get('/getLastLocation', (req, res) => {
  tables.getLastLocation().then(location => res.json(location)).catch(err => res.json(err));
});

router.get('/map', (req, res) => {
  res.render('map', {title: 'SITP - Transmilenio', navbar: 2})
});

router.get('/error', (req, res) => {
  res.render('fail', {title: 'SITP - Transmilenio', navbar: 1});
});

router.post('/connectedUsers', (req, res) => {
  let user = {traveler_kind: req.body.traveler_kind, stratum: req.body.stratum, age: req.body.age, gender: req.body.gender, busId: req.body.busId}
  tables.addUser().then(user => res.sendStatus(200)).catch(err => res.sendStatus(500));
});


module.exports = router;