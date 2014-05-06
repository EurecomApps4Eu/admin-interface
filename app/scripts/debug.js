/*global $:false */

'use strict';

// Tmp fix for links
$(document).on('ready', function() {
  $('body').on('click', 'a', function() {
    var $el = $(this);

    // Test for relative links
    var href = $el.attr('href');
    if ( href && href.indexOf('//') === -1 && href.indexOf('/#/') === -1 ) {
      $el.attr('href', '/#' + href);
    }
  });
});
