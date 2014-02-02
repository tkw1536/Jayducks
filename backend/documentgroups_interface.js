var ObjectID = require('mongodb').ObjectID // needed to handle _id

var utils = require('./utils');
var Documents_Interface = require('./documents_interface');
var Courses_Interface = require('./courses_interface');


// interface
var DocumentGroups = new Object();


DocumentGroups.exists = function(callback, dgroupid) {
    utils.exists(callback, this.collection["documentgroups"], "_id", ObjectID(dgroupid.toString()));
};

DocumentGroups.create = function(callback, courseid) {
    // TODO: add groups in a better way
    var dgroupid = undefined;
    var groups = undefined;
    var me = this;

    function adder_dummy(success, result) {
        if(success) {
            dgroupid = result;

            // add parent entry
            utils.setProperty(
                function(err, res) {
                    // TODO: check if an error occurs here
                }, me.collection["documentgroups"], "_id", ObjectID(dgroupid.toString()), "parent", courseid, false
            );

            // add empty documents array
            utils.setProperty(
                function(err, res) {
                    // TODO: check if an error occurs here
                }, me.collection["documentgroups"], "_id", ObjectID(dgroupid.toString()), "documents", [], false
            );

            // get current course ids
            utils.getProperty(get_group_dummy, me.collection["courses"], "_id", ObjectID(courseid.toString()), "groups");
        } else {
            callback(false, result);
        }
    }

    function get_group_dummy(success, result) {
        if(success) {
            groups = result || [];

            // add and set new group id(s)
            groups.push(dgroupid);
            utils.setProperty(set_group_dummy, me.collection["courses"], "_id", ObjectID(courseid.toString()), "groups", groups);
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
    var me = this;

    function delete_documents(success, res) {
        function on_document_deleted(success, res) {
            // document actually deleted
            if(!success) {
                callback(false, res);
                return;
            }

            document_num--;

            if(document_num == 0) {
                // all documents are deleted
                utils.deleteEntry(callback, me.collection["documentgroups"], "_id", ObjectID(dgroupid.toString()));
            }
        }

        if(!success) {
            callback(false, res);
            return;
        }

        res = res || [];
        document_num = res.length;
        if(document_num == 0) {
            utils.deleteEntry(callback, me.collection["documentgroups"], "_id", ObjectID(dgroupid.toString()));
        } else {
            for(var p in res) {
                var doc = res[p];
                Documents_Interface.Documents.delete(on_document_deleted, doc.toString());
            }
        }
    }

    function dummy(success, res) {
        // document deleted from own list
        // TODO: handle this
    }

    function got_course(success, res) {
        if(!success) {
            callback(false, res);
            return;
        }

        Courses_Interface.Courses.removeGroup(dummy, res, dgroupid);
    }

    DocumentGroups.listDocuments(delete_documents, dgroupid);
    DocumentGroups.getCourse(got_course, dgroupid);
};

DocumentGroups.listDocuments = function(callback, dgroupid) {
    utils.getProperty(callback, this.collection["documentgroups"], "_id", ObjectID(dgroupid.toString()), "documents");
};

DocumentGroups.removeDocument = function(callback, dgroupid, docid) {
    var me = this;

    function set_documents(success, res) {
        if(!success) {
            callback(false, res);
            return;
        }
    }

    function got_documents(success, res) {
        if(!success) {
            callback(false, res);
            return;
        }

        res = res || [];
        var index = res.indexOf(docid);
        res.splice(index, 1);

        utils.setProperty(set_documents, me.collection["documentgroups"], "_id", ObjectID(dgroupid.toString()), "documents", res);
    }

    DocumentGroups.listDocuments(got_documents, dgroupid)
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
