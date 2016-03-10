'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Schedule = mongoose.model('Schedule'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a schedule
 */
exports.create = function (req, res) {
  var schedule = new Schedule(req.body);
  schedule.user = req.user;

  schedule.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(schedule);
    }
  });
};

/**
 * Show the current schedule
 */
exports.read = function (req, res) {
  res.json(req.schedule);
};

/**
 * Update a schedule
 */
exports.update = function (req, res) {
  var schedule = req.schedule;

  schedule.title = req.body.title;
  schedule.content = req.body.content;

  schedule.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(schedule);
    }
  });
};

/**
 * Delete an schedule
 */
exports.delete = function (req, res) {
  var schedule = req.schedule;

  schedule.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(schedule);
    }
  });
};

/**
 * List of Schedules
 */
exports.list = function (req, res) {
  Schedule.find().sort('-created').populate('user', 'displayName').exec(function (err, schedules) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(schedules);
    }
  });
};

/**
 * Schedule middleware
 */
exports.scheduleByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Schedule is invalid'
    });
  }

  Schedule.findById(id).populate('user', 'displayName').exec(function (err, schedule) {
    if (err) {
      return next(err);
    } else if (!schedule) {
      return res.status(404).send({
        message: 'No schedule with that identifier has been found'
      });
    }
    req.schedule = schedule;
    next();
  });
};
