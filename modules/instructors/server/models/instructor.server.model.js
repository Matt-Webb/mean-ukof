'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Instructor Schema
 */
var InstructorSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String
  },
  role: {
    type: String,
    optional: true
  },
  locations: { // based array for multiple instances!
    type: Object,
    optional: true
  },
  bio: {
    type: String,
    optional: true
  },
  specialities: {
    type: [String],
    optional: true
  },
  image: { // url - provide default avatar
    type: String,
    optional: true
  },
  social: {
    type: Object,
    optional: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});


mongoose.model('Instructor', InstructorSchema);
