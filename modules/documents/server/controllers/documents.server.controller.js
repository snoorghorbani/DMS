'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Document = mongoose.model('Document'),
  DocumentType = mongoose.model('DocumentType'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a document
 */
exports.create = function (req, res) {
    var document = new Document(req.body);
    document.user = req.user;
    DocumentType.findById(req.body.type, function (err, documentType) {
        document.type = documentType._id;

        document.save(function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(document);
            }
        });
    });
};

/**
 * Show the current document
 */
exports.read = function (req, res) {
    res.json(req.document);
};

/**
 * Update a document
 */
exports.update = function (req, res) {
    var document = req.document;

    // document.title = req.body.title;
    // document.description = req.body.description;
    //for(var k in req.body){
    //  document[k]= req.body[k];
    //}
    document.keys = req.body.keys;
    document.values = req.body.values;
    document.haveInCollection = req.body.haveInCollection;
    document.readState = req.body.readState;

    document.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(document);
        }
    });
};

/**
 * Delete an document
 */
exports.delete = function (req, res) {
    var document = req.document;

    document.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(document);
        }
    });
};

/**
 * List of Documents
 */
exports.list = function (req, res) {
    Document.find().sort('-created').populate('user', 'displayName').exec(function (err, documents) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(documents);
        }
    });
};

/**
 * Document middleware
 */
exports.documentByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Document is invalid'
        });
    }

    Document.findById(id).populate('user', 'displayName').populate('type').exec(function (err, document) {
        if (err) {
            return next(err);
        } else if (!document) {
            return res.status(404).send({
                message: 'No document with that identifier has been found'
            });
        }
        req.document = document;
        next();
    });
};
