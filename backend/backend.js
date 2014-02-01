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
    DocumentGroups.collection = global_db.collection("DocumentGroups");
    DocumentGroups.course_collection = global_db.collection("Courses");
    Documents.collection = global_db.collection("Documents");
    Documents.dgroups_collection = global_db.collection("DocumentGroups");

    // test some functions
    function dummy(success, result) {
        console.log("[DUMMY] - status: " + success + " | result: " + JSON.stringify(result));
    }

//    Documents.create(dummy, "52ed56f8ad74968342bfa3a7", null);

//    Users.exists(dummy, "kpj2");
//    Courses.exists(dummy, "52ed40ffd4e9690b39d96bb2");
//    DocumentGroups.exists(dummy, "52ed56f8ad74968342bfa3a7");

//    Users.list(dummy);
//    Courses.list(dummy);

//    Users.registerNew(dummy, "kpj2");
//    Courses.create(dummy);
//    DocumentGroups.create(dummy, "52ed550da5721e1742de8665");

//    Courses.setName(dummy, "52ed53a0e236988c41c0d274", "jDogs");
//    Courses.getName(dummy, "52ed40ffd4e9690b39d96bb2");
//    DocumentGroups.setName(dummy, "52ed40bd9af82be938d3f49e", "Hottentotten");
//    DocumentGroups.getName(dummy, "52ed40bd9af82be938d3f49e");

//    Users.setAttributes(dummy, "kpj2", {"food": "apple"}, true);
//    Courses.setAttributes(dummy, "52ed40ffd4e9690b39d96bb2", {"importance": "very high"});

//    Users.getAttributes(dummy, "kpj2");
//    Courses.getAttributes(dummy, "52ed40ffd4e9690b39d96bb2");

//    Courses.listGroups(dummy, "52ed40ffd4e9690b39d96bb2");

    //Documents.getPath(dummy, "42");
//    DocumentGroups.getCourse(dummy, "52ed6ea7e808d84d4ae20883");

    //Users.deleteUser(dummy, "kpj");
//    Courses.delete(dummy, "52ed40ffd4e9690b39d96bb2");
}

utils.connect_database(setup_database);


// exports
exports.connected = db_connected;

exports.Users = Users;
exports.Courses = Courses;
exports.DocumentGroups = DocumentGroups;
exports.Documents = Documents
