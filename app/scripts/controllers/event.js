'use strict';

angular.module('apps4europeAdminInterfaceApp')
  .controller('EventCtrl', function ($scope) {
    $scope.events = [{
      title: 'Lorem',
      date: '2014-03-12',
      apps: [1]
    }
    ];
  });
