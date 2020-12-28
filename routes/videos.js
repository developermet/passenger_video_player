const express = require('express'), fs = require('fs'), path = require('path'), router = express.Router(), { ensureAuthenticated } = require('../config/auth');

router.get('/', ensureAuthenticated, (req, res) => {
	const directoryPath = "public/media/videos";
	fs.readdir(directoryPath, function (err, files) {
    if (err) return console.log('Unable to scan directory: ' + err); 
		else {
			var results = {}, tmp = [];
			files.forEach(function(file) {
				tmp = fs.readdirSync(directoryPath+"/"+file);
				tmp.forEach(function(archive) {
					if (path.extname(directoryPath + "/" + archive) == ".jpg") results[file] = archive;
				});
			});
			res.render('video', { title: 'SITP - Transmilenio', videos: results, directoryPath: directoryPath, navbar: 0});
		}
	});
});

router.get('/selected/:folderName', ensureAuthenticated, (req, res) => {
	const directoryPath = "public/media/videos/" + req.params.folderName;
	fs.readdir(directoryPath, function (err, files) {
    if (err) return console.log('Unable to scan directory: ' + err); 
		else {
			var thumb, data = "";
			files.forEach(function(file) {
				if (path.extname(directoryPath + "/" + file) == ".mp4") name = file;
				if (path.extname(directoryPath + "/" + file) == ".jpg") thumb = file;
				if (path.extname(directoryPath + "/" + file) == ".txt") data = fs.readFileSync(directoryPath + "/" + file, 'utf-8');
			});
			res.render('showVid', { title: 'SITP - Transmilenio', directoryPath: directoryPath, folderName: req.params.folderName, synopsis: data, thumbnail: thumb, navbar: 2 });
		}
	});
});

router.get('/play/:folderName', ensureAuthenticated, (req, res) => {
	const directoryPath = "public/media/videos/" + req.params.folderName;
	fs.readdir(directoryPath, function (err, files) {
    if (err) return console.log('Unable to scan directory: ' + err); 
		else {
			var name = "", data = "";
			files.forEach(function(file) {
				if (path.extname(directoryPath + "/" + file) == ".mp4") name = file;
			});
			res.render('selectedVid', { title: 'SITP - Transmilenio', directoryPath: directoryPath, folderName: req.params.folderName, file: name, navbar: 2});
		}
	});
});

/* Play a video */
router.get('/:folderName/:videoName', (req, res) => {
	const location = "public/media/videos/"  + req.params.folderName + "/" + req.params.videoName, stat = fs.statSync(location), fileSize = stat.size, range = req.headers.range;
	if (range) {
    const parts = range.replace(/bytes=/, "").split("-"), start = parseInt(parts[0], 10), end = parts[1] ? parseInt(parts[1], 10) : fileSize-1, chunksize = (end-start)+1, file = fs.createReadStream(location, {start, end}), 
    head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4',
		};
		res.writeHead(206, head);
		file.pipe(res);
	} else {
		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'video/mp4',
		};
		res.writeHead(200, head);
		fs.createReadStream(path).pipe(res);
	}
});

/* Play a video */
router.get('/adds/:videoName', (req, res) => {
	const location = "public/media/videos/adds/" + req.params.videoName, stat = fs.statSync(location), fileSize = stat.size, range = req.headers.range;
	if (range) {
    const parts = range.replace(/bytes=/, "").split("-"), start = parseInt(parts[0], 10), end = parts[1] ? parseInt(parts[1], 10) : fileSize-1, chunksize = (end-start)+1, file = fs.createReadStream(location, {start, end}), 
    head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4',
		};
		res.writeHead(206, head);
		file.pipe(res);
	} else {
		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'video/mp4',
		};
		res.writeHead(200, head);
		fs.createReadStream(path).pipe(res);
	}
});

module.exports = router;
