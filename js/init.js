$(document).ready(function(){
  $('.collapsible').collapsible();
  $('.scrollspy').scrollSpy();

    $('.parallax').parallax();

    $('.tabs').tabs();
    M.updateTextFields();
    $('.carousel.carousel-slider').carousel({
      fullWidth: true,
      indicators: true,
    });
    $('.modal').modal();

    $('.tooltipped').tooltip();

    $('.dropdown-trigger').dropdown();
    $('.datepicker').datepicker();
    $('select').formSelect();
    $('.timepicker').timepicker({
      vibrate: true,
      showClearBtn: true,
    });
    // $(".button-collapse").sideNav();


  }); // end of document ready
