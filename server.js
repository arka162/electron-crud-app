(
    function () {
        "use strict";
        const { remote: myRemote } = require("electron");
        const _app = myRemote.app;
        const DB_BASE_PATH = `${_app.getPath('userData')}/Models`;
        var express = require('express');
        var bodyParser = require('body-parser');
        var jsonParser = bodyParser.json();
        var urlencodedParser = bodyParser.urlencoded({ extended: false })
        var http = require("http");
        var port = 2752;
        var app = express();
        var server = http.createServer(app);
        app.all("/*", function (req, res, next) {
            // CORS headers
            res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
            res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
            // Set custom headers for CORS
            res.header(
                "Access-Control-Allow-Headers",
                "Content-type,Accept,X-Access-Token,X-Key"
            );
            if (req.method == "OPTIONS") {
                res.status(200).end();
            } else {
                next();
            }
        });
        app.get("/", function (req, res) {
            res.send("Electron CRUD Application Local Server Started.");
        });
        var datastore = require("nedb");
        var bookDb = new datastore({ filename: DB_BASE_PATH + '/Books/books.db', autoload: true });
        var response, reqBody;
        app.get("/books/:_id", urlencodedParser, function (req, res) {
            console.log('get req', req);
            bookDb.loadDatabase();
            var _id = req.params._id;
            var recordsCount = 0;
            if (_id == '0') {
                bookDb.count({}).exec(function (err, count) {
                    // console.log('bookDb count err', err);
                    recordsCount = count;
                });
                bookDb.find({}).sort({ Count: -1 }).exec(function (err, data) {
                    // console.log('bookDb find err', err);
                    var response = {};
                    if (data.length > 0) {
                        response = { 'status': 1, 'result': { data: data, count: recordsCount } };
                        res.send(response);
                    }
                    else {
                        response = { 'status': 0, 'message': 'No books found in record.', 'result': { data: data, count: recordsCount } };
                        res.send(response);
                    }
                });
            }
            else {
                bookDb.findOne({ _id: _id }).exec(function (err, data) {
                    // console.log('bookDb find err', err);
                    var response = {};
                    response = { 'status': 1, 'result': { data: data, count: recordsCount } };
                    res.send(response);
                });
            }
        });
        app.post("/books", jsonParser, function (req, res) {
            console.log('post req', req);
            bookDb.loadDatabase();
            reqBody = req.body;
            bookDb.find({ BookName: reqBody.BookName }, function (err, docs) {
                if (docs.length === 0) {
                    //console.log('INSERT DOC');
                    bookDb.count({}).exec(function (err, count) {
                        // console.log('bookDb count err', err);
                        var insertData = {
                            Count: count + 1,
                            BookName: reqBody.BookName,
                            BookDescription: reqBody.BookDescription,
                            BookWriter: reqBody.BookWriter,
                            BookPublisher: reqBody.BookPublisher,
                            BookPublisherEmail: reqBody.BookPublisherEmail,
                        }
                        bookDb.insert(insertData, function (err, newDoc) {
                            response = { 'status': 1, 'message': 'Book added successfully.', 'result': { data: newDoc } };
                            res.send(response);
                        });
                    });
                } else {
                    console.log('Sorry, this book already exist.');
                    response = { 'status': 0, 'message': 'Sorry, this book already exist.' };
                    res.send(response);
                }
            });
        });
        app.put("/books", jsonParser, function (req, res) {
            console.log('put req', req);
            bookDb.loadDatabase();
            reqBody = req.body;
            bookDb.find({ BookName: reqBody.BookName, _id: { $ne: reqBody._id } }, function (err, docs) {
                if (docs.length === 0) {
                    //console.log('INSERT DOC');
                    var insertData = {
                        "BookName": reqBody.BookName,
                        "BookDescription": reqBody.BookDescription,
                        "BookWriter": reqBody.BookWriter,
                        "BookPublisher": reqBody.BookPublisher,
                        "BookPublisherEmail": reqBody.BookPublisherEmail,
                    }
                    bookDb.update({ _id: reqBody._id }, { $set: insertData }, function (err, newDoc) {
                        response = { 'status': 1, 'message': 'Book updated successfully.', 'result': { data: newDoc } };
                        res.send(response);
                    });
                } else {
                    console.log('Sorry, this book already exist.');
                    response = { 'status': 0, 'message': 'Sorry, this book already exist.' };
                    res.send(response);
                }
            });
        });
        app.delete("/books/:_id", urlencodedParser, function (req, res) {
            console.log('put req', req);
            bookDb.loadDatabase();
            var _id = req.params._id;
            bookDb.remove({ _id: _id }, function (err, count) {
                if (err) {
                    response = { 'status': 0, 'message': 'Cannot delete this book.', 'result': { data: {} } };
                    res.send(response);
                }
                else {
                    response = { 'status': 1, 'message': 'Book is deleted successfully.', 'result': { data: {} } };
                    res.send(response);
                }
            });
        });
        server.listen(port, 'localhost', () => console.log(`Listening on port ${port}`));
    }()
);