var express = require("express");
var app = express();
var fs = require("fs");
var server = require("http").Server(app);
var io = require("socket.io")(server);
var mongo = require("mongodb");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/AdvDB";
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
      
        dbo.collection('screen').find({myId:"0"}, {projection: {advArray: 1 , _id:0}}).toArray(function(err,collInfos){
          if (err) throw err;
          io.sockets.on("connection", function (socket) {
                socket.emit("getScreen", collInfos[0].advArray);
          });
        });
        
        dbo.collection("advData").findOne({myId: "1"}, function (err, result) {
          if (err) throw err;
          response.sendFile(__dirname + "/screen1.html");
          io.sockets.on("connection", function (socket) {
            socket.emit("getResult", result);
          });
          db.close();
        });
      });
      break;
    }
    case "2": {
      response.sendFile(__dirname + "/screen2.html");
      io.sockets.on("connection", function (socket) {
        fs.readFile("./data.json", (err, data) => {
          if (err) {
            console.log(err);
          }
          let json = JSON.parse(data);
          socket.emit("getJson", json);
        });
      });
      break;
    }
    case "3":
      {
        response.sendFile(__dirname + "/screen3.html");
        io.sockets.on("connection", function (socket) {
          fs.readFile("./data.json", (err, data) => {
            if (err) {
              console.log(err);
            }
            let json = JSON.parse(data);
            socket.emit("getJson", json);
          });
        });
      }
      break;
  }
});

server.listen(8080);
