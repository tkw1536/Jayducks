var utils = require('./utils');

var Users_Interface = require('./users_interface');
var Courses_Interface = require('./courses_interface');
var DocumentGroups_Interface = require('./documentgroups_interface');
var Documents_Interface = require('./documents_interface');


// global variables
var db_connected = false;
var global_db = undefined;

// load interfaces
var Users = Users_Interface.Users;
var Courses = Courses_Interface.Courses;
var DocumentGroups = DocumentGroups_Interface.DocumentGroups;
var Documents = Documents_Interface.Documents;

// database setup
function setup_database(err, db) {
    if(err) {
        console.log("Error while connecting to the database");
        return console.dir(err);
    }

    db_connected = true;
    global_db = db;

    console.log("Successfully connected to database");

    // setup database access for interface objects
    Users.collection = global_db.collection("Students");
    Courses.collection = global_db.collection("Courses");

    // test some functions
    function dummy(success, result) {
        console.log("[DUMMY] - status: " + success + " | result: " + JSON.stringify(result));
    }
    Users.exists(dummy, "kpj2");
    Courses.exists(dummy, "52ed40ffd4e9690b39d96bb2");

//    Users.list(dummy);
//    Courses.list(dummy);

//    Users.registerNew(dummy, "kpj2");
//    Courses.create(dummy);

    Courses.setName(dummy, "52ed40ffd4e9690b39d96bb2", "HubbaBubba");
    Courses.getName(dummy, "52ed40ffd4e9690b39d96bb2");

    Users.setAttributes(dummy, "kpj2", {"food": "apple"}, true);
    Courses.setAttributes(dummy, "52ed40ffd4e9690b39d96bb2", {"importance": "very high"});

    Users.getAttributes(dummy, "kpj2");
    Courses.getAttributes(dummy, "52ed40ffd4e9690b39d96bb2");

    Courses.listGroups(dummy, "52ed40ffd4e9690b39d96bb2");

    //Documents.getPath(dummy, "42");

    //Users.deleteUser(dummy, "kpj");
    Courses.delete(dummy, "52ed40ffd4e9690b39d96bb2");
}

utils.connect_database(setup_database);


// exports
exports.connected = db_connected;

exports.Users = Users;
exports.Courses = Courses;
exports.DocumentGroups = DocumentGroups;
exports.Documents = Documents
