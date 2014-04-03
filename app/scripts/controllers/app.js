/*global $:false */

'use strict';

angular.module('apps4europeAdminInterfaceApp')
  .controller('AppCtrl', function ($scope, $http, appSettings, menu) {

    menu('apps');

    $scope.message = window.apps4eu.message;
    delete window.apps4eu.message;

    $scope.embedCodeUrl = appSettings.urls.embedCode;

    $http({
      method:'GET',
      url:appSettings.urls.applications + '?sort=-_id',
    })
    .success(function(data) {
      $scope.apps = data;

      // TODO: fake data for test purposes
      $.each($scope.apps, function(i, app) {
        app.published = i % 2 === 0;
      });
    });
  });
