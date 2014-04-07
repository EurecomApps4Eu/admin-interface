/*global $:false */

'use strict';

var app = angular
  .module('apps4europeAdminInterfaceApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'mgcrea.ngStrap.datepicker',
    'mgcrea.ngStrap.typeahead'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/events', {
        templateUrl: 'views/events.html',
        controller: 'EventsCtrl'
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
        controller: 'AppsCtrl'
      })
      .when('/apps/new', {
        templateUrl: 'views/forms/app.html',
        controller: 'AppFormCtrl'
      })
      .when('/apps/:id/edit', {
        templateUrl: 'views/forms/app.html',
        controller: 'AppFormCtrl'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

app.factory('appSettings', function() {
  var BASE_URL = 'http://localhost:3000';

  return {
    urls: {
      embedCode: 'http://localhost/EurecomProject/apps4europe-frontend/dist/app.bundle.js',
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

app.factory('events', function($http, appSettings) {

  var get = function get(callback) {
    $http({
      method:'GET',
      url:appSettings.urls.events + '?sort=-startDate',
    })
    .success(function(events) {
      callback(null, events);
    })
    .error(function() {
      // TODO
      callback('error');
    });
  };

  return {
    get: get
  };

});

app.factory('apps', function($http, appSettings) {

  var get = function get(id, callback) {
    var url = appSettings.urls.applications;

    if ( arguments.length === 2 ) {
      url += '/' + id + '?1=1';
    }
    else {
      callback = id;
      url += '?sort=-_id';
    }

    url += '&populate=connectedEvent';

    $http({
      method: 'GET',
      url: url,
    })
    .success(function(apps) {
      callback(null, apps);
    })
    .error(function() {
      // TODO
      callback('error');
    });
  };

  var save = function save(data, callback) {
    var options;

    // Are we editing or creating a new?
    if ( data._id ) {
      options = {
        method: 'PUT',
        url: appSettings.urls.applications + '/' + data._id
      };
    }
    else {
      options = {
        method: 'POST',
        url: appSettings.urls.applications
      };
    }

    options.data = data;

    $http(options).success(function (data) {
      callback(null, data);
    })
    .error(function() {
      // TODO
      callback('error');
    });
  };

  var remove = function remove(id, callback) {
    $http({
      url:appSettings.urls.applications + '/' + id,
      method: 'DELETE'
    })
    .success(function() {
      callback(null);
    });
  };

  return {
    get: get,
    save: save,
    remove: remove
  };

});

// Need to attach one global variable to the window object
// (this is for storing data temporarily)
window.apps4eu = {};
