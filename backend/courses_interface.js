var ObjectID = require('mongodb').ObjectID // needed to handle _id

var utils = require('./utils');


// interface
var Courses = new Object();


Courses.exists = function(callback, courseid) {
    utils.exists(callback, this.collection, "_id", ObjectID(courseid));
};

Courses.list = function(callback) {
    utils.listEntries(callback, this.collection);
};

Courses.create = function(callback) {
    utils.addNew(callback, this.collection, "name", "");
};

Courses.getName = function(callback, courseid) {
    utils.getProperty(callback, this.collection, "_id", ObjectID(courseid), "name");
};

Courses.setName = function(callback, courseid, name) {
    utils.setProperty(callback, this.collection, "_id", ObjectID(courseid), "name", name);
};

Courses.getAttributes = function(callback, courseid) {
    utils.getProperty(callback, this.collection, "_id", ObjectID(courseid), "attributes");
};

Courses.setAttributes = function(callback, courseid, attributes, merge) {
    var merge = (typeof merge === "undefined") ? false : merge;
    utils.setProperty(callback, this.collection, "_id", ObjectID(courseid), "attributes", attributes, merge);
};

Courses.listGroups = function(callback, courseid) {
    utils.getProperty(callback, this.collection, "_id", ObjectID(courseid), "groups");
};

Courses.delete = function(callback, courseid) {
    utils.deleteEntry(callback, this.collection, "_id", ObjectID(courseid));
};


// exports
exports.Courses = Courses;
