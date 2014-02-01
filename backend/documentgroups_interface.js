var ObjectID = require('mongodb').ObjectID // needed to handle _id

var utils = require('./utils');


// interface
var DocumentGroups = new Object();


DocumentGroups.exists = function(callback, dgroupid) {
    utils.exists(callback, this.collection, "_id", ObjectID(dgroupid));
};

DocumentGroups.create = function(callback, courseid) {
    // TODO: add groups in a better way
    var dgroupid = undefined;
    var groups = undefined;
    var ccoll = this.course_collection;

    function adder_dummy(success, result) {
        if(success) {
            dgroupid = result;

            // get current course ids
            utils.getProperty(get_group_dummy, ccoll, "_id", ObjectID(courseid), "groups");
        } else {
            callback(false, result);
        }
    }

    function get_group_dummy(success, result) {
        if(success) {
            groups = result || [];

            // add and set new group id(s)
            groups.push(dgroupid);
            utils.setProperty(set_group_dummy, ccoll, "_id", ObjectID(courseid), "groups", groups);
        } else {
            callback(false, result);
        }
    }

    function set_group_dummy(success, result) {
        if(success) {
            callback(true, dgroupid);
        } else {
            callback(false, result);
        }
    }

    utils.addNew(adder_dummy, this.collection, "name", "");
};

DocumentGroups.delete = function(callback, dgroupid) {
    callback(false, "Not implemented");
};

DocumentGroups.getName = function(callback, dgroupid) {
    utils.getProperty(callback, this.collection, "_id", ObjectID(dgroupid), "name");
};

DocumentGroups.setName = function(callback, dgroupid, name) {
    utils.setProperty(callback, this.collection, "_id", ObjectID(dgroupid), "name", name, false);
};

DocumentGroups.getCourse = function(callback, dgroupid) {
    callback(false, "Not implemented (ask kpj if you need it)");
};

DocumentGroups.getAttributes = function(callback, dgroupid) {
    utils.getProperty(callback, this.collection, "_id", ObjectID(dgroupid), "attributes");
};

DocumentGroups.setAttributes = function(callback, dgroupid, attributes, merge) {
    var merge = (typeof merge === "undefined") ? false : merge;
    utils.setProperty(callback, this.collection, "_id", ObjectID(dgroupid), "attributes", attributes, merge);
};


// exports
exports.DocumentGroups = DocumentGroups;
