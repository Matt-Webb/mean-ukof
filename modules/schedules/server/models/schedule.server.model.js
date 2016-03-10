'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Schedule Schema
 */
var ScheduleSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    location: { // there is a user property "location" which can conflict with the main think with assign to location so "loacation-details" is used.
        type: Schema.ObjectId,
        ref: 'LocationDetails'
    },
    instructors: {
        type: [Schema.ObjectId],
        ref: 'Instructor'
    },
    user: { // who created! NOT who is assigned to it - thats instructor! D'oh
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Schedule', ScheduleSchema);
