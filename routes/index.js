const express = require('express'), fs = require('fs'), router = express.Router(), path = require('path'), User = require('../models/User'), { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

/* GET home page. */
router.get('/', ensureAuthenticated, (req, res, next) => {
  res.render('index', { navbar: 0 });
});


router.get('/terms', (req, res) => {
  res.render('terms', { navbar: 2 });
});

router.get('/help', (req, res) => {
  res.render('help', { navbar: 2 });
});

router.get('/login', forwardAuthenticated, (req, res) => {
  res.render('initialForm', { navbar: 1 });
});

router.post('/login', (req, res) => {
  const newUser = new User(req.body);
  newUser.save().then(user => {
    res.cookie('user', user.name);
    res.redirect('/');
  }).catch(err => console.log(err));
});

router.get('/announcer', (req, res) => {
  const directoryPath = "public/media/videos";
	fs.readdir(directoryPath, function (err, files) {
    if (err) return console.log('Unable to scan directory: ' + err); 
		else {
      var randomVideo = Math.floor(Math.random() * files.length), folderName = files[randomVideo], content= fs.readdirSync(directoryPath + "/" + folderName), fileName = '';
      content.forEach((file)=>{
        if (path.extname(directoryPath + "/" + file) == ".mp4") fileName = file;
      });
      res.render('announcer', {title: 'SITP - Transmilenio', folderName: folderName, file: fileName, navbar: 2});
		}
	});
});

router.get('/error', (req, res) => {
  res.render('fail', { navbar: 1 });
});


module.exports = router;
