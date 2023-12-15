const { response } = require("express");
const cors = require('cors');

const corsOptions = {
  origin: '*', // Reemplaza con tu dominio o '*' para permitir cualquier origen
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Habilita las credenciales (cookies, encabezados personalizados, etc.)
  optionsSuccessStatus: 204, // Establece el cÃ³digo de respuesta para las solicitudes OPTIONS a 204
};

const express = require("express"),
  fs = require("fs"),
  router = express.Router(),
  path = require("path"),
  dbHelpers = path.join(__dirname, "../models/dbHelpers"),
  tables = require(dbHelpers),
  snmp = require("net-snmp"),
  axios = require("axios"),
  socketApi = require("../socketApi");

let oids = ["1.3.6.1.2.1.1.5.0"];
// Aplica CORS como middleware en tu enrutador
router.use(cors(corsOptions));
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://192.168.2.254:81');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
const session = snmp.createSession("10.100.100.254", "metgroup2021");

global.routeId = "";
global.busId = "";
global.lat = "";
global.lon = "";

session.get(oids, (error, varbinds) => {
  if (error) console.error(error);
  else {
    global.busId = varbinds[0].value.toString();
	 tables.syncUsersEOD();
  }
  session.close();
});

async function cleanOnLoad() {
  await tables
    .getOldUsers()
    .then(async (users) => {
      if (users.length > 0) {
        await tables.deleteUsers(users).catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
}

cleanOnLoad();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { navbar: 0 });
});

router.get("/terms", (req, res) => {
  res.render("terms", { navbar: 2 });
});

router.get("/help", (req, res) => {
  res.render("help", { navbar: 2 });
});

router.get("/login", (req, res) => {
  res.render("initialForm", { navbar: 1 });
});

router.get("/announcer", (req, res) => {
  const directoryPath = "public/media/videos/adds",
    extension = ".mp4";
  fs.readdir(directoryPath, function (err, files) {
    if (err) return console.log("Unable to scan directory: " + err);
    else {
      let targetFiles = files.filter(function (file) {
        return (
          path.extname(directoryPath + "/" + file).toLowerCase() === extension
        );
      });
      let fileName = targetFiles[0],
        message = "Bienvenidos a Transmilenio. Que tengan un excelente viaje.";
      res.render("announcer", {
        title: "SITP - Transmilenio",
        files: targetFiles,
        file: fileName,
        navbar: 2,
        message: message,
      });
    }
  });
});

router.post("/updatemap", (req, res) => {
  global.lat = req.body.lat;
  global.lon = req.body.lon;
  let location = {
    messageTime: req.body.time,
    lat: req.body.lat,
    lon: req.body.lon,
    speed: req.body.speed,
    busId: global.busId,
    routeId: global.routeId,
  };
  socketApi.sendLocation(location);
  res.sendStatus(200);
  //tables.addLocation(location).then(location => res.sendStatus(200)).catch(err => console.log(err));
});

router.get("/getLastLocation", (req, res) => {
  tables
    .getLastLocation()
    .then((location) => 
    res.json(location)).catch((err) => console.log(err));
});

router.get("/map", (req, res) => {
  res.render("map", { title: "SITP - Transmilenio", navbar: 2 });
});

router.get("/error", (req, res) => {
  res.render("fail", { title: "SITP - Transmilenio", navbar: 1 });
});

// streamax MDVR routes
/*router.get('/tmsaroutedata', async (req, res) => {
  let query = parseInt(req.body.msgkind);
  if (query === 0) {
    res.json({idRoute: 'No disponible'})
  } else {
    res.sendStatus(400);
  }
});

router.post('/tmsadata', async (req, res) => {
  let query = parseInt(req.body.msgkind);
  if (query === 0) {
    if (req.body.msgcontent.length <= 256 ) {
      await tables.addNewTmsaMessage({broadcastdate: req.body.broadcastdate, content: req.body.msgcontent}).then(msg => res.sendStatus(200)).catch(err => console.log(err));
    } else {
      res.sendStatus(400);
    }
  } else if (query == 1) {
    res.sendStatus(200);
  } else {
    res.sendStatus(400)
  }
});*/

router.get("/getLastMessageContent", (req, res) => {
  tables
    .getLastMessage()
    .then((message) => res.json(message[0]))
    .catch((err) => console.log(err));
});

router.post("/parseroute", (req, res) => {
  let request = req.body;
console.log("**** : ", req.body);
  for (let i in request.routes) {
    var routeVerify = request.routes[i].includes("2,170,76,0,");
    if (routeVerify) {
      request.routes[i] = request.routes[i].slice(0, 38);
      console.log("---> ", request.routes[i] + " :" + i);
    }
  }

  let used = request.used.data[0] + request.used.data[1] - 1,
    selected = request.routes[used],
    divided = selected.split(","),
    filtered = divided.filter((elem) => {
      return elem != "";
    });
  if (used == request.routes.length - 1) filtered.pop();
  let reconstituted = String.fromCharCode.apply(String, filtered);
  let routeId = reconstituted.replace(/[^0-9a-zÃ¡Ã©Ã­Ã³ÃºÃ± ]/gi, "");
	console.log("****routeId : ", routeId);
  if (
    (/\d/g.test(routeId[1]) || /\d/g.test(routeId[1])) &&
    !/A|B/i.test(routeId[routeId.length - 1]) &&
    !/\d/g.test(routeId[routeId.length - 1])
  ) {
    global.routeId = routeId.substring(0, 4);
console.log("****global.routeId : ", global.routeId);
  } else {
    global.routeId = routeId;
console.log("ELSE****global.routeId : ", global.routeId);
  }
  var hoy = new Date();
  if (hoy.getDate() <= 9) {
    if (hoy.getMonth() < 9) {
      var fecha =
        "0" +
        hoy.getDate() +
        "-0" +
        (hoy.getMonth() + 1) +
        "-" +
        hoy.getFullYear();
    } else {
      var fecha =
        "0" +
        hoy.getDate() +
        "-" +
        (hoy.getMonth() + 1) +
        "-" +
        hoy.getFullYear();
    }
  } else {
    if (hoy.getMonth() < 9) {
      var fecha =
        hoy.getDate() + "-0" + (hoy.getMonth() + 1) + "-" + hoy.getFullYear();
    } else {
      var fecha =
        hoy.getDate() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getFullYear();
    }
  }

  if (hoy.getHours() <= 9) {
    if (hoy.getMinutes() <= 9) {
      var hora = "0" + hoy.getHours() + ":0" + hoy.getMinutes();
    } else {
      var hora = "0" + hoy.getHours() + ":" + hoy.getMinutes();
    }
  } else {
    if (hoy.getMinutes() <= 9) {
      var hora = hoy.getHours() + ":0" + hoy.getMinutes();
    } else {
      var hora = hoy.getHours() + ":" + hoy.getMinutes();
    }
  }

  var fechaYHora = fecha + " " + hora;
  //Obteniendo una variable con la mÃ¡scara d-m-Y H:i:s

  socketApi.sendType5("Ruta: " + global.routeId + ",   " + fecha + " " + hora);

  res.sendStatus(200);
});

// streamax disposable routes
router.get("/tmsaroutedata", async (req, res) => {
  let query = parseInt(req.query.msgquery);
  if (query === 0) {
    res.json({ idRoute: global.routeId });
  } else if (query === 1) {
    res.json({ alive: true });
  } else {
    res.sendStatus(400);
  }
});

router.post("/tmsaroutedata", async (req, res) => {
  let query = parseInt(req.body.msgkind);
  if (query >= 0) {
    if (req.body.msgcontent.length <= 256) {
      socketApi.sendType5(req.body.msgcontent);
      res.sendStatus(200);
      //await tables.addNewTmsaMessage({broadcastdate: req.body.broadcastdate, content: req.body.msgcontent}).then(msg => res.sendStatus(200)).catch(err => console.log(err));
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
  }
});


//add endpoint, to receive transmilenio publications
router.post("/tmsadata", async (req, res) => {
  let query = parseInt(req.body.msgkind);
  if (query >= 0) {
    if (req.body.msgcontent.length <= 256) {
      socketApi.sendType5(req.body.msgcontent);
      res.sendStatus(200);
      //await tables.addNewTmsaMessage({broadcastdate: req.body.broadcastdate, content: req.body.msgcontent}).then(msg => res.sendStatus(200)).catch(err => console.log(err));
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
  }
});

router.post('/connectedUsers', async (req, res) => {
//latitude: global.lat, longitude: global.lon
  let user = {traveler_kind: req.body.traveler_kind, stratum: req.body.stratum, age: req.body.age, gender: req.body.gender, busId: global.busId, routeId: global.routeId}
    await tables.addUser(user).then(
      user => res.sendStatus(200)
      ).catch(err => {
    console.log(err);
    res.sendStatus(400)
  });
  await tables.syncUsersEOD();
});

router.get("/videosportal", (req, res) => {
  const directoryPath = "public/media/videos";
  fs.readdir(directoryPath, function (err, files) {
    if (err) return console.log("Unable to scan directory: " + err);
    else {
      var results = {},
        tmp = [];
      files.forEach(function (file) {
        tmp = fs.readdirSync(directoryPath + "/" + file);
        tmp.forEach(function (archive) {
          if (path.extname(directoryPath + "/" + archive) == ".jpg")
            results[file] = archive;
        });
      });
      console.log("videosportal");
      res.render("videosportal", {
        title: "SITP - Transmilenio",
        videos: results,
        directoryPath: directoryPath,
        navbar: 2,
      });
    }
  });
});

router.get('/getAllUsers', (req, res) => {
  tables.selectUser().then(location => res.json(location)).catch(err => console.log(err));
});

module.exports = router;
