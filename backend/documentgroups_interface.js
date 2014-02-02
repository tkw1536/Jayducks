var ObjectID = require('mongodb').ObjectID // needed to handle _id

var utils = require('./utils');
var Documents_Interface = require('./documents_interface');


// interface
var DocumentGroups = new Object();


DocumentGroups.exists = function(callback, dgroupid) {
    utils.exists(callback, this.collection["documentgroups"], "_id", ObjectID(dgroupid.toString()));
};

DocumentGroups.create = function(callback, courseid) {
    // TODO: add groups in a better way
    var dgroupid = undefined;
    var groups = undefined;
    var ccoll = this.collection["courses"];
    var cccolll = this.collection["documentgroups"]; // -.-'

    function adder_dummy(success, result) {
        if(success) {
            dgroupid = result;

            // add parent entry
            utils.setProperty(
                function(err, res) {
                    // TODO: check if an error occurs here
                }, cccolll, "_id", ObjectID(dgroupid.toString()), "parent", courseid, false
            );

            // get current course ids
            utils.getProperty(get_group_dummy, ccoll, "_id", ObjectID(courseid.toString()), "groups");
        } else {
            callback(false, result);
        }
    }

    function get_group_dummy(success, result) {
        if(success) {
            groups = result || [];

            // add and set new group id(s)
            groups.push(dgroupid);
            utils.setProperty(set_group_dummy, ccoll, "_id", ObjectID(courseid.toString()), "groups", groups);
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

    utils.createEntry(adder_dummy, this.collection["documentgroups"], "name", "");
};

DocumentGroups.delete = function(callback, dgroupid) {
    var document_num = -1;

    function delete_documents(err, res) {
        function on_document_deleted(err, res) {
            if(err) {
                callback(false, err);
                return;
            }

            document_num--;

            if(document_num == 0) {
                // all groups are deleted
                utils.deleteEntry(callback, this.collection["documentgroups"], "_id", ObjectID(dgroupid.toString()));
            }
        }

        if(err) {
            callback(false, err);
            return;
        }

        document_num = res.length;
        for(var p in res) {
            var doc = res[p];
            Documents_Interface.Documents.delete(on_document_deleted, doc.toString());
        }
    }

    DocumentGroups.listGroups(delete_groups, courseid);
};

DocumentGroups.getName = function(callback, dgroupid) {
    utils.getProperty(callback, this.collection["documentgroups"], "_id", ObjectID(dgroupid.toString()), "name");
};

DocumentGroups.setName = function(callback, dgroupid, name) {
    utils.setProperty(callback, this.collection["documentgroups"], "_id", ObjectID(dgroupid.toString()), "name", name, false);
};

DocumentGroups.getCourse = function(callback, dgroupid) {
    utils.getProperty(callback, this.collection["documentgroups"], "_id", ObjectID(dgroupid.toString()), "parent");
};

DocumentGroups.getAttributes = function(callback, dgroupid) {
    utils.getProperty(callback, this.collection["documentgroups"], "_id", ObjectID(dgroupid.toString()), "attributes");
};

DocumentGroups.setAttributes = function(callback, dgroupid, attributes, merge) {
    var merge = (typeof merge === "undefined") ? false : merge;
    utils.setProperty(callback, this.collection["documentgroups"], "_id", ObjectID(dgroupid.toString()), "attributes", attributes, merge);
};


// exports
exports.DocumentGroups = DocumentGroups;
