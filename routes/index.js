const express = require('express'), fs = require('fs'), router = express.Router(), path = require('path'), DataStore = require('nedb'), snmp = require ("net-snmp"), db = new DataStore({filename: path.join(__dirname + '/database/locations.db'), timestampData: true, autoload: true}), users = new DataStore({filename: path.join(__dirname + '/database/users.db'), timestampData: true, autoload: true});

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

router.post('/login', (req, res) => {
  users.insert(req.body, (err, user) => {
    if (err) return console.log(err);
    else { 
      res.cookie('user', user._id);
      res.redirect('/');
    }
  });
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
  db.insert(req.body);
  res.sendStatus(200);
});

router.get('/getLastLocation', (req, res) => {
  db.find({}).sort({time: -1}).limit(1).exec((err, location) => {
    if (err) {
      res.statusCode = 404;
      res.json(err);
    } else {
      res.json(location);
    }
  });
});

router.get('/map', (req, res) => {
  res.render('map', {title: 'SITP - Transmilenio', navbar: 2})
});

router.get('/error', (req, res) => {
  res.render('fail', {title: 'SITP - Transmilenio', navbar: 1});
});

router.post('/connectedUsers', (req, res) => {
  let session = snmp.createSession ("10.100.100.254", "metgroup2021"), oids = ["1.3.6.1.2.1.1.5.0"];
  session.get (oids, function (error, varbinds) {
    if (error) console.error (error);
    else {
      let obj = Object.assign({}, req.body, {busId: varbinds[0].value.toString()});
      users.insert(obj);
    }
    res.sendStatus(200);
    session.close ();
  });
});


module.exports = router;