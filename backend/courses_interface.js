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
    var me = this;

    function on_create(success, res) {
        if(!success) {
            callback(false, res);
            return;
        }

        var cid = res;
        utils.setProperty(
            function(success, res) {
                if(!success) {
                    callback(false, res);
                    return;
                }
                callback(true, cid);
            }, me.collection["courses"], "_id", ObjectID(cid.toString()), "groups", []
        );
    }

    utils.createEntry(on_create, this.collection["courses"], "name", "");
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
    var me = this;

    function delete_groups(success, res) {
        function on_group_deleted(success, res) {
            // actual entry deleted
            if(!success) {
                callback(false, res);
                return;
            }

            group_num--;

            if(group_num == 0) {
                // all groups are deleted
                utils.deleteEntry(callback, me.collection["courses"], "_id", ObjectID(courseid.toString()));
            }
        }

        function on_group_removed(success, res) {
            // entry removed from own list
            // TODO: catch errors
        }

        if(!success) {
            callback(false, res);
            return;
        }

        res = res || [];

        group_num = res.length;
        if(group_num == 0) {
            // no groups to delete
            utils.deleteEntry(callback, me.collection["courses"], "_id", ObjectID(courseid.toString()));
        } else {
            for(var p in res) {
                var group = res[p];
                DocumentGroups_Interface.DocumentGroups.delete(on_group_deleted, group.toString());
            }
        }
    }

    Courses.listGroups(delete_groups, courseid);
};

Courses.removeGroup = function(callback, courseid, groupid) {
    var me = this;

    function set_groups(success, res) {
        if(!success) {
            callback(false, res);
            return;
        }
    }

    function got_groups(success, res) {
        if(!success) {
            callback(false, res);
            return;
        }

        res = res || [];
        var index = res.indexOf(groupid);
        res.splice(index, 1);

        utils.setProperty(set_groups, me.collection["courses"], "_id", ObjectID(courseid.toString()), "groups", res);
    }

    Courses.listGroups(got_groups, courseid);
}


// exports
exports.Courses = Courses;
