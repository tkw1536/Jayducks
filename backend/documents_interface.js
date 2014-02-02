var ObjectID = require('mongodb').ObjectID // needed to handle _id

var utils = require('./utils');
var DocumentGroups_Interface = require('./documentgroups_interface');


// interface
var Documents = new Object();


Documents.exists = function(callback, id) {
    utils.exists(callback, this.collection["documents"], "_id", ObjectID(id.toString()));
};

Documents.create = function(callback, dgroupid, request) {
    // TODO: add groups in a better way
    var docid = undefined;
    var documents = undefined;
    var ccoll = this.collection["documentgroups"];
    var cccolll = this.collection["documents"]; // sorry...

    function adder_dummy(success, result) {
        if(success) {
            docid = result;

            // add parent entry
            utils.setProperty(
                function(success, res) {
                    // TODO: check if an error occurs here
                }, cccolll, "_id", ObjectID(docid.toString()), "parent", dgroupid, false
            );

            // get current course ids
            utils.getProperty(get_group_dummy, ccoll, "_id", ObjectID(dgroupid.toString()), "documents");
        } else {
            callback(false, result);
        }
    }

    function get_group_dummy(success, result) {
        if(success) {
            documents = result || [];

            // add and set new group id(s)
            documents.push(docid);
            utils.setProperty(set_group_dummy, ccoll, "_id", ObjectID(dgroupid.toString()), "documents", documents);
        } else {
            callback(false, result);
        }
    }

    function set_group_dummy(success, result) {
        if(success) {
            // create file
            var path = "./data/" + dgroupid + "/" + docid;

            // add path
            utils.setProperty(
                function(err, res) {
                    // TODO: check if an error occurs here
                }, cccolll, "_id", ObjectID(dgroupid.toString()), "path", path, false
            );

            utils.download_file(request, path);

            callback(true, docid);
        } else {
            callback(false, result);
        }
    }

    utils.createEntry(adder_dummy, this.collection["documents"], "name", "");
};

Documents.delete = function(callback, id) {
    var ccoll = this.collection["documents"];

    // delete file
    function delete_file(success, res) {
        if(!success) {
            callback(false, res);
            return;
        }

        // TODO: delete file
        
        // delete database entry
        utils.deleteEntry(callback, ccoll, "_id", ObjectID(id.toString()));
    }

    function dummy(success, res) {
        // TODO: handle error case
    }

    function got_group(success, res) {
        if(!success) {
            callback(false, res);
            return;
        }

        DocumentGroups_Interface.DocumentGroups.removeDocument(dummy, res, id);
    }

    Documents.getPath(delete_file, id);
    Documents.getGroup(got_group, id);
};

Documents.getName = function(callback, id) {
    utils.getProperty(callback, this.collection["documents"], "_id", ObjectID(id.toString()), "name");
};

Documents.setName = function(callback, id, name) {
    utils.setProperty(callback, this.collection["documents"], "_id", ObjectID(id.toString()), "name", name);
};

Documents.getGroup = function(callback, id) {
    utils.getProperty(callback, this.collection["documents"], "_id", ObjectID(id.toString()), "parent");
};

Documents.getAttributes = function(callback, id) {
    utils.getProperty(callback, this.collection["documents"], "_id", ObjectID(id.toString()), "attributes");
};

Documents.setAttributes = function(callback, id, attributes, merge) {
    var merge = (typeof merge === "undefined") ? false : merge;
    utils.setProperty(callback, this.collection["documents"], "_id", ObjectID(id.toString()), "attributes", attributes, merge);
};

Documents.getPath = function(callback, id) {
    utils.getProperty(callback, this.collection["documents"], "_id", ObjectID(id.toString()), "path");
};


// exports
exports.Documents = Documents;
