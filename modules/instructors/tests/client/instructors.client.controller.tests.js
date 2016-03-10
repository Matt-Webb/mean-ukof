'use strict';

(function () {
  // Instructors Controller Spec
  describe('Instructors Controller Tests', function () {
    // Initialize global variables
    var InstructorsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Instructors,
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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Instructors_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Instructors = _Instructors_;

      // create mock instructor
      mockArticle = new Instructors({
        _id: '525a8422f6d0f87f0e407a33',
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Instructors controller.
      InstructorsController = $controller('InstructorsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one instructor object fetched from XHR', inject(function (Instructors) {
      // Create a sample instructors array that includes the new instructor
      var sampleInstructors = [mockArticle];

      // Set GET response
      $httpBackend.expectGET('api/instructors').respond(sampleInstructors);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.instructors).toEqualData(sampleInstructors);
    }));

    it('$scope.findOne() should create an array with one instructor object fetched from XHR using a instructorId URL parameter', inject(function (Instructors) {
      // Set the URL parameter
      $stateParams.instructorId = mockArticle._id;

      // Set GET response
      $httpBackend.expectGET(/api\/instructors\/([0-9a-fA-F]{24})$/).respond(mockArticle);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.instructor).toEqualData(mockArticle);
    }));


  });
}());
