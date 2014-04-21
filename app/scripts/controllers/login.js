'use strict';

angular.module('apps4europeAdminInterfaceApp')
.controller('LoginCtrl', function ($rootScope, $scope, $http, $location, appSettings) {

  $scope.login = function() {

    $http({
      method:'POST',
      data: {
        email: $scope.email,
        password: $scope.password
      },
      url:appSettings.urls.login,
    })
    .success(function(response) {
      window.localStorage.setItem('user', JSON.stringify({
        token: response,
        email: $scope.email
      }));
      $rootScope.email = $scope.email;
      $location.path('/');
    })
    .error(function() {
      $scope.loginError = true;
    });

  };

});
