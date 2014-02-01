// interface
var Documents = new Object();


Documents.exists = function(callback, id) {
    callback(false, "Not implemented");
};

Documents.create = function(callback, dgroupid, stream) {
    callback(false, "Not implemented");
};

Documents.delete = function(callback, id) {
    callback(false, "Not implemented");
};

Documents.getName = function(callback, id) {
    callback(false, "Not implemented");
};

Documents.setName = function(callback, id, name) {
    callback(false, "Not implemented");
};

Documents.getGroup = function(callback, id) {
    callback(false, "Not implemented");
};

Documents.getAttributes = function(callback, id) {
    callback(false, "Not implemented");
};

Documents.setAttributes = function(callback, id, attributes, merge) {
    callback(false, "Not implemented");
};

Documents.getPath = function(callback, id) {
    callback(false, "Not implemented");
};


// exports
exports.Documents = Documents;
