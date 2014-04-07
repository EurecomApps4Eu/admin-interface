'use strict';

angular.module('apps4europeAdminInterfaceApp')
  .controller('EventsCtrl', function ($scope, $http, appSettings, menu, events) {

    menu('events');

    // After creating a new event, the user is redirected into this
    // view and the newly created event is available in this var.
    $scope.createdEvent = window.apps4eu.createdEvent;
    delete window.apps4eu.createdEvent;

    $scope.message = window.apps4eu.message;
    delete window.apps4eu.message;

    $scope.embedCodeUrl = appSettings.urls.embedCode;

    events.get(function(error, events) {
      $scope.events = events;
    });
  });
