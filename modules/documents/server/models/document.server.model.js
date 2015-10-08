'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Document Schema
 */
var DocumentSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  type: {
      type: Schema.ObjectId, 
      ref: 'DocumentType',
      required: 'Document Type cannot be blank'
  },
  values: {},
  readState:{
    type:String,
    enum:["compeleted", "read later","in progress"],
    default:"read later"
  },
  haveInCollection:{
    type: Boolean,
    default: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Document', DocumentSchema);
