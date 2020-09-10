const express = require('express'), fs = require('fs'), path = require('path'), router = express.Router();

router.get('/', function (req, res) {
	const directoryPath = "public/media/music";
  res.render('images', { title: 'SITP - Transmilenio'});
});

module.exports = router;