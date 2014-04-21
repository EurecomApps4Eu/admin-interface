'use strict';

angular.module('apps4europeAdminInterfaceApp')
  .controller('SettingsCtrl', function ($scope, $http, appSettings, initApp) {

    initApp('settings');

    $scope.message = window.apps4eu.message;
    delete window.apps4eu.message;
  });
