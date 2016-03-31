'use strict';

describe('EventLocations E2E Tests:', function () {
  describe('Test eventEventLocations page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/eventEventLocations');
      expect(element.all(by.repeater('eventEventLocation in eventEventLocations')).count()).toEqual(0);
    });
  });
});
