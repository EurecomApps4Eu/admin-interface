/*global confirm,$:false */

'use strict';

angular.module('apps4europeAdminInterfaceApp')
  .controller('AppFormCtrl', function ($scope, $http, $location, appSettings, events, apps, $routeParams, initApp) {

    initApp('apps');

    $scope.title = 'Add app';
    $scope.saveBtnTitle = $scope.title;
    $scope.saveMsg = 'App added successfully.';

    events.get(function(error, events) {
      $scope.events = events;
    });

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

    // Init default values
    $scope.formData = {
      published: true,
      datasets: ['']
    };

    if ( $routeParams.id ) {
      $scope.title = 'Edit app';
      $scope.saveBtnTitle = 'Save app';
      $scope.saveMsg = 'App saved successfully.';

      $scope.editMode = true;
      $scope.appId = $routeParams.id;
      apps.get({id: $scope.appId}, function(error, data) {
        $scope.formData = data;

        if ( data.connectedEvent ) {
          $scope.connectedEventTitle = data.connectedEvent.title;
          $scope.formData.connectedEvent = data.connectedEvent._id;
        }

        // Need to init wysiwyg separately
        $text.code(data.text);
      });
    }

    // If initialized from event page
    if ( $routeParams.modal ) {
      $scope.title = 'Submit app';
      $scope.saveBtnTitle = $scope.title;

      $scope.formData.published = false;
      $scope.modal = true;
      $scope.formData.connectedEvent = $routeParams.connectedEvent;
      $('body').addClass('isModal');

      (function updateModalHeight() {
        window.parent.postMessage(JSON.stringify({
          fn: 'setModalHeight',
          argument: $('#ngView').innerHeight()
        }), '*');

        setTimeout(updateModalHeight, 500);
      })();

    }

    $scope.setEvent = function() {
      for ( var i = 0; i < $scope.events.length; i ++ ) {
        var event = $scope.events[i];
        if ( event.title === $scope.connectedEventTitle ) {
          $scope.formData.connectedEvent = event._id;
          $scope.invalidEvent = false;
          return;
        }
      }
      $scope.formData.connectedEvent = null;
      $scope.invalidEvent = true;
    };

    $scope.saveApp = function() {

      // Need to set wysiwyg field manually, because two-way binding
      // doesn't work on it.
      $scope.formData.text = $text.code();

      apps.save($scope.formData, function(error) {

        if ( error ) {
          // TODO
        }

        if ( $scope.modal ) {
          $scope.modalSaved = true;
          return;
        }

        window.apps4eu.message = {
          type: 'success',
          message: $scope.saveMsg
        };
        $location.path('/apps');
      });
    };

    $scope.deleteApp = function() {
      if ( confirm('Are you sure you want to delete the app? This cannot be undone.') ) {
        apps.remove($scope.appId, function() {
          window.apps4eu.message = {
            type: 'success',
            message: 'App deleted successfully.'
          };
          $location.path('/apps');
        });
      }
    };

    $scope.closeModal = function() {
      window.parent.postMessage(JSON.stringify({
        fn: 'closeModal'
      }), '*');
    };
  });
