'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  DocumentType = mongoose.model('DocumentType'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a documentType
 */
exports.create = function (req, res) {
  var documentType = new DocumentType(req.body);
  documentType.user = req.user;

  documentType.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(documentType);
    }
  });
};

/**
 * Show the current documentType
 */
exports.read = function (req, res) {
  res.json(req.documentType);
};

/**
 * Update a documentType
 */
exports.update = function (req, res) {
  var documentType = req.documentType;

  // documentType.title = req.body.title;
  // documentType.description = req.body.description;
  //for(var k in req.body){
  //  documentType[k]= req.body[k];
  //}
documentType.keys= req.body.keys;

  documentType.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(documentType);
    }
  });
};

/**
 * Delete an documentType
 */
exports.delete = function (req, res) {
  var documentType = req.documentType;

  documentType.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(documentType);
    }
  });
};

/**
 * List of DocumentTypes
 */
exports.list = function (req, res) {
  DocumentType.find().sort('-created').populate('user', 'displayName').exec(function (err, documentTypes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(documentTypes);
    }
  });
};

/**
 * DocumentType middleware
 */
exports.documentTypeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'DocumentType is invalid'
    });
  }

  DocumentType.findById(id).populate('user', 'displayName').exec(function (err, documentType) {
    if (err) {
      return next(err);
    } else if (!documentType) {
      return res.status(404).send({
        message: 'No documentType with that identifier has been found'
      });
    }
    req.documentType = documentType;
    next();
  });
};
