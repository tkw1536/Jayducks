// interface
var DocumentGroups = new Object();


DocumentGroups.exists = function(callback, dgroupid) {
    callback(false, "Not implemented");
};

DocumentGroups.create = function(callback, courseid) {
    callback(false, "Not implemented");
};

DocumentGroups.delete = function(callback, dgroupid) {
    callback(false, "Not implemented");
};

DocumentGroups.getName = function(callback, dgroupid) {
    callback(false, "Not implemented");
};

DocumentGroups.setName = function(callback, dgroupid, name) {
    callback(false, "Not implemented");
};

DocumentGroups.getCourse = function(callback, dgroupid) {
    callback(false, "Not implemented");
};

DocumentGroups.getAttributes = function(callback, dgroupid) {
    callback(false, "Not implemented");
};

DocumentGroups.setAttributes = function(callback, dgroupid, attributes, merge) {
    callback(false, "Not implemented");
};


// exports
exports.DocumentGroups = DocumentGroups;
