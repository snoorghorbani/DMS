'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * DocumentType Schema
 */
var DocumentTypeSchema = new Schema({
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
    // description: {
    //   type: String,
    //   default: '',
    //   trim: true
    // },
    keys: [{
        name: {
            type: String,
            default: '',
            trim: true
        },
        "type": {
            type: String,
            default: 'string',
            enum: ['number', 'text', 'string', 'boolean', 'date', 'regex']
        },
        "default": String,
        value: String
    }],
    documents: [{
        type: Schema.ObjectId,
        ref: "Document"
    }],
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('DocumentType', DocumentTypeSchema);
