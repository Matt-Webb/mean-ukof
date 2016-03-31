'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  EventLocation = mongoose.model('EventLocation'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a eventEventLocation
 */
exports.create = function (req, res) {
  var eventEventLocation = new EventLocation(req.body);
  eventEventLocation.user = req.user;

  eventEventLocation.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(eventEventLocation);
    }
  });
};

/**
 * Show the current eventEventLocation
 */
exports.read = function (req, res) {
  res.json(req.eventEventLocation);
};

/**
 * Update a eventEventLocation
 */
exports.update = function (req, res) {
  var eventEventLocation = req.eventEventLocation;

  eventEventLocation.title = req.body.title;
  eventEventLocation.content = req.body.content;

  eventEventLocation.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(eventEventLocation);
    }
  });
};

/**
 * Delete an eventEventLocation
 */
exports.delete = function (req, res) {
  var eventEventLocation = req.eventEventLocation;

  eventEventLocation.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(eventEventLocation);
    }
  });
};

/**
 * List of EventLocations
 */
exports.list = function (req, res) {
  EventLocation.find().sort('-created').populate('user', 'displayName').exec(function (err, eventEventLocations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(eventEventLocations);
    }
  });
};

/**
 * EventLocation middleware
 */
exports.eventEventLocationByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'EventLocation is invalid'
    });
  }

  EventLocation.findById(id).populate('user', 'displayName').exec(function (err, eventEventLocation) {
    if (err) {
      return next(err);
    } else if (!eventEventLocation) {
      return res.status(404).send({
        message: 'No eventEventLocation with that identifier has been found'
      });
    }
    req.eventEventLocation = eventEventLocation;
    next();
  });
};
