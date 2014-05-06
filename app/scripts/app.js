/*global $:false */

'use strict';

var app = angular
  .module('apps4europeAdminInterfaceApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'mgcrea.ngStrap.datepicker',
    'mgcrea.ngStrap.typeahead',
    'angularFileUpload',
    'ui.sortable'
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
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

app.factory('appSettings', function() {
  var BASE_URL = 'http://localhost:3000';

  return {
    urls: {
      embedCode: 'http://localhost/EurecomProject/event-website/dist/app.bundle.js',
      events: BASE_URL + '/events',
      applications: BASE_URL + '/applications',
      imageUpload: BASE_URL + '/images',
      staticFiles: BASE_URL + '/static',
      login: BASE_URL + '/login',
      register: BASE_URL + '/users',
      users: BASE_URL + '/users'
    },
    eventThemes: [
      'Public administration & policy',
      'Population',
      'Culture/Sport/Leisure time',
      'Territory',
      'Health',
      'Infrastructure',
      'Audience (Youth/Adult/Senior)',
      'Environment & Nature',
      'Education & Lifelong learning',
      'Tourism',
      'Safety',
      'Welfare',
      'Work & Economy',
      'Life/Home'
    ]
  };
});

var $menu = $('#mainmenu');
app.factory('initApp', function($rootScope, $location) {

  $rootScope.signOut = function() {
    localStorage.removeItem('user');
    delete $rootScope.email;
    $location.path('/login');
  };

  return function(page) {
    // Check if user is logged in
    if ( !window.localStorage.getItem('user') && ['/login', '/register'].indexOf($location.path()) === -1 ) {
      $location.path('/login');
    }
    else {
      var user = JSON.parse(window.localStorage.getItem('user'));
      $rootScope.email = user.email;
    }

    // Set active menu element
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

  var get = function get(options, callback) {
    var url = appSettings.urls.applications;

    if ( arguments.length === 2 ) {
      if ( options.id ) {
        url += '/' + options.id + '?1=1';
      }
      else if ( options.select ) {
        url += '?select=' + options.select;
      }
      else {
        url += '?1=1';
        $.each(options, function(key, value) {
          url += '&' + key + '=' + value;
        });
      }
    }
    else {
      callback = options;
      url += '?sort=-_id';
    }

    if ( !options.select ) {
      url += '&populate=connectedEvent';
    }

    $http({
      method: 'GET',
      url: url,
    })
    .success(function(apps) {
      if ( apps instanceof Array ) {
        // Ensure that connected event is always present
        $.each(apps, function(i, app) {
          if ( !app.connectedEvent ) {
            app.connectedEvent = '';
          }
        });
      }
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

// TODO: send the auth token always here, instead of in the individual functions
app.factory('httpRequestInterceptor', function () {
  return {
    request: function (config) {
      $('body').addClass('loading');
      return config;
    },
    response: function(response) {
      $('body').removeClass('loading');
      return response;
    }
  };
});

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('httpRequestInterceptor');
});

// Need to attach one global variable to the window object
// (this is for storing data temporarily)
window.apps4eu = {};
