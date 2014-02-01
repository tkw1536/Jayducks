var utils = require('./utils');


// interface
var Users = new Object();


Users.exists = function(callback, username) {
    utils.exists(callback, this.collection, "name", username);
};

Users.list = function(callback) {
    utils.listEntries(callback, this.collection);
};

Users.registerNew = function(callback, username) {
    utils.addNew(callback, this.collection, "name", username);
};

Users.getAttributes = function(callback, username) {
    utils.getProperty(callback, this.collection, "name", username, "attributes");
};

Users.setAttributes = function(callback, username, attributes, merge) {
    var merge = (typeof merge === "undefined") ? false : merge;
    utils.setProperty(callback, this.collection, "name", username, "attributes", attributes, merge);
};

Users.deleteUser = function(callback, username) {
    utils.deleteEntry(callback, this.collection, "name", username);
};


// exports
exports.Users = Users;
