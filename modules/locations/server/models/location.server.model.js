'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * EventLocation Schema
 */
var EventLocationSchema = new Schema({
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
  eventEventLocations: { // based array for multiple instances!
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


mongoose.model('EventLocation', EventLocationSchema);
