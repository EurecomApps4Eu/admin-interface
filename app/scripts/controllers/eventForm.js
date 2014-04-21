/*global confirm,$:false */

'use strict';

angular.module('apps4europeAdminInterfaceApp')
  .controller('EventFormCtrl', function ($scope, $http, $location, apps, appSettings, $routeParams, initApp) {

    initApp('events');

    // TODO: create factory/service for user
    var user = JSON.parse(window.localStorage.getItem('user'));

    // Init wysiwyg
    var $text = $('#text');
    $text.summernote({
      height:200,
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'italic', 'underline']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['insert', ['link']],
        ['view', ['fullscreen']]
      ]
    });

    $scope.themes = appSettings.eventThemes;

    if ( $routeParams.id ) {
      $scope.editMode = true;
      $scope.eventId = $routeParams.id;
      $http({
        method:'GET',
        url:appSettings.urls.events + '/' + $routeParams.id,
      })
      .success(function(data) {
        $scope.formData = data;

        // Need to init wysiwyg separately
        $text.code(data.text);
      });

      apps.get({connectedEvent:$scope.eventId}, function(error, apps) {
        if ( error ) {
          // TODO
        }
        $scope.apps = apps;
      });
    }
    else {
      $scope.formData = {
        juryMembers: [{}]
      };
    }

    $scope.addJuryMember = function() {
      $scope.formData.juryMembers.push({});
    };

    $scope.deleteJuryMember = function(index) {
      $scope.formData.juryMembers.splice(index, 1);
    };

    $scope.saveEvent = function() {

      // Need to set wysiwyg field manually, because two-way binding
      // doesn't work on it.
      $scope.formData.text = $text.code();

      if ( $scope.editMode ) {
        $http({
          method:'PUT',
          url:appSettings.urls.events + '/' + $scope.eventId,
          data: $scope.formData,
          headers: {
            Authorization: 'Token ' + user.token
          }
        })
        .success(function(data) {

          // Save the object temporarily, so that we show info about it on the events page
          window.apps4eu.createdEvent = data;

          // Redirect to event listing
          $location.path('/events');
        });
      }

      else {
        $http({
          method:'POST',
          url:appSettings.urls.events,
          data: $scope.formData,
          headers: {
            Authorization: 'Token ' + user.token
          }
        })
        .success(function(data) {

          // Save the object temporarily, so that we show info about it on the events page
          window.apps4eu.createdEvent = data;

          // Redirect to event listing
          $location.path('/events');
        });
        /*
        TODO
        .error(function(data, status, headers, config) {

        });
        */
      }
    };

    $scope.deleteEvent = function() {
      if ( confirm('Are you sure you want to delete the event? This cannot be undone.') ) {
        $http({
          url:appSettings.urls.events + '/' + $scope.eventId,
          method: 'DELETE'
        })
        .success(function() {
          window.apps4eu.message = {
            type: 'success',
            message: 'Event deleted successfully.'
          };
          $location.path('/events');
        });
      }
    };
  });
