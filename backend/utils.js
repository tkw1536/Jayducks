var MongoClient = require('mongodb').MongoClient;


// database stuff
function connect_database(callback) {
    MongoClient.connect("mongodb://box.w1536.tk:27017/hackathon-w14", callback);
}


// exports
exports.connect_database = connect_database;
