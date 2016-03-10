'use strict';

// Instructors controller
angular.module('instructors').controller('InstructorsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Instructors',
  function ($scope, $stateParams, $location, Authentication, Instructors) {
    $scope.authentication = Authentication;


    // Find a list of Instructors
    $scope.find = function () {
      $scope.instructors = Instructors.query();
    };

    // Find existing Instructor
    $scope.findOne = function () {
      $scope.instructor = Instructors.get({
        instructorId: $stateParams.instructorId
      });
    };
  }
]);
