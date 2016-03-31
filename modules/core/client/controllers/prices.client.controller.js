'use strict';

angular.module('core').controller('PricesController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);
