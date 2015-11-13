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
    ref: 'DocumentType'
  },
  values: {},
  tags: [{
    tagId: {
      type: Schema.ObjectId,
      ref: "Tag"
    },
    name: String,
    weight: {
      type: Number,
      enum: [1, 2, 3, 5, 8, 13, 21],
      default: 21
    }
  }],
  readState: {
    type: String,
    enum: ["compeleted", "read later", "in progress"],
    default: "read later"
  },
  haveInCollection: {
    type: Boolean,
    default: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Document', DocumentSchema);

DocumentSchema.virtual('value').get(function () {
  var value = {};
  for (var i in this.values)
    value[this.values[i][0]] = this.values[i][1];

  if (this.values) {
    for (var i = 0; i < this.type.keys.length; i++)
      if (this.type.keys[i].primary)
        // key = this.values[Schema.ObjectId.toString(this.type.keys[i]._id)][1];
        if (this.values[this.type.keys[i].id])
          value.primary = this.values[this.type.keys[i].id][1];
  }


  return value;
});

DocumentSchema.virtual('key').get(function () {
  var key = {};
  
  for (var i = 0; i < this.type.keys.length; i++)
    key[this.type.keys[i].name] = this.type.keys[i];
    
  return key;
});
