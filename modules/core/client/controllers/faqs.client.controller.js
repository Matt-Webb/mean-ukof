'use strict';

angular.module('core').controller('FaqsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);
