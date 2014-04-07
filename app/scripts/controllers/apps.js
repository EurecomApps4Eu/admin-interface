'use strict';

angular.module('apps4europeAdminInterfaceApp')
  .controller('AppsCtrl', function ($scope, $http, apps, menu, $routeParams) {

    menu('apps');

    $scope.search = {};

    if ( $routeParams.connectedEvent ) {
      $scope.search.connectedEvent = $routeParams.connectedEvent;
    }

    $scope.message = window.apps4eu.message;
    delete window.apps4eu.message;

    apps.get(function (error, apps) {
      $scope.apps = apps;
    });
  });
