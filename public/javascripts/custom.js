(function($) {
  "use strict";

   $(document).on('click', '#sidebarToggle', function(e) {  
    e.preventDefault();
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
  });

  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($window.width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  $('#toTop').on('click', function(e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, 500);
    return false;
  })

  $('.pop').on('click', function() {
    $('.imagepreview').attr('src', $(this).find('img').attr('src'));
    $('#imagemodal').modal('show');   
  });		
  
  $(".dropdown-trigger").dropdown();
  $('.sidenav').sidenav({
    closeOnClick: true
  });
  
  $('.slider').slider();

  $('.collapsible').collapsible();

  $('.materialboxed').materialbox();

  $('.modal').modal();

  $('select').formSelect();

  endSetInterval();

  setMap();
  
})(jQuery); // End of use strict and on document ready

function exitModal(ev) {
  ev.preventDefault();
  var elem = document.getElementById('modalExit'), instance = M.Modal.getInstance(elem);
  instance.open();
}

var interval_id = null;

function endSetInterval() {
  var pathname = window.location.pathname
  if (pathname.includes("/announcer") || pathname.includes("/map")){
    interval_id = setInterval(function(){ changeTexts(); }, 15000);
  }else{
    clearInterval(interval_id);
  }
}

function changeTexts() {
  $('#route-content-0').html("Siguiente estación: " + Math.floor(Math.random() * 50));
  $('#route-content-1').html("Lorem ipsum dolor sit amet: " + Math.floor(Math.random() * 1000));
  $('#route-content-2').html("Lorem ipsum dolor sit amet: " + Math.floor(Math.random() * 1000));
  $('#route-content-3').html("Lorem ipsum dolor sit amet: " + Math.floor(Math.random() * 1000));
}

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split(''), color = '#';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.round(Math.random() * 15)];
  }
  return color;
}

function setMap() {
  var pathname = window.location.pathname;
  if (pathname.includes("/map")){
    var mymap = L.map('mapid'), greenIcon = L.icon({iconUrl: '/public/images/bus-marker.png', iconSize: [40, 40]}), marker = L.marker([4.486196, -74.107678], {icon: greenIcon});
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 30
    }).addTo(mymap);
    marker.addTo(mymap);
    mymap.setView([4.486196, -74.107678], 15);
  }
}