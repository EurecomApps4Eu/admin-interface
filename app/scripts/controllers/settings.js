'use strict';

angular.module('apps4europeAdminInterfaceApp')
  .controller('SettingsCtrl', function ($scope, $http, appSettings, initApp) {

    initApp('settings');

    var user = JSON.parse(window.localStorage.getItem('user'));

    $http({
      method:'GET',
      url:appSettings.urls.users + '/me',
      headers: {
        Authorization: 'Token ' + user.token
      }
    })
    .success(function(data) {
      $scope.formData = data;
    });

    $scope.save = function() {

      $http({
        method:'PUT',
        url:appSettings.urls.users + '/' + $scope.formData._id,
        headers: {
          Authorization: 'Token ' + user.token
        },
        data: $scope.formData
      })
      .success(function() {
        $scope.success = true;
      });
    };

    $scope.message = window.apps4eu.message;
    delete window.apps4eu.message;
  });
