'use strict';

angular.module('apps4europeAdminInterfaceApp')
  .controller('AppsCtrl', function ($scope, $http, apps, menu) {

    menu('apps');

    $scope.message = window.apps4eu.message;
    delete window.apps4eu.message;

    apps.get(function (error, apps) {
      $scope.apps = apps;
    });
  });
