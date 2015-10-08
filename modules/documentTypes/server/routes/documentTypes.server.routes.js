'use strict';

/**
 * Module dependencies.
 */
var documentTypesPolicy = require('../policies/documentTypes.server.policy'),
  documentTypes = require('../controllers/documentTypes.server.controller');

module.exports = function (app) {
  // DocumentTypes collection routes
  app.route('/api/documentTypes').all(documentTypesPolicy.isAllowed)
    .get(documentTypes.list)
    .post(documentTypes.create);

  // Single documentType routes
  app.route('/api/documentTypes/:documentTypeId').all(documentTypesPolicy.isAllowed)
    .get(documentTypes.read)
    .put(documentTypes.update)
    .delete(documentTypes.delete);

  // Finish by binding the documentType middleware
  app.param('documentTypeId', documentTypes.documentTypeByID);
};
