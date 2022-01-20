var express = require("express");
var app = express();
var fs = require("fs");
var server = require("http").Server(app);
var io = require("socket.io")(server);
var mongo = require("mongodb");
var MongoClient = require("mongodb").MongoClient;
// var url = "mongodb://localhost:27017/AdvDB";
var url = "mongodb://127.0.0.1:27017/AdvDB"; // or localhost ot 127.0.0.1

const dataBase = require("./db.js");

dataBase();

app.use(express.static(__dirname + "/public"));

app.get("/", function (request, response) {
  const { screen } = request.query;
  switch (screen) {
    case "1": {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        const dbo = db.db("AdvDB");

        dbo
          .collection("advData")
          .find({ show: "0" })
          .toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            response.sendFile(__dirname + "/screen1.html");
            io.sockets.on("connection", function (socket) {
              socket.emit("getResult", result);
            });
          });
      });
      break;
    }
    case "2": {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        const dbo = db.db("AdvDB");

        dbo
          .collection("advData")
          .find({ show: "1" })
          .toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            response.sendFile(__dirname + "/screen2.html");
            io.sockets.on("connection", function (socket) {
              socket.emit("getResult", result);
            });
          });
      });
      break;
    }
    case "3":
      {
        MongoClient.connect(url, function (err, db) {
          if (err) throw err;
          const dbo = db.db("AdvDB");

          dbo
            .collection("advData")
            .find({ show: "2" })
            .toArray(function (err, result) {
              if (err) throw err;
              console.log(result);
              response.sendFile(__dirname + "/screen3.html");
              io.sockets.on("connection", function (socket) {
                socket.emit("getResult", result);
              });
            });
        });
        break;
      }
      case "admin":
        {
          response.sendFile(__dirname + "/logIn.html");
          let username;
          let userPassword;
          io.on('connection', function(socket) {
            socket.on('getDataAdmin', function(adminData) {
              username = adminData[0];
              userPassword = adminData[1];

              MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                  const dbo = db.db("AdvDB");
                  dbo.collection("userAdmin").find({}).toArray(function(err,result){
                    if (err) throw err;
                    if(result[0].userName == username && result[0].password == userPassword){
                      console.log("ok");
                      // app.get('/login', function (req, res) {
                      //   res.sendFile(__dirname + "/dashboard.html");
                      // });                    
                    }else{
                      socket.emit("validition");
                    }
                  });
              });
            });
          });
          break;
        }
  }
});

server.listen(8080);
