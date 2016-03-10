'use strict';

(function () {
  // Schedules Controller Spec
  describe('Schedules Controller Tests', function () {
    // Initialize global variables
    var SchedulesController,
      scope,
      $httpBackend,
      $stateParams,
      $schedule,
      Authentication,
      Schedules,
      mockArticle;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$schedule_, _$stateParams_, _$httpBackend_, _Authentication_, _Schedules_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $schedule = _$schedule_;
      Authentication = _Authentication_;
      Schedules = _Schedules_;

      // create mock schedule
      mockArticle = new Schedules({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Article about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Schedules controller.
      SchedulesController = $controller('SchedulesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one schedule object fetched from XHR', inject(function (Schedules) {
      // Create a sample schedules array that includes the new schedule
      var sampleSchedules = [mockArticle];

      // Set GET response
      $httpBackend.expectGET('api/schedules').respond(sampleSchedules);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.schedules).toEqualData(sampleSchedules);
    }));

    it('$scope.findOne() should create an array with one schedule object fetched from XHR using a scheduleId URL parameter', inject(function (Schedules) {
      // Set the URL parameter
      $stateParams.scheduleId = mockArticle._id;

      // Set GET response
      $httpBackend.expectGET(/api\/schedules\/([0-9a-fA-F]{24})$/).respond(mockArticle);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.schedule).toEqualData(mockArticle);
    }));

    describe('$scope.create()', function () {
      var sampleArticlePostData;

      beforeEach(function () {
        // Create a sample schedule object
        sampleArticlePostData = new Schedules({
          title: 'An Article about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Article about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($schedule, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Schedules) {
        // Set POST response
        $httpBackend.expectPOST('api/schedules', sampleArticlePostData).respond(mockArticle);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the schedule was created
        expect($schedule.path.calls.mostRecent().args[0]).toBe('schedules/' + mockArticle._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/schedules', sampleArticlePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock schedule in scope
        scope.schedule = mockArticle;
      });

      it('should update a valid schedule', inject(function (Schedules) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/schedules\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL schedule to new object
        expect($schedule.path()).toBe('/schedules/' + mockArticle._id);
      }));

      it('should set scope.error to error response message', inject(function (Schedules) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/schedules\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(schedule)', function () {
      beforeEach(function () {
        // Create new schedules array and include the schedule
        scope.schedules = [mockArticle, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/schedules\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockArticle);
      });

      it('should send a DELETE request with a valid scheduleId and remove the schedule from the scope', inject(function (Schedules) {
        expect(scope.schedules.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($schedule, 'path');
        scope.schedule = mockArticle;

        $httpBackend.expectDELETE(/api\/schedules\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to schedules', function () {
        expect($schedule.path).toHaveBeenCalledWith('schedules');
      });
    });
  });
}());
