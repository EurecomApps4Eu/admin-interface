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
      .otherwise({
        redirectTo: '/'
      });
  });

app.factory('appSettings', function() {

  var BASE_URL = 'http://localhost:3000';

  return {
    urls: {
      embedCode: 'TODO:INSERT-HERE',
      events: BASE_URL + '/events'
    }
  };
});

// Need to attach one global variable to the window object
// (this is for storing data temporarily)
window.apps4eu = {};
