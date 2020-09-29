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

  $(function() {
    $('.pop').on('click', function() {
      $('.imagepreview').attr('src', $(this).find('img').attr('src'));
      $('#imagemodal').modal('show');   
    });		
  });
  
  $(document).ready(function(){
    $(".dropdown-trigger").dropdown();
    $('.sidenav').sidenav();
  });

})(jQuery); // End of use strict and on document ready