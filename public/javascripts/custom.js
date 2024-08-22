(function ($) {
  "use strict";

  $(document).on("click", "#sidebarToggle", function (e) {
    e.preventDefault();
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
  });

  $("body.fixed-nav .sidebar").on(
    "mousewheel DOMMouseScroll wheel",
    function (e) {
      if ($window.width() > 768) {
        var e0 = e.originalEvent,
          delta = e0.wheelDelta || -e0.detail;
        this.scrollTop += (delta < 0 ? 1 : -1) * 30;
        e.preventDefault();
      }
    }
  );

  $("#toTop").on("click", function (e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, 500);
    return false;
  });

  $(".pop").on("click", function () {
    $(".imagepreview").attr("src", $(this).find("img").attr("src"));
    $("#imagemodal").modal("show");
  });

  $(".dropdown-trigger").dropdown();
  $(".sidenav").sidenav({
    closeOnClick: true,
  });

  $(".slider").slider();

  $(".collapsible").collapsible();

  $(".materialboxed").materialbox();

  $(".modal").modal();

  $("select").formSelect();

  removeContainer();
})(jQuery);

let interval_id = null,
  map = null,
  big_interval_id = null,
  marker = null,
  mapFiles = {},
  mapUpdater = null,
  iterator = 0,
  mapRender = true;
isSwitchMap = true
clearInterval(interval_id);

var socket = io();

const pathname = window.location.pathname,
  wholeStr =
    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus minima iste ut, est, culpa accusantium dolorem obcaecati cupiditate vel sunt eum ea blanditiis tempora dolor quas rem eaque libero in doloribus nulla velit sapiente. Iure quis accusant.";

function exitModal(ev) {
  ev.preventDefault();
  var elem = document.getElementById("modalExit"),
    instance = M.Modal.getInstance(elem);
  instance.open();
}

function changeTexts() {
  $("#route-content-0").html(
    "Siguiente estación: " + Math.floor(Math.random() * 50)
  );
  $("#route-content-1").html(
    "Lorem ipsum dolor sit amet: " + Math.floor(Math.random() * 1000)
  );
  $("#route-content-2").html(
    "Lorem ipsum dolor sit amet: " + Math.floor(Math.random() * 1000)
  );
  $("#route-content-3").html(
    "Lorem ipsum dolor sit amet: " + Math.floor(Math.random() * 1000)
  );
}

function getRandomColor() {
  var letters = "0123456789ABCDEF".split(""),
    color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.round(Math.random() * 15)];
  }
  return color;
}

function playVideo() {
  var pathname = window.location.pathname;
  if (pathname.includes("/announcer")) {
    var video = document.getElementById("video-player-annoucements");
    setTimeout(() => {
      video.play();
    }, 1000);
  }
}


function setMap() {
  map = L.map('mapid').setView([4.486196, -74.107678], 20);
  const busIcon = L.divIcon({
    className: 'custom-svg-icon',
    html: `
        <svg width="90" height="90" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" stroke="purple" stroke-width="3" fill="white"/>
            <image href="/public/images/bus.png" x="5" y="5" width="30" height="30"/>
        </svg>
    `,
    iconSize: [90, 90]
  });

  marker = L.marker([4.486196, -74.107678], { icon: busIcon })

  markerIcon = L.icon({ iconUrl: '/public/images/little-square.png' });
  marker.addTo(map);
  L.tileLayer('/public/media/map/transport/{z}/{x}/{y}.png', {
    maxZoom: 16,
    minZoom: 6
  }).addTo(map);

  requestFull(map);
}
/* function setMap() {
  //la configuracion del CRS se puede llevar a otro archivo configurable para mejor uso de los estilos
  var crs = new L.Proj.CRS('EPSG:3857', '+proj=longlat +units=m +no_defs', {
    origin: [-2.0037508342787E7, 2.0037508342787E7],
    resolutions: [
      156543.03392800014,
      78271.51696399994,
      39135.75848200009,
      19567.87924099992,
      9783.93962049996,
      4891.96981024998,
      2445.98490512499,
      1222.992452562495,
      611.4962262813797,
      305.74811314055756,
      152.87405657041106,
      76.43702828507324,
      38.21851414253662,
      19.10925707126831,
      9.554628535634155,
      4.77731426794937,
      2.388657133974685,
      1.1943285668550503,
      0.5971642835598172,
      0.29858214164761665,
      0.14929107082380833
    ]
  });

  map = L.map('mapid').setView([4.486196, -74.107678], 20);

  const busIcon = L.icon({ iconUrl: '/public/images/bus-marker.png', iconSize: [40, 40] });

  marker = L.marker([4.486196, -74.107678], { icon: busIcon })

  const markerIcon = L.icon({ iconUrl: '/public/images/little-square.png' });

  requestFull(map);

  L.esri.tiledMapLayer({
    url: 'https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/mapa_hibrido/MapServer?f=json',
    maxZoom: 21,
    minZoom: 5
  }).addTo(map);

  const stops = L.esri.featureLayer({
    url: 'https://gis.transmilenio.gov.co/arcgis/rest/services/Zonal/consulta_paraderos_zonales/FeatureServer/1',
    pointToLayer: function (geojson, latlng) {
      return L.marker(latlng, {
        icon: markerIcon
      });
    }
  }).addTo(map);

  stops.bindPopup(function (layer) {
    return L.Util.template('<ul><li><b>Nombre:</b>{nombre_paradero}</li><li><b>Dirección: </b>{direccion_paradero}</li></ul>', layer.feature.properties);
  });

  marker.addTo(map);
} */

/* Misma funcion, pero con la configuracion crs */
/* function setMap() {
  //la configuracion del CRS se puede llevar a otro archivo configurable para mejor uso de los estilos
  var crs = new L.Proj.CRS('EPSG:4686', '+proj=longlat +units=m +no_defs', {
    origin: [-400.0, 399.9999999999998],
    resolutions: [
      1.4078260157301528,
      0.7039130078650764,
      0.3519565039325382, 
      0.1759782519662691, 
      0.08798912597123724, 
      0.043994562997515925, 
      0.021997281496378505, 
      0.010998640746999522, 
      0.005499320373499761, 
      0.0027496601879396106, 
      0.001374830093493913, 
      6.874150466279835E-4,
      3.4370752343296484E-4,
      1.718537616926878E-4,
      8.592688083444659E-5,
      4.2963440417223295E-5,
      2.148172021099111E-5,
      1.0740860104305824E-5,
      5.3704300533426425E-6,
      2.685215025481591E-6,
      1.3426075127407955E-6,
      6.713037563703978E-7,
      3.356518781851989E-7,
      1.6782593909259944E-7
    ]
  });

  map = L.map('mapid', { crs: crs }).setView([4.486196, -74.107678], 21);

  const busIcon = L.icon({ iconUrl: '/public/images/bus-marker.png', iconSize: [40, 40] });
  marker = L.marker([4.486196, -74.107678], { icon: busIcon })

  const markerIcon = L.icon({ iconUrl: '/public/images/little-square.png' });

  requestFull(map);

  L.esri.tiledMapLayer({
    url: 'https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/mapa_base_4686/MapServer?f=json',
    maxZoom: 21,
    minZoom: 1
  }).addTo(map);

  const stops = L.esri.featureLayer({
    url: 'https://gis.transmilenio.gov.co/arcgis/rest/services/Zonal/consulta_paraderos_zonales/FeatureServer/1',
    pointToLayer: function (geojson, latlng) {
      return L.marker(latlng, {
        icon: markerIcon
      });
    }
  }).addTo(map);
  
  stops.bindPopup(function (layer) {
    return L.Util.template('<ul><li><b>Nombre:</b>{nombre_paradero}</li><li><b>Dirección: </b>{direccion_paradero}</li></ul>', layer.feature.properties);
  });

  marker.addTo(map);
} */


function updateMap(location) {

  let dateFormat = new Date(location.messageTime).toLocaleString('es-ES', { timeZone: 'America/Bogota' })
  let center = [location.lat, location.lon],
    popupText = `<ul style="text-align: center; font-size: 1rem; "><li><b>${location.busId}</b></li><li><b>${location.routeId}</b></li><li><b>${location.speed} km/h</b></li><li><b>${dateFormat}</b></li></ul>`;
  marker.setLatLng(center).update();
  marker.bindPopup(popupText).openPopup();
  map.panTo(center);
}

async function removeContainer() {
  var pathname = window.location.pathname,
    container = null,
    video = null;
  if (pathname.includes("/announcer")) {
    container = document.getElementById("main-container");
    video = document.getElementById("video-container-div");
    unwrap(container);
    await sleep(200);
    requestFull(video);
  }
}

function unwrap(wrapper) {
  var docFrag = document.createDocumentFragment(),
    child = undefined;
  while (wrapper.firstChild) {
    child = wrapper.removeChild(wrapper.firstChild);
    docFrag.appendChild(child);
  }
  wrapper.parentNode.replaceChild(docFrag, wrapper);
}

function videoAndMap(files) {
  const pathname = window.location.pathname;
  if (pathname.includes("/announcer")) {
    files = files.split(",");
    var howMany = files.length - 1,
      video = document.getElementById("video-player-annoucements"),
      source = document.querySelector("#video-player-annoucements > source"),
      mapDIV = document.getElementById("mapid"),
      newUrl = "";
    iterator = iterator < howMany ? iterator + 1 : 0;
    newUrl = encodeURI(
      window.location.origin + "/video/adds/" + files[iterator]
    );
    if (iterator % 2 == 0) {
      video.style.display = "none";
      mapDIV.style.display = "block";
      isSwitchMap = true

      if (mapRender) {
        mapFiles = setMap();
        mapRender = false;
      }

      setTimeout(() => {
        source.src = newUrl;
        video.load();
        video.style.display = "block";
        mapDIV.style.display = "none";
        isSwitchMap = false;
        video.play();
      }, 30000);
    } else {
      source.src = newUrl;
      video.load();
      video.play();
    }
  }
}

function requestFull(elem) {
  if (elem.requestFullscreen) elem.requestFullscreen();
  else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
  else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
}

function animateScroll() {
  const target = document.getElementById("information-target");
  let offset = target.offsetHeight,
    times = 1;
  interval_id = setInterval(() => {
    if (target.scrollTop === target.scrollHeight - offset) {
      clearInterval(interval_id);
      target.scrollTop = 0;
      interval_id = null;
      animateScroll();
    }
    scroller(target, offset, times);
    times += 1;
  }, 3000);
}

function scroller(target, offset, times) {
  target.scroll({ top: offset * times, behavior: "smooth" });
}

async function displayMessage(msg) {
  const target = document.getElementById("message-display"),
    msgDIV = document.getElementById("information-target"),
    pathname = window.location.pathname;
  if (pathname.includes("/announcer")) {
    msgDIV.innerHTML = msg;
    animateScroll();
    target.style.display = "block";
    await sleep(20000);
    target.style.display = "none";
  }
}

function toUTC(date) {
  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

socket.on("type5", (data) => {
  displayMessage(data);
});

socket.on("location", (data) => {
  //solo se actualiza el mapa si ya esta cargado, la variable map 
  if (!mapRender && isSwitchMap) updateMap(data);
});
