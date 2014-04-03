'use strict';

angular.module('apps4europeAdminInterfaceApp')
  .controller('MainCtrl', function ($scope, $http, appSettings, menu) {

    menu('main');

    // Fetch latest events
    $http({
      url: appSettings.urls.events + '?sort=-startDate&limit=5',
      method: 'GET'
    })
    .success(function(data) {
      $scope.events = data;
    });

  });
