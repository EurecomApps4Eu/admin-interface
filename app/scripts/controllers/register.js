'use strict';

angular.module('apps4europeAdminInterfaceApp')
.controller('RegisterCtrl', function ($scope, $http, $location, appSettings) {

  $scope.register = function() {

    $http({
      method:'POST',
      data: $scope.form,
      url:appSettings.urls.register,
    })
    .success(function() {
      // TODO: auto login and/or show info message that account was created
      $location.path('/login');
    })
    .error(function() {
      // TODO
    });

  };

});
