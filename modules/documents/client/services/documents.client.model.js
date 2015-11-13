var keyModel = function (config) {
    config  = config || {};
    
    this.name = config.name || "";
    this.type = config.type || "string";
    this.default = config.default || "";
    this.value = config.value || "";
};
var documentModel = function (config) {
    config  = config || {};
    
    this.type = config.type ||  {};
    this.values = config.values || {};
    this.tags = config.tags || [];
};