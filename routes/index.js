const express = require('express'), fs = require('fs'), router = express.Router(), path = require('path');



router.get('/login', function(req, res) {
  res.render('initialForm', { navbar: 1 });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { navbar: 0 });
});

router.get('/terms', function(req, res) {
  res.render('terms', { navbar: 2 });
});

module.exports = router;
