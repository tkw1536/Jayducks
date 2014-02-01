var ObjectID = require('mongodb').ObjectID // needed to handle _id

var utils = require('./utils');


// interface
var Documents = new Object();


Documents.exists = function(callback, id) {
    utils.exists(callback, this.collection["documents"], "_id", ObjectID(id));
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
                function(err, res) {
                    // TODO: check if an error occurs here
                }, cccolll, "_id", ObjectID(dgroupid), "parent", dgroupid, false
            );

            // get current course ids
            utils.getProperty(get_group_dummy, ccoll, "_id", ObjectID(dgroupid), "documents");
        } else {
            callback(false, result);
        }
    }

    function get_group_dummy(success, result) {
        if(success) {
            documents = result || [];

            // add and set new group id(s)
            documents.push(docid);
            utils.setProperty(set_group_dummy, ccoll, "_id", ObjectID(dgroupid), "documents", documents);
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
                }, cccolll, "_id", ObjectID(dgroupid), "path", path, false
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
    // delete file
    function delete_file(err, res) {
        if(err) {
            callback(false, err);
            return;
        }

        // TODO: delete file
        
        // delete database entry
        utils.deleteEntry(callback, this.collection["documents"], "_id", ObjectID(id));
    }
    Documents.getPath(delete_file, id);
};

Documents.getName = function(callback, id) {
    utils.getProperty(callback, this.collection["documents"], "_id", ObjectID(id), "name");
};

Documents.setName = function(callback, id, name) {
    utils.setProperty(callback, this.collection["documents"], "_id", ObjectID(id), "name", name);
};

Documents.getGroup = function(callback, id) {
    utils.getProperty(callback, this.collection["documents"], "_id", ObjectID(id), "parent");
};

Documents.getAttributes = function(callback, id) {
    utils.getProperty(callback, this.collection["documents"], "_id", ObjectID(id), "attributes");
};

Documents.setAttributes = function(callback, id, attributes, merge) {
    var merge = (typeof merge === "undefined") ? false : merge;
    utils.setProperty(callback, this.collection["documents"], "_id", ObjectID(id), "attributes", attributes, merge);
};

Documents.getPath = function(callback, id) {
    utils.getProperty(callback, this.collection["documents"], "_id", ObjectID(id), "path");
};


// exports
exports.Documents = Documents;
