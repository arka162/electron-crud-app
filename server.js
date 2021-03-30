(
    function () {
        "use strict";
        const { remote: myRemote } = require("electron");
        const _app = myRemote.app;
        const DB_BASE_PATH = `${_app.getPath('userData')}/Models`;
        var express = require('express');
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
        app.get("/books", function (req, res) {
            bookDb.loadDatabase();
            var recordsCount = 0;
            bookDb.count({}).exec(function (err, TotalRecords) {
                console.log('bookDb count err', err);
                recordsCount = TotalRecords;
            });
            bookDb.find({}).sort({ id: -1 }).exec(function (err, data) {
                console.log('bookDb find err', err);
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
        });
        app.post("/books", function (req, res) {
            bookDb.loadDatabase();
            bookDb.find({ BookName: req.BookName }, function (err, docs) {
                if (docs.length === 0) {
                    //console.log('INSERT DOC');
                    docsProcess = {
                        "_myId": getMyId(req.BookName),
                        "BookName": req.BookName,
                        "BookDescription": req.BookDescription,
                        "BookWriter": req.BookWriter,
                        "BookPublisher": req.BookPublisher,
                        "BookReleaseDate": req.BookReleaseDate
                    }
                    bookDb.insert(docsProcess, function (err) { });
                    response = { 'status': 1, 'message': 'Book added successfully.' };
                    res.send(response);
                    //CreateToServer();
                } else {
                    console.log('Sorry, this book already exist.');
                    response = { 'status': 1, 'message': 'Sorry, this book already exist.' };
                    res.send(response);
                }
            });
        });
        server.listen(port, 'localhost', () => console.log(`Listening on port ${port}`));
        function getMyId(myString) {
            return btoa(encodeURI(myString));
        }
    }()
);