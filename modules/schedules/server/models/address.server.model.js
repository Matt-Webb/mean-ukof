'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Address Schema
 */
var AddressSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    venue: {
        type: String,
        optional: true
    },
    street: {
        type: String,
        optional: true,
        max: 100
    },
    city: {
        type: String,
        max: 50,
        optional: true
    },
    county: {
        type: String,
        max: 100,
        optional: true
    },
    longditude: {
        type: Number,
        decimal: true,
        optional: true
    },
    latitude: {
        type: Number,
        decimal: true,
        optional: true
    },
    postcode: {
        type: String,
        optional: true
    }
});

mongoose.model('Address', AddressSchema);
