const express = require('express'), fs = require('fs'), router = express.Router(), path = require('path');


/* GET home page. */
router.get('/', function(req, res, next) {
  const directoryPath = "public/media";
	fs.readdir(directoryPath, function (err, files) {
    if (err) return console.log('Unable to scan directory: ' + err); 
		else {
      var name = "", randomFile = files[Math.floor(Math.random() * files.length)], data = '';
      tmp = fs.readdirSync(directoryPath+"/"+randomFile);
      tmp.forEach(function(archive) {
        if (path.extname(directoryPath + "/" + randomFile + "/" + archive) == ".mp4") name = archive;
        if (path.extname(directoryPath + "/" + randomFile + "/" + archive) == ".jpg") movieImage = archive;
        if (path.extname(directoryPath + "/" + randomFile + "/" + archive) == ".txt") data = fs.readFileSync(directoryPath + "/" + randomFile + "/" + archive, 'utf-8');
      });
      res.render('index', { title: 'SITP - Transmilenio', directoryPath: directoryPath, folderName: randomFile, movieImage: movieImage, synopsis: data, file: name});
		}
	});
});

module.exports = router;
