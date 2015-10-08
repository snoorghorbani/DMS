var keyModel = function (config) {
    this.name = config.name || "";
    this.type = config.type || "string";
    this.default = config.default || "";
    this.value = config.value || "";
};