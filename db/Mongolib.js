const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'jwt';

// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });

// Use connect method to connect to the Server

const getDatabase = (callback) => {
    client.connect(function (err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        callback(db, client);
    });
}

const insertDocuments = (db, callback, message) => {
    const collection = db.collection('auth');
    collection.insertMany([message], function (err, result) {
        console.log("Inserting document!")
        callback(result);
    });
}

const reset = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('auth');
    // Find some documents
    collection.drop(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

const findDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('auth');
    // Find some documents
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs)
        callback(docs); 
    });
}

exports.getDatabase = getDatabase;
exports.insertDocuments = insertDocuments;
exports.findDocuments = findDocuments;
exports.reset = reset;
