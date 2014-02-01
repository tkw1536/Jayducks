var ObjectID = require('mongodb').ObjectID // needed to handle _id

var utils = require('./utils');
var DocumentGroups_Interface = require('./documentgroups_interface');


// interface
var Courses = new Object();


Courses.exists = function(callback, courseid) {
    utils.exists(callback, this.collection["courses"], "_id", ObjectID(courseid.toString()));
};

Courses.list = function(callback) {
    utils.listEntries(callback, this.collection["courses"]);
};

Courses.create = function(callback) {
    utils.createEntry(callback, this.collection["courses"], "name", "");
};

Courses.getName = function(callback, courseid) {
    utils.getProperty(callback, this.collection["courses"], "_id", ObjectID(courseid.toString()), "name");
};

Courses.setName = function(callback, courseid, name) {
    utils.setProperty(callback, this.collection["courses"], "_id", ObjectID(courseid.toString()), "name", name);
};

Courses.getAttributes = function(callback, courseid) {
    utils.getProperty(callback, this.collection["courses"], "_id", ObjectID(courseid.toString()), "attributes");
};

Courses.setAttributes = function(callback, courseid, attributes, merge) {
    var merge = (typeof merge === "undefined") ? false : merge;
    utils.setProperty(callback, this.collection["courses"], "_id", ObjectID(courseid.toString()), "attributes", attributes, merge);
};

Courses.listGroups = function(callback, courseid) {
    utils.getProperty(callback, this.collection["courses"], "_id", ObjectID(courseid.toString()), "groups");
};

Courses.delete = function(callback, courseid) {
    var group_num = -1;

    function delete_groups(err, res) {
        function on_group_deleted(err, res) {
            if(err) {
                callback(false, err);
                return;
            }

            group_num--;

            if(group_num == 0) {
                // all groups are deleted
                utils.deleteEntry(callback, this.collection["courses"], "_id", ObjectID(courseid.toString()));
            }
        }

        if(err) {
            callback(false, err);
            return;
        }

        group_num = res.length;
        for(var p in res) {
            var group = res[p];
            DocumentGroups_Interface.DocumentGroups.delete(on_group_deleted, group.toString());
        }
    }

    Courses.listGroups(delete_groups, courseid);
};


// exports
exports.Courses = Courses;
