/*global $:false */

'use strict';

angular.module('apps4europeAdminInterfaceApp')
.controller('EventsCtrl', function ($scope, $http, appSettings, initApp, events, apps) {

  initApp('events');

  $scope.eventApps = {};

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

  // Get apps, so that we can show the related apps link
  apps.get({select:'connectedEvent'}, function(error, apps) {
    $.each(apps, function(i, app) {
      if ( app.connectedEvent ) {
        if ( !$scope.eventApps[app.connectedEvent] ) {
          $scope.eventApps[app.connectedEvent] = 0;
        }
        $scope.eventApps[app.connectedEvent] ++;
      }
    });
  });

});
