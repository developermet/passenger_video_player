const express = require('express'), fs = require('fs'), router = express.Router(), path = require('path');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SITP - Transmilenio', navbar: true});
});

module.exports = router;
