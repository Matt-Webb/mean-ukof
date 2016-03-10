'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Instructor = mongoose.model('Instructor'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a instructor
 */
exports.create = function (req, res) {
  var instructor = new Instructor(req.body);
  instructor.user = req.user;

  instructor.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(instructor);
    }
  });
};

/**
 * Show the current instructor
 */
exports.read = function (req, res) {
  res.json(req.instructor);
};

/**
 * Update a instructor
 */
exports.update = function (req, res) {
  var instructor = req.instructor;

  instructor.title = req.body.title;
  instructor.content = req.body.content;

  instructor.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(instructor);
    }
  });
};

/**
 * Delete an instructor
 */
exports.delete = function (req, res) {
  var instructor = req.instructor;

  instructor.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(instructor);
    }
  });
};

/**
 * List of Instructors
 */
exports.list = function (req, res) {
  Instructor.find().sort('-created').populate('user', 'displayName').exec(function (err, instructors) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(instructors);
    }
  });
};

/**
 * Instructor middleware
 */
exports.instructorByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Instructor is invalid'
    });
  }

  Instructor.findById(id).populate('user', 'displayName').exec(function (err, instructor) {
    if (err) {
      return next(err);
    } else if (!instructor) {
      return res.status(404).send({
        message: 'No instructor with that identifier has been found'
      });
    }
    req.instructor = instructor;
    next();
  });
};
