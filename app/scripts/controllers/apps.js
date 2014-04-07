'use strict';

angular.module('apps4europeAdminInterfaceApp')
  .controller('AppsCtrl', function ($scope, $http, apps, menu, $routeParams) {

    menu('apps');

    $scope.search = {
      published:''
    };

    $scope.statuses = [
      {label:'Filter by status', value:''},
      {label:'Published', value:true},
      {label:'Unpublished', value:false}
    ];

    if ( $routeParams.connectedEvent ) {
      $scope.search.connectedEvent = $routeParams.connectedEvent;
    }

    $scope.message = window.apps4eu.message;
    delete window.apps4eu.message;

    apps.get(function (error, apps) {
      $scope.apps = apps;
    });
  });
