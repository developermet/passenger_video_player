const express = require('express'), fs = require('fs'), path = require('path'), router = express.Router();

router.get('/', function (req, res) {
  const directoryPath = "public/media/images";
  fs.readdir(directoryPath, function (err, files) {
    if (err) return console.log('Unable to scan directory: ' + err); 
		else {
      var results = {}, tmp = [];
			files.forEach(function(file) {
				tmp = fs.readdirSync(directoryPath+"/"+file);
        results[file] = tmp;
			});
      res.render('images', { title: 'SITP - Transmilenio', navbar: true, images: results, directoryPath: directoryPath});
		}
	});
});

module.exports = router;