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

  $(window).resize(paginate).resize();

})(jQuery); // End of use strict and on document ready

function exitModal(ev) {
  ev.preventDefault();
  var elem = document.getElementById('modalExit'), instance = M.Modal.getInstance(elem);
  instance.open();
}

function paginate() {
  var contentBox = $('#target'), words = contentBox.text().split(' '), newPage = $('<div class="individualPage" />');
  contentBox.empty().append(newPage);
  var pageText = null;
  for(var i = 0; i < words.length; i++) {
    var betterPageText = pageText ? pageText + ' ' + words[i] : words[i];
    newPage.text(betterPageText);
    if(newPage.height() > $(window).height()) {
        newPage.text(pageText);
        newPage.clone().insertBefore(newPage);
        pageText = null;
    } else {
      pageText = betterPageText;             
    }
  }    
}