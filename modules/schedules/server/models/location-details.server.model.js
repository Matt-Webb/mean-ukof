'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Address Schema
 */
var LocationDetailsSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        optional: true
    },
    address: {
        type: Schema.ObjectId,
        ref: 'Address'
    },
    image: { // url - provide default!
        type: String,
        optional: true
    },
    indoor: {
        type: Boolean
    },
    outdoor: {
        type: Boolean
    },
    active: {
        type: Boolean,
        optional: true
    }
});

mongoose.model('LocationDetails', LocationDetailsSchema);
