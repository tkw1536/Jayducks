var utils = require('./utils');


// interface
var Users = new Object();


Users.exists = function(callback, username) {
    utils.exists(callback, this.collection["users"], "name", username);
};

Users.list = function(callback) {
    utils.listEntries(callback, this.collection["users"]);
};

Users.registerNew = function(callback, username) {
    utils.createEntry(callback, this.collection["users"], "name", username);
};

Users.getAttributes = function(callback, username) {
    utils.getProperty(callback, this.collection["users"], "name", username, "attributes");
};

Users.setAttributes = function(callback, username, attributes, merge) {
    var merge = (typeof merge === "undefined") ? false : merge;
    utils.setProperty(callback, this.collection["users"], "name", username, "attributes", attributes, merge);
};

Users.deleteUser = function(callback, username) {
    utils.deleteEntry(callback, this.collection["users"], "name", username);
};


// exports
exports.Users = Users;
