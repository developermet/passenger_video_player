const express = require('express'), fs = require('fs'), router = express.Router(), path = require('path'), User = require('../models/User');

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

router.post('/startup', (req, res) => {
  const newUser = new User(req.body);
  newUser.save().then(user => {
    console.log(user);
    res.redirect('/');  
  }).catch(err => console.log(err));
});

router.get('/announcer', (req, res) => {
  const directoryPath = "public/media/videos";
	fs.readdir(directoryPath, function (err, files) {
    if (err) return console.log('Unable to scan directory: ' + err); 
		else {
      var folderName = files[0], content= fs.readdirSync(directoryPath + "/" + folderName);
      res.render('announcer', {title: 'SITP - Transmilenio', folderName: folderName, file: content[0], navbar: 2});
		}
	});
});

router.get('/error', (req, res) => {
  res.render('fail', { navbar: 1 });
});


module.exports = router;
