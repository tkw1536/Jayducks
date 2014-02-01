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
}

utils.connect_database(setup_database);


// exports
exports.connected = db_connected;

exports.Users = Users;
exports.Courses = Courses;
exports.DocumentGroups = DocumentGroups;
exports.Documents = Documents
