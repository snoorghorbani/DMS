var documentTagModel = function (config) {
    config = config || {};
    this.tagId = config.tagId || config._id ;
    this.name = config.name ;
    this.weight = config.weight || 21;
};