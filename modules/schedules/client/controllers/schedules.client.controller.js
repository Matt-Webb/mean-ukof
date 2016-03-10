'use strict';

// Schedules controller
angular.module('schedules').controller('SchedulesController', ['$scope', '$stateParams', '$schedule', 'Authentication', 'Schedules',
  function ($scope, $stateParams, $schedule, Authentication, Schedules) {
    $scope.authentication = Authentication;

    // Create new Article
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'scheduleForm');

        return false;
      }

      // Create new Article object
      var schedule = new Schedules({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      schedule.$save(function (response) {
        $schedule.path('schedules/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Article
    $scope.remove = function (schedule) {
      if (schedule) {
        schedule.$remove();

        for (var i in $scope.schedules) {
          if ($scope.schedules[i] === schedule) {
            $scope.schedules.splice(i, 1);
          }
        }
      } else {
        $scope.schedule.$remove(function () {
          $schedule.path('schedules');
        });
      }
    };

    // Update existing Article
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'scheduleForm');

        return false;
      }

      var schedule = $scope.schedule;

      schedule.$update(function () {
        $schedule.path('schedules/' + schedule._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Schedules
    $scope.find = function () {
      $scope.schedules = Schedules.query();
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.schedule = Schedules.get({
        scheduleId: $stateParams.scheduleId
      });
    };
  }
]);
