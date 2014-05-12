/*global alert,confirm,$:false */

'use strict';

angular.module('apps4europeAdminInterfaceApp')
  .controller('AppFormCtrl', function ($scope, $http, $location, appSettings, events, apps, $routeParams, initApp, $upload) {

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
      datasets: [{}],
      images: [],
      authors: [{}]
    };

    if ( $routeParams.id ) {
      $scope.title = 'Edit app';
      $scope.saveBtnTitle = 'Save app';
      $scope.saveMsg = 'App saved successfully.';

      $scope.editMode = true;
      $scope.appId = $routeParams.id;
      apps.get({id: $scope.appId}, function(error, data) {
        $scope.formData = data;

        // Ensure images are initialize
        if ( !$scope.formData.images ) {
          $scope.formData.images = [];
        }
        else {
          var rawImages = $scope.formData.images.slice();
          $scope.formData.images = [];

          angular.forEach(rawImages, function(img) {

            var src;
            var name;

            if ( img.indexOf('://') !== -1 ) {
              src = img;
              var parts = img.split('/');
              name = parts[parts.length - 1];
            }
            else {
              src = appSettings.urls.staticFiles + '/images/' + $scope.appId + '/' + img;
              name = img;
            }

            $scope.formData.images.push({
              src: src,
              name: name,
              isUploading: function() {
                return false;
              },
              progress: function() {
                return 100;
              },
              getPreview: function() {
                return src;
              }
            });

          });
        }

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

    $scope.addUrlImage = function() {
      var parts = $scope.imageUrl.split('/');
      var name = parts[parts.length - 1];
      var src = $scope.imageUrl;
      $scope.imageUrl = '';

      $scope.formData.images.push({
        src: src,
        name: name,
        isUploading: function() {
          return false;
        },
        progress: function() {
          return 100;
        },
        getPreview: function() {
          return src;
        }
      });
    };

    $scope.cancelImage = function(index) {
      var image = $scope.formData.images.splice(index, 1);
      if ( image.isUploading && image.abort ) {
        image.abort();
      }
    };

    $scope.onFileSelect = function($files) {
      //$files: an array of files selected, each file has name, size, and type.

      angular.forEach($files, function(file) {

        var image;
        var src;
        var percent;
        var isUploading = true;

        $scope.upload = $upload.upload({
          url: appSettings.urls.imageUpload, //upload.php script, node.js route, or servlet url
          method: 'POST',
          // headers: {'header-key': 'header-value'},
          // withCredentials: true,
          file: file, // or list of files: $files for html5 only
          /* set the file formData name ('Content-Desposition'). Default is 'file' */
          //fileFormDataName: myFile, //or a list of names for multiple files (html5).
          /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
          //formDataAppender: function(formData, key, val){}
        }).progress(function(evt) {
          percent = parseInt(100.0 * evt.loaded / evt.total);
        }).success(function(response) {
          isUploading = false;
          image.tmpName = response;
        }).error(function() {
          // Find and delete the image from $scope
          for ( var i = $scope.formData.images.length - 1; i >= 0; i -- ) {

            var candidate = $scope.formData.images[i];

            if ( candidate.name === image.name ) {
              $scope.formData.images.splice(i, 1);
              break;
            }
          }

          alert('Upload failed! Maximum size for file is 8 MB.');
        });

        image = {
          isUploading: function() {
            return isUploading;
          },
          progress: function() {
            return percent;
          },
          getPreview: function() {
            return src;
          },
          abort: $scope.upload.abort,
          name: file.name
        };

        $scope.formData.images.push(image);

        // Preview the image
        var reader = new FileReader();
        reader.onload = function() {
          src = reader.result;
          $scope.$apply();
        };
        reader.readAsDataURL(file);

      });
    };
  });
