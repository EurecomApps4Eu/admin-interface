'use strict';

angular.module('apps4europeAdminInterfaceApp')
  .controller('MainCtrl', function ($scope, $http, appSettings, initApp) {

    initApp('main');

    // Fetch latest events
    $http({
      url: appSettings.urls.events + '?sort=-startDate&limit=5',
      method: 'GET'
    })
    .success(function(data) {
      $scope.events = data;
    });

    // Fetch latest apps
    $http({
      url: appSettings.urls.applications + '?sort=-_id&limit=5',
      method: 'GET'
    })
    .success(function(data) {
      $scope.apps = data;
    });

  });
