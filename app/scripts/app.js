/*global $:false */

'use strict';

var app = angular
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
      .when('/events/new', {
        templateUrl: 'views/forms/event.html',
        controller: 'EventFormCtrl'
      })
      .when('/events/:id/edit', {
        templateUrl: 'views/forms/event.html',
        controller: 'EventFormCtrl'
      })
      .when('/apps', {
        templateUrl: 'views/apps.html',
        controller: 'AppCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

app.factory('appSettings', function() {
  var BASE_URL = 'http://localhost:3000';

  return {
    urls: {
      embedCode: 'TODO:INSERT-HERE',
      events: BASE_URL + '/events',
      applications: BASE_URL + '/applications'
    }
  };
});

var $menu = $('#mainmenu');
app.factory('menu', function() {
  return function(page) {
    $menu.find('.active').removeClass('active');
    $menu.find('[data-page="' + page + '"]').addClass('active');
  };
});

// Need to attach one global variable to the window object
// (this is for storing data temporarily)
window.apps4eu = {};
