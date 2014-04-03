'use strict';

angular
  .module('apps4europeAdminInterfaceApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/events', {
        templateUrl: 'views/events.html',
        controller: 'EventCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

// Tmp fix for links
$(document).on('ready', function() {
  $('body').on('click', 'a', function(e) {
    var $el = $(this);

    // Test for relative links
    var href = $el.attr('href');
    if ( href.indexOf('//') === -1 && href.indexOf('/#/') === -1 ) {
      $el.attr('href', '/#' + href);
    }
  });
});
