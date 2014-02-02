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
    Users.collection = {
        "users": global_db.collection("Students"),
        "courses": global_db.collection("Courses"),
        "documentgroups": global_db.collection("DocumentGroups"),
        "documents": global_db.collection("Documents")
    };
    Courses.collection = {
        "users": global_db.collection("Students"),
        "courses": global_db.collection("Courses"),
        "documentgroups": global_db.collection("DocumentGroups"),
        "documents": global_db.collection("Documents")
    };
    DocumentGroups.collection = {
        "users": global_db.collection("Students"),
        "courses": global_db.collection("Courses"),
        "documentgroups": global_db.collection("DocumentGroups"),
        "documents": global_db.collection("Documents")
    };
    Documents.collection = {
        "users": global_db.collection("Students"),
        "courses": global_db.collection("Courses"),
        "documentgroups": global_db.collection("DocumentGroups"),
        "documents": global_db.collection("Documents")
    };


    // test some functions
    function dummy(success, result) {
        console.log("[DUMMY] - status: " + success + " | result: " + JSON.stringify(result));
    }

    if (false) {
        function bar(success, res) {
            Documents.create(dummy, res, null);
        }

        function foo(success, res) {
            DocumentGroups.create(bar, res);
        }

        Courses.create(foo);
    }

//    Documents.create(dummy, "52ed56f8ad74968342bfa3a7", null);

//    Users.exists(dummy, "kpj2");
//    Courses.exists(dummy, "52eda1416866c3e75c501fdf");
//    DocumentGroups.exists(dummy, "52ed56f8ad74968342bfa3a7");

//    Users.list(dummy);
//    Courses.list(dummy);

//    Users.registerNew(dummy, "kpj2");
    Courses.create(dummy);
//    DocumentGroups.create(dummy, "52ed9b6d6de368aa5aff626b");
//    Documents.create(dummy, "52ed9b7c6dbc4ab85ae095e5", null);

//    Courses.setName(dummy, "52ed53a0e236988c41c0d274", "jDogs");
//    Courses.getName(dummy, "52ed733291052c1a0f3a07cc");
//    DocumentGroups.setName(dummy, "52ed40bd9af82be938d3f49e", "Hottentotten");
//    DocumentGroups.getName(dummy, "52ed40bd9af82be938d3f49e");

//    Users.setAttributes(dummy, "kpj2", {"food": "apple"}, true);
//    Courses.setAttributes(dummy, "52ed40ffd4e9690b39d96bb2", {"importance": "very high"});

//    Users.getAttributes(dummy, "kpj2");
//    Courses.getAttributes(dummy, "52ed40ffd4e9690b39d96bb2");

//    Courses.listGroups(dummy, "52eda4b02bca191b5e4ac562");

//    Documents.getPath(dummy, "42");
//    DocumentGroups.getCourse(dummy, "52ed6ea7e808d84d4ae20883");

//    Users.deleteUser(dummy, "kpj");
//    Courses.delete(dummy, "52edaa7d889c590d603f29dc");
//    DocumentGroups.delete(dummy, "52edaa7d889c590d603f29dd");
//    Documents.delete(dummy, "52ed9ded933871b45b6369f4");
}

utils.connect_database(setup_database);


// exports
exports.connected = db_connected;

exports.Users = Users;
exports.Courses = Courses;
exports.DocumentGroups = DocumentGroups;
exports.Documents = Documents
