'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    Document = mongoose.model('Document'),
    DocumentType = mongoose.model('DocumentType'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a document
 */
exports.create = function (req, res) {
    var document;
    var createdDocs = [];
    var filesLength = req.body.files.length;
    DocumentType.findById(req.body.document.type._id, function (err, documentType) {
        if (req.body.files.length > 0) {
            var batchKey = _.filter(documentType.keys, function (key) {
                return key.batch;
            });
            if (batchKey.length > 0) batchKey = batchKey[0];
            else return;

            var primaryKey = _.filter(documentType.keys, function (key) {
                return key.primary;
            });
            if (primaryKey.length > 0) primaryKey = primaryKey[0];
            else return;

            _.each(req.body.files, function (file) {
                var document = new Document(_.cloneDeep(req.body.document));
                document.type = documentType._id;
                document.user = req.user;
                document.values = document.values || {};
                document.values[batchKey._id] = [batchKey.name, [file]];
                document.values[primaryKey._id] = [primaryKey.name, [file.name]];
                document.save(function (err, document) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        DocumentType.findByIdAndUpdate(document.type, { $push: { documents: document } }, function () {
                        });

                        createdDocs.push(document);
                        if (--filesLength === 0)
                            res.json(createdDocs);
                    }
                });
            });
        } else {
            document = new Document(req.body.document);
            document.user = req.user;
            document.type = documentType._id;
            document.save(function (err, document) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    DocumentType.findByIdAndUpdate(document.type, { $push: { documents: document } }, function () {
                    })
                    res.json(document);
                }
            });
        }
    });
};

/**
 * Show the current document
 */
exports.read = function (req, res) {
    res.json(req.document.toJSON({ virtuals: true }));
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
    document.tags = req.body.tags;

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
exports.instantiate = function (req, res) {
    var document = new Document();
    res.json(document);
}
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
    var query = req.query;

    var predicate = {};
    if (query.documentTypes)
        predicate['type'] = { $in: [query.documentTypes] };

    Document.find(predicate)
        .sort('-created')
        .populate('user', 'displayName')
        .populate('type')
        .exec(function (err, documents) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                var documentsWithVirtual = [];
                _.each(documents, function (document) {
                    documentsWithVirtual.push(document.toJSON({ virtuals: true }));
                });
                res.json(documentsWithVirtual);
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
