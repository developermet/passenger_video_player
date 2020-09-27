const express = require('express'), fs = require('fs'), path = require('path'), router = express.Router();


router.get('/', function (req, res) {
	const directoryPath = "public/media/music";
	fs.readdir(directoryPath, function (err, files) {
    if (err) return console.log('Unable to scan directory: ' + err); 
		else {
      var results = {}, tmp = [];
			files.forEach(function(file) {
				tmp = fs.readdirSync(directoryPath+"/"+file);
        results[file] = tmp;
			});
			res.render('music', { title: 'SITP - Transmilenio', folders: results, directoryPath: directoryPath, navbar: true});
		}
	});
});

router.get('/:folderName/:audioName', function(req, res) {
	const location = "public/media/music/"  + req.params.folderName + "/" + req.params.audioName, stat = fs.statSync(location), fileSize = stat.size, range = req.headers.range;
  console.log(stat);
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-"), start = parseInt(parts[0], 10), end = parts[1] ? parseInt(parts[1], 10) : fileSize-1, chunksize = (end-start)+1, file = fs.createReadStream(location, {start, end}), 
    head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'audio/mpeg',
		};
		res.writeHead(206, head);
		file.pipe(res);
	} else {
		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'audio/mpeg',
		};
		res.writeHead(200, head);
		fs.createReadStream(path).pipe(res);
	}
});

module.exports = router;