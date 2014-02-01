// interface
var Courses = new Object();


Courses.exists = function(callback, courseid) {
    callback(false, "Not implemented");
};

Courses.list = function(callback) {
    callback(false, "Not implemented");
};

Courses.create = function(callback) {
    callback(false, "Not implemented");
};

Courses.getName = function(callback, courseid) {
    callback(false, "Not implemented");
};

Courses.setName = function(callback, courseid, name) {
    callback(false, "Not implemented");
};

Courses.getAttributes = function(callback, courseid) {
    callback(false, "Not implemented");
};

Courses.setAttributes = function(callback, courseid, attributes, merge) {
    callback(false, "Not implemented");
};

Courses.listGroups = function(callback, courseid) {
    callback(false, "Not implemented");
};

Courses.delete = function(callback, courseid) {
    callback(false, "Not implemented");
};


// exports
exports.Courses = Courses;
